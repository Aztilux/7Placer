import Bot from "../bot/Bot";
import loadcanvas from "./util/canvasloader";

export class Canvas {
  private CanvasProcessed: boolean
  public ID: number
  public CanvasArray: any[]
  private static _instance: Canvas

  constructor() {
    this.ID = this.ParseID()
    this.CanvasProcessed = false
    loadcanvas(this)
  }

  private ParseID(): number {
    return parseInt(window.location.href.split("/").slice(-1)[0].split("-")[0]);
  }

  public static get instance(){
    if (!this._instance) {
      this._instance = new Canvas
    }
    return this._instance
  }

  public get GID() {
    return this.ID
  }

  public set SCanvasArray(array: any[]) {
    this.CanvasArray = array
    this.CanvasProcessed = true
  }

  public getColor(x: number, y: number) {
    return(this.CanvasArray[x][y])
  }

  public UpdatePixel(x: number, y: number, color: number) {
    if (this.CanvasProcessed) {
      // console.log(this.getColor(x, y), "->", color) 
      this.CanvasArray[x][y] = color
    }
  }

}
Canvas.instance

export default Canvas
