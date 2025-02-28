import Canvas from '../../canvas/Canvas';
import '../../variables';
import Queue from './SevenQueue';
import { colors } from '../../canvas/util/colors';
import sort from './SevenSorting';

function getColorDistance(c1: number, c2: number) {
  // Image Color
  const r1 = (c1 >> 16) & 0xFF;
  const g1 = (c1 >> 8) & 0xFF;
  const b1 = c1 & 0xFF;
  // Pixelplace Color
  const r2 = (c2 >> 16) & 0xFF;
  const g2 = (c2 >> 8) & 0xFF;
  const b2 = c2 & 0xFF;
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
}

function findClosestColor(color: number) {
  let minDistance = Infinity;
  let colorNumber: number
  let index = 0
  for (const pxpColor of colors) {
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
      const colornum = (r << 16) | (g << 8) | b;
      if (a < 1) {
        continue; // ignore transparent pixels
      }
      const color = findClosestColor(colornum);
      result.push({x, y, color});
    }
  }
  
  return result;
}

export async function botImage(x: number, y: number, image: any | File) {
    const bitmap = await createImageBitmap(image)
    const processed = await ImageToPixels(bitmap)
    previewCanvasImage(x, y, image)
    sort(processed, (window as any).seven.order)
    processed.forEach((pixel: { x: number; y: number; color: number; }) => 
      Queue.add(pixel.x + x, pixel.y + y, pixel.color, true)
    )
}