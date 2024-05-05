import "./util/hook"
import Canvas from "../canvas/Canvas";
import onmessage from "./util/onmessage";

export default class Bot {
  private _canvas: Canvas
  private _ws: WebSocket
  private static instance: Bot;
  public lastplace: number  

  constructor() {
    this._canvas = new Canvas(this);
    this.lastplace = Date.now()
  }

  public static getInstance(): Bot {
    if (!this.instance) {
        this.instance = new Bot;
    }
    return this.instance;
  }

  public get canvas() {
    return this._canvas
  }
  public get ws() {
    return this._ws
  }

  public set websocket(wss: WebSocket) {
    this._ws = wss
    wss.addEventListener("message", (event: any) => { onmessage(event, this) });
  }


  public emit(event: any, params: any) {
    this.ws.send(`42["${event}",${params}]`)
  }

  public placePixel(x: number, y: number, color: number) {
    if (Date.now() - this.lastplace >= 19) {
      this.emit('p', `[${x},${y},${color},1]`)
      this.lastplace = Date.now()
      return true
    } else {
      return false
    }
  }
}