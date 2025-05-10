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

    self.onmessage = function (e) { // {imageData: ImageData, palette: [r, g, b][]}
        const pixelData = e.data.imageData.data
        const result = []
        for (let y = 0; y < e.data.imageData.height; y++) {
            for (let x = 0; x < e.data.imageData.width; x++) {
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

export async function imageData2array(imageData: ImageData, palette: [r: number, g: number, b: number][], dither?: string): Promise<{ x: number; y: number; color: number; }[]> { // dither options: FloydSteinberg, FalseFloydSteinberg, Stucki, Atkinson, Jarvis, Burkes, Sierra, TwoSierra, SierraLite
    const t0 = performance.now();
    const processing_toast = Toastify ({
        text: `Processing image...`,
        duration: 100000,
        style: {
            background: "#1a1a1a",
            border: "solid var(--gui-main-color)"
        },
    }).showToast();
    if (dither) {
        const quant = new RgbQuant({palette: Canvas.instance.colors})
        quant.sample(imageData);
        quant.reduce(imageData, 1, dither)
    }
    const final_result = await new Promise<{ x: number; y: number; color: number; }[]>(resolve => {
        const worker = new Worker(blobUrl);
        var result = []
        worker.postMessage({ imageData: imageData, palette: palette });
        worker.onmessage = function (e) {
            worker.terminate();
            resolve(e.data);
        };
    });
    processing_toast.hideToast();
    Toastify ({
        text: `Image processed!`,
        style: {
            background: "#1a1a1a",
            border: "solid rgb(0, 255, 81)"
        },
    }).showToast();
    return final_result;
}

export async function imageBitmap2imageData(image: ImageBitmap) {
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return imageData
}

export async function botImage(x: number, y: number, image: File) {
    if (x == undefined || y == undefined || !image) return;
    const seven = window.seven;
    const bitmap = await createImageBitmap(image);
    let image_data = await imageBitmap2imageData(bitmap);
    let processed = await imageData2array(image_data, Canvas.instance.colors, window.seven.dither)
    previewCanvasImage(x, y, image);
    processed = await sort(processed, seven.order)
    processed.forEach((pixel: { x: number; y: number; color: number; }) => {
        pixel.x += x
        pixel.y += y
    });
    Queue.bulkAdd(processed, true)
}
