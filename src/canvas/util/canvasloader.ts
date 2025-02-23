import Canvas from "../Canvas";
import { colors } from "./colors";

export async function processWater(): Promise<number[][]> { 
  const image = await fetch('https://pixelplace.io/canvas/' + Canvas.ID + 'p.png?t200000=' + Date.now());
  const blob = await image.blob();
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext('2d');
  context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  var waterArray = Array.from({ length: canvas.width }, () => Array.from({ length: canvas.height }, () => 1));
  return new Promise((resolve) => {
	for (let y = 0; y < canvas.height; y++) {
	  for (let x = 0; x < canvas.width; x++) {
		  const index = (y * imageData.width + x) * 4;
		  var r = imageData.data[index];
		  var g = imageData.data[index + 1];
		  var b = imageData.data[index + 2];
		  if (r == 204 && g == 204 && b == 204) {
			waterArray[x][y] = 200;
		  }
	  }
	}
	console.log(waterArray);
	resolve(waterArray);    
  }) 
}

export async function processColors() {
  const startTotalTime = performance.now();
  const waterArray: number[][] = await processWater();
  const startColorsTime = performance.now();
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelData = imageData.data;
  const CanvasArray = Array.from({ length: canvas.width }, () => Array.from({ length: canvas.height }, () => -1));
  const colorMap = new Map(colors.map((c, i) => [c, i]));
	
  	const area = canvas.width * canvas.height;
	var pixelIndex = 0;
	for (let i = 0; i < area; i++) {
		const x = i % canvas.width;
    	const y = (i / canvas.width) | 0;
		  if (waterArray[x][y] == 200) {
			CanvasArray[x][y] = 200;
			var pixelIndex = 0;
			continue;
		  };

		  const r = pixelData[pixelIndex];
		  const g = pixelData[pixelIndex + 1];
		  const b = pixelData[pixelIndex + 2];
		  const colornum = (r << 16) | (g << 8) | b;

		  CanvasArray[x][y] = colorMap.has(colornum) ? colorMap.get(colornum) : -1;

		  pixelIndex += 4;
	  }
  console.log(CanvasArray);
  Canvas.instance.CanvasArray = CanvasArray;
  const finalTotalTime = performance.now() - startTotalTime;
  const finalColorsTime = performance.now() - startColorsTime
  const finalWaterTime = startColorsTime - startTotalTime;
  console.log(`[7p PROCESSING] Total Time: ${finalTotalTime}ms, Colors Time: ${finalColorsTime}ms, Water Time: ${finalWaterTime}ms`);
}