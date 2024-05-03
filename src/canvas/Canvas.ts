import Bot from "../bot/Bot";
import CanvasImgToArray from "./util/CanvasImgToArray";

export class Canvas {
  private bot: Bot
  public ID: number
  public CanvasArray: any[]

  constructor(bot: Bot) {
    this.bot = bot
    this.ID = this.ParseID()
    this.CanvasArray = CanvasImgToArray(this)
  }

  private ParseID(): number {
    return parseInt(window.location.href.split("/").slice(-1)[0].split("-")[0]);
  }

  public get GID() {
    return this.ID
  }
  public set SCanvasArray(array: any[]) {
    this.CanvasArray = array
  }

  public UpdatePixel(x: number, y: number, color: number) {
    // console.log(this.CanvasArray[x][y], "->", color) 
    this.CanvasArray[x][y] = color
  }

}

export default Canvas
