import "./util/hook"
import Canvas from "../canvas/Canvas";
import onmessage from "./util/onmessage";

export default class Bot {
  private canvas: Canvas
  private ws: WebSocket
  private static _client: Bot;
  public lastplace: number  
  public static Bots: any[] = []

  constructor() {
    this.lastplace = Date.now()
    this.canvas = Canvas.instance
    Bot.Bots.push(this)
  }

  public static get client(): Bot {
    if (!this._client) {
        this._client = new Bot;
    }
    return this._client;
  }


  public set websocket(wss: WebSocket) {
    this.ws = wss
    wss.addEventListener("message", (event: any) => { onmessage(event, this) });
  }


  public emit(event: any, params: any) {
    this.ws.send(`42["${event}",${params}]`)
  }

  public placePixel(x: number, y: number, color: number) {
    const canvascolor = this.canvas.getColor(x, y)
    if (Date.now() - this.lastplace >= (window as any).pixelspeed) {
      if (canvascolor == color || canvascolor == 50) { return true }
      // console.log(`[7p] placing: ${canvascolor} -> ${color}`)
      this.emit('p', `[${x},${y},${color},1]`)
      this.lastplace = Date.now()
      return true
    } else {
      return false
    }
  }
}