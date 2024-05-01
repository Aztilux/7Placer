import Bot from "../../bot/Bot";
import Canvas from "../Canvas";

function CanvasImgToArray(canvas: Canvas) {

  const cloadercode = `
  const canvasworkerTimet = performance.now();
  const colors = [
      0xFFFFFF, 0xC4C4C4, 0x888888, 0x555555, 0x222222, 0x000000, 0x006600, 0x22B14C,
      0x02BE01, 0x51E119, 0x94E044, 0xFBFF5B, 0xE5D900, 0xE6BE0C, 0xE59500, 0xA06A42,
      0x99530D, 0x633C1F, 0x6B0000, 0x9F0000, 0xE50000, 0xFF3904, 0xBB4F00, 0xFF755F,
      0xFFC49F, 0xFFDFCC, 0xFFA7D1, 0xCF6EE4, 0xEC08EC, 0x820080, 0x5100FF, 0x020763,
      0x0000EA, 0x044BFF, 0x6583CF, 0x36BAFF, 0x0083C7, 0x00D3DD, 0x45FFC8, 0x003638,
      0x477050, 0x98FB98, 0xFF7000, 0xCE2939, 0xFF416A, 0x7D26CD, 0x330077, 0x005BA1,
      0xB5E8EE, 0x1B7400, 0xCCCCCC
  ];
  
  self.addEventListener('message', async (event) => {
      const imageResponse = await fetch('https://pixelplace.io/canvas/' + event.data + '.png?t200000=' + Date.now());
      const imageBlob = await imageResponse.blob();
      const imageBitmap = await createImageBitmap(imageBlob);
  
      const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);
  
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelData = imageData.data;
      const CanvasArray = Array.from({ length: canvas.width }, () => Array.from({ length: canvas.height }, () => 50));
  
      for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
              const pixelIndex = (y * canvas.width + x) * 4;
              const a = pixelData[pixelIndex + 3];
  
              if (a < 1) {
                  continue; // Skip transparent pixels
              }
  
              const r = pixelData[pixelIndex];
              const g = pixelData[pixelIndex + 1];
              const b = pixelData[pixelIndex + 2];
              const colornum = (r << 16) | (g << 8) | b;
  
              const colorIndex = colors.indexOf(colornum);
              CanvasArray[x][y] = colorIndex
          }
      }
  
      self.postMessage(CanvasArray);
      const canvasworkerendTime = performance.now();
      var processingTime = canvasworkerendTime - canvasworkerTimet;
      self.postMessage(processingTime);
  });
  `;
  
const cloaderblob = new Blob([cloadercode], {
  type: 'application/javascript'
});
const canvasworker = new Worker( URL.createObjectURL(cloaderblob) );

canvasworker.onmessage = function(event) {
  if (Array.isArray(event.data)) {
  var CanvasArray = event.data;
  }
  else {
    console.log(`Processing took: ${Math.round(event.data)}ms`);
  }
  return CanvasArray
};
canvasworker.postMessage(canvas.ID);
}

export default CanvasImgToArray