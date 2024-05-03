import { event } from "jquery";
import Canvas from "../canvas/Canvas";
import onmessage from "./util/onmessage";

export default class Bot {
  public canvas: Canvas
  public ws: WebSocket

  constructor(ws: WebSocket) {
    this.ws = ws
    this.canvas = new Canvas(this);
    this.ws.addEventListener("message", (event: any) => { onmessage(event, this) });
  }

  public emit(event: any, params: any) {
    this.ws.send(`42["${event}",${params}]`)
  }

  public set setWS(websocket: WebSocket) {
    this.ws = websocket
  }

}