import '../variables';
import Queue from './SevenQueue';

const seven = (window as any).seven

const colors = [
  0xFFFFFF, 0xC4C4C4, 0x888888, 0x555555, 0x222222, 0x000000, 0x006600, 0x22B14C,
  0x02BE01, 0x51E119, 0x94E044, 0xFBFF5B, 0xE5D900, 0xE6BE0C, 0xE59500, 0xA06A42,
  0x99530D, 0x633C1F, 0x6B0000, 0x9F0000, 0xE50000, 0xFF3904, 0xBB4F00, 0xFF755F,
  0xFFC49F, 0xFFDFCC, 0xFFA7D1, 0xCF6EE4, 0xEC08EC, 0x820080, 0x5100FF, 0x020763,
  0x0000EA, 0x044BFF, 0x6583CF, 0x36BAFF, 0x0083C7, 0x00D3DD, 0x45FFC8, 0x003638,
  0x477050, 0x98FB98, 0xFF7000, 0xCE2939, 0xFF416A, 0x7D26CD, 0x330077, 0x005BA1,
  0xB5E8EE, 0x1B7400, 0xCCCCCC
];

function getEuclideanDistance(c1: number, c2: number) {
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
    const distance = getEuclideanDistance(color, pxpColor);
    if (distance < minDistance) {
      minDistance = distance;
      colorNumber = index
    }
    index += 1
  }
  return colorNumber;
}
``
export async function ImageToPixels(image: ImageBitmap) {
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

export async function botImage(x: number, y: number, image: any[]) {
    // console.log(x, y, image)
    image.forEach((pixel) => 
      Queue.add(pixel.x + x, pixel.y + y, pixel.color)
    )
    Queue.start()
}