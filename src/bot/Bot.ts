import { hookBot } from  "./util/websocket"
import Canvas from "../canvas/Canvas";
import Auth from "../auth/Auth";
import '../variables'
import '../css/style'
import { trackercss } from "../css/style";
import getPainting from "../requests/get-painting";

const seven = (window as any).seven
export class Bot {
  
    public static botIndex: number = 0
    private trackeriters: number = 0
    private _ws: WebSocket
    public tracker: JQuery<HTMLElement>;
    public username: string
    public paliveServerTime: number
    public lastplace: number
    public botid: number

    constructor() {
        this.lastplace = Date.now();
        this.botid = Bot.botIndex;
        Bot.botIndex += 1; // id for next bot
    }   

    public emit(event: any, params: any) {
        this.ws.send(`42["${event}",${params}]`)
    }

    public placePixel(x: number, y: number, color: number, tracker: boolean = true) {
        const canvas = Canvas.instance
        const canvascolor = canvas.getColor(x, y)

        if (Date.now() - this.lastplace < seven.pixelspeed) return false;
        if (canvascolor == color || canvascolor == 50) return true;

        if (tracker && this.trackeriters >= 6) {
            $(this.tracker).css({ top: y, left: x, display: 'block' });
            this.trackeriters = 0
        }
        
        this.trackeriters += 1
        this.emit('p', `[${x},${y},${color},1]`)
        this.lastplace = Date.now()
        // console.log(`[7p] placing: ${canvascolor} -> ${color}`)
        return true
    }


    public createTracker() {
        const tracker = $('<div class="track" id="bottracker">').text(`[7P] ${this.username}`).css(trackercss)
        $('#canvas').ready(function() {
            // console.log(`[7p] created tracker: ${name}`)
            $('#painting-move').append(tracker)                        
        });
        return tracker              
    }

    public set ws(wss: WebSocket) {
        this._ws = wss
    }
    public get ws(): WebSocket {
        return this._ws
    }
}

export class WSBot extends Bot {
    private _auth: Auth
    public username: string;
    public generalinfo: any

    constructor(auth: Auth, username: string) {
        super()
        if (!username || !auth) { console.error("[7p ERROR]: 'auth' and 'username' should both be in the constructor arguments."); return }
        this._auth = auth;
        this.username = username
        this.startBot()
    }

    private async startBot() {
        this.generalinfo = await getPainting(this.auth.authId, this.auth.authKey, this.auth.authToken)  
        this.tracker = this.createTracker()
        this.ws = await hookBot(this);
    }

    public get auth(): Auth {
        return this._auth
    }
}

export class Client extends Bot {
    public username: string;
    public static instance: Client

    constructor() {
        super()
        this.username = 'Client'
        Client.instance = this
        this.tracker = this.createTracker()
        seven.bots.push(this);
    }

    public static get Client(): Bot {
        return Client.instance
    }
}