import Canvas from '../../canvas/Canvas';
import '../../variables';
import Queue from './Queue';
import sort from './Sorting';

export function hex2rgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // return {r, g, b}
  return { r, g, b };
}

function getColorDistance(c1: {r: number, g: number, b: number}, c2: {r: number, g: number, b: number}) {
  return (c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2;
}

function findClosestColor(color: {r: number, g: number, b: number}) {
    const canvas = Canvas.instance
    let minDistance = Infinity;
    let colorNumber: number
    let index = 0
    for (const pxpColor of canvas.colors) {
        const distance = getColorDistance(color, pxpColor);
        if (distance < minDistance) {
        minDistance = distance;
        colorNumber = index
        }
        index += 1
    }
    return colorNumber;
}

function previewCanvasImage (x: number, y: number, image: File) {
  const canvas = Canvas.instance
  const ctx = canvas.previewCanvas
  const img = new Image();
  img.onload = function() {
      ctx.drawImage(img, x, y);
  };
  img.src = URL.createObjectURL(image);
}

export async function ImageToPixels(image: any) {
  const result = [];
  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelData = imageData.data;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const pixelIndex = (y * canvas.width + x) * 4;
      const r = pixelData[pixelIndex];
      const g = pixelData[pixelIndex + 1];
      const b = pixelData[pixelIndex + 2];
      const a = pixelData[pixelIndex + 3];
      if (a < 1) {
        continue; // ignore transparent pixels
      }
      const color = findClosestColor({r, g, b});
      result.push({x, y, color});
    }
  }

  return result;
}

export async function botImage(x: number, y: number, image: File) {
    if (!x || !y || !image) return
    const seven = window.seven
    const bitmap = await createImageBitmap(image)
    const processed = await ImageToPixels(bitmap)
    previewCanvasImage(x, y, image)
    sort(processed, seven.order)
    processed.forEach((pixel: { x: number; y: number; color: number; }) => Queue.add(pixel.x + x, pixel.y + y, pixel.color, true)
    )
}
