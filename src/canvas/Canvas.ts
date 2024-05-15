import Bot from "../bot/Bot";
import loadcanvas from "./util/canvasloader";

export class Canvas {
    private CanvasProcessed: boolean
    public static ID: number
    private _CanvasArray: any[]
    private static _instance: Canvas

    constructor() {
      Canvas.ID = this.ParseID()
      this.CanvasProcessed = false
      loadcanvas(this)
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

    public UpdatePixel(x: number, y: number, color: number) {
            if (!this.CanvasProcessed) return
            this.CanvasArray[x][y] = color
            // console.log(this.getColor(x, y), "->", color) 
    }

}

export default Canvas
