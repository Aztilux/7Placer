import Canvas from "../Canvas";

export async function processWater(): Promise<number[][]> {
    var image = await fetch('https://pixelplace.io/canvas/' + Canvas.instance.ID + 'p.png?t200000=' + Date.now());
    if (!image.ok) {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        var waterArray = Array.from({ length: canvas.width }, () => Array.from({ length: canvas.height }, () => 1));
        return waterArray
    }
    const blob = await image.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    var waterArray = Array.from({ length: canvas.width }, () => Array.from({ length: canvas.height }, () => 1));
    const context = canvas.getContext('2d', { "willReadFrequently": true });
    context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
        if (bitmap.width == 1 && bitmap.height == 1) { // custom canvases ?
            resolve(waterArray);
        }
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

    const canvas = Canvas.instance
    const startColorsTime = performance.now();
    const pixelplace_canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = pixelplace_canvas.getContext('2d', { "willReadFrequently": true });
    const imageData = ctx.getImageData(0, 0, pixelplace_canvas.width, pixelplace_canvas.height);
    const pixelData = imageData.data;
    var CanvasArray = Array.from({ length: pixelplace_canvas.width }, () => Array.from({ length: pixelplace_canvas.height }, () => 1));
    if (waterArray.length > 1) {
        CanvasArray = waterArray;
    }
    for (let y = 0; y < pixelplace_canvas.height; y++) {
        for (let x = 0; x < pixelplace_canvas.width; x++) {
            if (CanvasArray[x][y] == 200) {
                continue;
            }
            const pixelIndex = (y * pixelplace_canvas.width + x) * 4;

            const r = pixelData[pixelIndex];
            const g = pixelData[pixelIndex + 1];
            const b = pixelData[pixelIndex + 2];
            const colorIndex = canvas.colors.findIndex(color =>
              color[0] === r && color[1] === g && color[2] === b
            );
            CanvasArray[x][y] = colorIndex;
        }
    }
    console.log(CanvasArray);
    Canvas.instance.canvasArray = CanvasArray;
    const finalTotalTime = performance.now() - startTotalTime;
    const finalColorsTime = performance.now() - startColorsTime
    const finalWaterTime = startColorsTime - startTotalTime;
    console.log(`[7p PROCESSING] Total Time: ${finalTotalTime}ms, Colors Time: ${finalColorsTime}ms, Water Time: ${finalWaterTime}ms`);
}
