import { canvascss } from "../css/style";
import { processWater, processColors } from "./util/canvasloader";

export class Canvas {
    public static isProcessed: boolean
    public static ID: number
    public static customCanvas: any
    private _CanvasArray: any[]
    private static _instance: Canvas    

    private constructor() {
      Canvas.ID = this.ParseID()
      processColors()
      Canvas.isProcessed = false
      Canvas.customCanvas = this.createPreviewCanvas()
    }

    private ParseID(): number {
      return parseInt(window.location.href.split("/").slice(-1)[0].split("-")[0]);
    }

    public static get instance() {
      if (!Canvas._instance) Canvas._instance = new Canvas
      return Canvas._instance
    }

    public set CanvasArray(array: any[]) {
      this._CanvasArray = array
      Canvas.isProcessed = true
    }
    public get CanvasArray() {
      return this._CanvasArray
    }

    public getColor(x: number, y: number) {
      try { return this._CanvasArray[x][y] }
      catch { return 50 };
    }

    public updatePixel(x: number, y: number, color: number) {
            if (!Canvas.isProcessed) return
            this.CanvasArray[x][y] = color
            // console.log(this.getColor(x, y), "->", color) 
    }

    public createPreviewCanvas() {
        const canvas: any = $(`<canvas width="2500" height="2088">`).css(canvascss);

        $('#canvas').ready(function() {
          $('#painting-move').append(canvas)                        
        });
        const ctx = canvas[0].getContext("2d");
        return ctx
    }


}

export default Canvas
