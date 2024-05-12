import { connect } from  "./util/connection"
import Canvas from "../canvas/Canvas";
import Auth from "../auth/Auth";
import '../variables'

const seven = (window as any).seven
export default class Bot {
  
        private canvas: Canvas
        private _auth: Auth
        private _ws: WebSocket
        private static _client: Bot;
        private static clientUsername: string
        public isClient: boolean
        public paliveServerTime: number
        public lastplace: number  

        constructor(auth: Auth | null = null) {

                this.lastplace = Date.now();
                this.canvas = Canvas.instance;
                seven.connectedbots.push(this);
                if (auth == null) {
                Bot._client = this
                this.isClient = true
                return
                }
                this.isClient = false
                this._auth = auth
                this._ws = connect(this);
        }

        public static get botClient(): Bot {
                if (!Bot._client) new Bot();
                return Bot._client
        }

        public get auth(): Auth {
                return this._auth
        }

        public set websocket(wss: WebSocket) {
                this._ws = wss
        }
        public get ws() {
                return this._ws
        }


        public emit(event: any, params: any) {
                this.ws.send(`42["${event}",${params}]`)
        }

        public placePixel(x: number, y: number, color: number) {
                const canvascolor = this.canvas.getColor(x, y)

                if (Date.now() - this.lastplace < seven.pixelspeed) return false;
                if (canvascolor == color || canvascolor == 50) return true;

                // console.log(`[7p] placing: ${canvascolor} -> ${color}`)
                this.emit('p', `[${x},${y},${color},1]`)
                this.lastplace = Date.now()
                return true
        }
}

