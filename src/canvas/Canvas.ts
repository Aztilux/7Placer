import Bot from "../bot/Bot";
import CanvasImgToArray from "./util/CanvasImgToArray";

class Canvas {
  bot: Bot
  ID: number
  CanvasArray: void

  constructor(bot: Bot) {
    this.bot = bot
    this.ID = 7
    this.CanvasArray = CanvasImgToArray(this)
  }

  public getCanvasID () {
    return parseInt(window.location.href.split("/").slice(-1)[0].split("-")[0]);
  }
}

export default Canvas
