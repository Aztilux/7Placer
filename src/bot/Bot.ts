import { connect } from  "./util/websocket"
import Canvas from "../canvas/Canvas";
import Auth from "../auth/Auth";
import '../variables'
import '../css/css'
import { trackercss } from "../css/css";

const seven = (window as any).seven
export default class Bot {
  
        private canvas: Canvas
        private _auth: Auth
        private _ws: WebSocket
        private static _client: Bot;
        private static clientUsername: string
        private static botindex: number = 0
        public isClient: boolean
        public paliveServerTime: number
        public lastplace: number
        public botid: number
        public tracker: JQuery<HTMLElement>;

        constructor(auth: Auth | null = null) {

                this.lastplace = Date.now();
                this.canvas = Canvas.instance;
                seven.bots.push(this);
                this.botid = Bot.botindex
                this.tracker = this.createGUItracker()
                Bot.botindex += 1 // id for next bot
                if (auth == null) { Bot._client = this; this.isClient = true; return };
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
        public set ws(wss: WebSocket) {
                this._ws = wss
        }
        public get ws() {
                return this._ws
        }


        public emit(event: any, params: any) {
                this.ws.send(`42["${event}",${params}]`)
        }

        public placePixel(x: number, y: number, color: number, tracker: boolean = true) {
                const canvascolor = this.canvas.getColor(x, y)

                if (Date.now() - this.lastplace < seven.pixelspeed) return false;
                if (canvascolor == color || canvascolor == 50) return true;
                if (tracker) $(this.tracker).css({ top: y, left: x, display: 'block', });

                // console.log(`[7p] placing: ${canvascolor} -> ${color}`)
                this.emit('p', `[${x},${y},${color},1]`)
                this.lastplace = Date.now()
                return true
        }

        private createGUItracker() {
                var name = this.botid == 0 ? 'Client' : `Bot ${this.botid}` 
                const tracker = $('<div class="track" id="bottracker">').text(`[7P] ${name}`).css(trackercss)
                $('#canvas').ready(function() {
                    console.log(`created tracker: ${name}`)
                    $('#painting-move').append(tracker)                        
                });
                return tracker              
        }
}

