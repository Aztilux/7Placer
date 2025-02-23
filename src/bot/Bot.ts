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
    
    public async placePixel(x: number, y: number, color: number, tracker: boolean = true): Promise<boolean> {
        const canvas = Canvas.instance
        return new Promise((resolve) => {
            const canvascolor = canvas.getColor(x, y);

            if (canvascolor == color || canvascolor == 50) return resolve(true);
            new Promise((resolve) => {
                setTimeout(() => resolve(true), Math.max(0, seven.pixelspeed - (Date.now() - this.lastplace)));
            }).then(() => {
                this.emit('p', `[${x},${y},${color},1]`);
                this.lastplace = Date.now();
                if (tracker && this.trackeriters >= 6) {
                    $(this.tracker).css({ top: y, left: x, display: 'block' });
                    this.trackeriters = 0
                }
                
                // console.log(`[7p] placing: ${canvascolor} -> ${color}`)
                this.trackeriters += 1
                resolve(true);
            })
        })
    }

    public static async findAvailableBot(): Promise<Bot> {
        const bots = seven.bots
        var tick = 0
        while (true) {
            for (var i = 0; i < bots.length; i++) {
                const bot = bots[i]
                if (Date.now() - bot.lastplace >= seven.pixelspeed) {
                    return bot
                }
            }
            
            tick += 1
            if (tick == seven.tickspeed) { tick = 0; await new Promise(resolve => setTimeout(resolve, 0)); }
        }
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