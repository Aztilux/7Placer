import Bot from "../bot/Bot";
import loadcanvas from "./util/canvasloader";

export class Canvas {
    private CanvasProcessed: boolean
    public static ID: number
    private _CanvasArray: any[]
    private static _instance: Canvas
    public static customCanvas: any

    constructor() {
      Canvas.ID = this.ParseID()
      this.CanvasProcessed = false
      loadcanvas(this)
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
      this.CanvasProcessed = true
    }
    public get CanvasArray() {
      return this._CanvasArray
    }

    public getColor(x: number, y: number) {
      try { return this._CanvasArray[x][y] }
      catch { return 50 };
    }

    public updatePixel(x: number, y: number, color: number) {
            if (!this.CanvasProcessed) return
            this.CanvasArray[x][y] = color
            // console.log(this.getColor(x, y), "->", color) 
    }

    public createPreviewCanvas() {
        const canvas: any = $(`<canvas width="2500" height="2088">`).css({ position: 'absolute', pointerEvents: 'none', left: '0px', top:'0px', imageRendering: 'pixelated', opacity: '50%'});

        $('#canvas').ready(function() {
          $('#painting-move').append(canvas)                        
        });
        const ctx = canvas[0].getContext("2d");
        console.log(ctx)
        return ctx
    }


}

export default Canvas
