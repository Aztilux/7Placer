import Canvas from '../../canvas/Canvas';
import '../../variables';
import Queue from './Queue';
import sort from './Sorting';

export function hex2rgb(hex: string): [r: number, g: number, b: number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return [ r, g, b ];
}

// function getColorDistance(c1: {r: number, g: number, b: number}, c2: [r: number, g: number, b: number]) {
//     return (c1.r - c2[0]) ** 2 + (c1.g - c2[1]) ** 2 + (c1.b - c2[2]) ** 2;
// }

// function findClosestColor(color: {r: number, g: number, b: number}, palette: [r: number, g: number, b:number][]) {
//     let minDistance = Infinity;
//     let colorNumber: number
//     let index = 0
//     for (const palette_color of palette) {
//         const distance = getColorDistance(color, palette_color);
//         if (distance < minDistance) {
//         minDistance = distance;
//         colorNumber = index
//         }
//         index += 1
//     }
//     return colorNumber;
// }

function previewCanvasImage (x: number, y: number, image: File) {
    const canvas = Canvas.instance;
    const ctx = canvas.previewCanvas;
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, x, y);
    };
    img.src = URL.createObjectURL(image);
}

const workerCode = `
    function getColorDistance(c1, c2) {
        return (c1.r - c2[0]) ** 2 + (c1.g - c2[1]) ** 2 + (c1.b - c2[2]) ** 2;
    }
    function findClosestColor(color, palette) {
        let minDistance = Infinity;
        let colorNumber
        let index = 0
        for (const palette_color of palette) {
            const distance = getColorDistance(color, palette_color);
            if (distance < minDistance) {
            minDistance = distance;
            colorNumber = index
            }
            index += 1
        }
        return colorNumber;
    }

    self.onmessage = function (e) { // {imageData: ImageData, palette: [r, g, b][],  y_division_last: number, x_division_last: number}
        const pixelData = e.data.imageData.data
        const result = []
        for (let y = 0; y < e.data.y_division_last; y++) {
            for (let x = 0; x < e.data.x_division_last; x++) {
                const pixelIndex = (y * e.data.imageData.width + x) * 4;
                const r = pixelData[pixelIndex];
                const g = pixelData[pixelIndex + 1];
                const b = pixelData[pixelIndex + 2];
                const a = pixelData[pixelIndex + 3];
                if (a < 1) {
                    continue; // ignore transparent pixels
                };
                const color = findClosestColor({r, g, b}, e.data.palette);
                result.push({x, y, color});
            };
        }
        self.postMessage(result);
    };
`;
const blob = new Blob([workerCode], { type: 'application/javascript' });
const blobUrl = URL.createObjectURL(blob);

function imageData2array(imageData: ImageData, thread_amount: number, palette: [r: number, g: number, b: number][]) {
    const t0 = performance.now();
    return new Promise(resolve => {
        const workers_global_result: {x: number, y: number, color: number}[] = [];
        let workers = 0
        let workers_done = 0
        for (let divison_y = 0; divison_y < imageData.height; divison_y += (imageData.height / thread_amount)) {
            const y_division_last = divison_y + (imageData.height / thread_amount)
            for (let division_x = 0; division_x < imageData.width; division_x += (imageData.width / thread_amount)) {
                const x_division_last = division_x + (imageData.width / thread_amount)
                const worker = new Worker(blobUrl);
                workers += 1
                worker.postMessage({imageData: imageData, palette: palette, y_division_last: y_division_last, x_division_last: x_division_last});
                worker.onmessage = function (e) {
                    const worker_pixels = e.data
                    worker.terminate();
                    workers_done += 1
                    console.log(workers_done)
                    worker_pixels.forEach((pixel: {x: number, y: number, color: number}) => {
                        workers_global_result.push(pixel)
                    });
                    if (workers == workers_done) {
                        console.log(`ImageData processed in ${performance.now() - t0} ms`)
                        resolve(workers_global_result)
                    }
                }
            }
        }
    })
    .then((final_result: {x: number, y: number, color: number}[]) => {
        return final_result
    })
}

export async function ImageToPixels(image: ImageBitmap, dither?: string, palette?: [r: number, g: number, b: number][]) { // dither options: FloydSteinberg, FalseFloydSteinberg, Stucki, Atkinson, Jarvis, Burkes, Sierra, TwoSierra, SierraLite
    const processing_toast = Toastify ({
        text: `Processing image...`,
        duration: 100000,
        style: {
            background: "#1a1a1a",
            border: "solid  #7300ff"
        },
    }).showToast();
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (dither) {
        const quant = new RgbQuant({palette: Canvas.instance.colors})
        quant.sample(imageData);
        quant.reduce(imageData, 1, dither)
    }
    const array = await imageData2array(imageData, 2, palette || Canvas.instance.colors);
    processing_toast.hideToast();
    Toastify ({
        text: `Image processed!`,
        style: {
            background: "#1a1a1a",
            border: "solid rgb(0, 255, 81)"
        },
    }).showToast();
    return array
}

export async function botImage(x: number, y: number, image: File) {
    if (!x || !y || !image) return;
    const seven = window.seven;
    const bitmap = await createImageBitmap(image);
    let processed = await ImageToPixels(bitmap, window.seven.dither);
    previewCanvasImage(x, y, image);
    processed = await sort(processed, seven.order)
    processed.forEach((pixel: { x: number; y: number; color: number; }) => {
        pixel.x += x
        pixel.y += y
    });
    Queue.bulkAdd(processed, true)
}
