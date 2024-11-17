import Canvas from '../../canvas/Canvas';
import '../../variables';
import Queue from './SevenQueue';

const seven = (window as any).seven

const colors = [
  0xFFFFFF, 0xC4C4C4, 0xA6A6A6, 0x888888, 0x6F6F6F, 0x555555, 0x3A3A3A, 0x222222, 
  0x000000, 0x003638, 0x006600, 0x477050, 0x1B7400, 0x22B14C, 0x02BE01, 0x51E119, 
  0x94E044, 0x34EB6B, 0x98FB98, 0x75CEA9, 0xCAFF70, 0xFBFF5B, 0xE5D900, 0xFFCC00, 
  0xC1A162, 0xE6BE0C, 0xE59500, 0xFF7000, 0xFF3904, 0xE50000, 0xCE2939, 0xFF416A, 
  0x9F0000, 0x4D082C, 0x6B0000, 0x440414, 0xFF755F, 0xA06A42, 0x633C1F, 0x99530D, 
  0xBB4F00, 0xFFC49F, 0xFFDFCC, 0xFF7EBB, 0xFFA7D1, 0xEC08EC, 0xBB276C, 0xCF6EE4, 
  0x7D26CD, 0x820080, 0x591C91, 0x330077, 0x020763, 0x5100FF, 0x0000EA, 0x044BFF, 
  0x013182, 0x005BA1, 0x6583CF, 0x36BAFF, 0x0083C7, 0x00D3DD, 0x45FFC8, 0xB5E8EE
];

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
  const ctx = Canvas.customCanvas
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
    processed.forEach((pixel: { x: number; y: number; color: number; }) => 
      Queue.add(pixel.x + x, pixel.y + y, pixel.color)
    )
    Queue.start()
}