import { connect } from  "./util/websocket"
import Canvas from "../canvas/Canvas";
import Auth from "../auth/Auth";
import '../variables'
import '../css/css'
import { trackercss } from "../css/css";
import getPainting from "../requests/get-painting";
import { cli } from "webpack";

const seven = (window as any).seven
export default class Bot {
  
    private static _client: Bot;
    private static clientUsername: string
    public static botIndex: number = 0

    private _canvas: Canvas
    private _auth: Auth
    private _ws: WebSocket
    private tracker: JQuery<HTMLElement>;
    public username: string
    public isClient: boolean = false
    public paliveServerTime: number
    public lastplace: number
    public generalinfo: any
    public botid: number

    constructor(auth?: Auth) {
        this.lastplace = Date.now();
        this._canvas = Canvas.instance;
        this.botid = Bot.botIndex;
        Bot.botIndex += 1; // id for next bot
        if (!auth) { 
            Bot._client = this; 
            this.isClient = true; 
            this.tracker = this.createGUItracker(true)
            seven.bots.push(this);
        } 
        else {
            this._auth = auth;
            this.startBot()
        };
    }   

    private async startBot() {
        this.generalinfo = await getPainting(this.auth.authId, this.auth.authKey, this.auth.authToken)  
        this.tracker = this.createGUItracker()
        this._ws = await connect(this);
    }

    public emit(event: any, params: any) {
        this.ws.send(`42["${event}",${params}]`)
    }

    public placePixel(x: number, y: number, color: number, tracker: boolean = true) {
        const canvascolor = this._canvas.getColor(x, y)

        if (Date.now() - this.lastplace < seven.pixelspeed) return false;
        if (canvascolor == color || canvascolor == 50) return true;
        if (tracker) $(this.tracker).css({ top: y, left: x, display: 'block', });

        // console.log(`[7p] placing: ${canvascolor} -> ${color}`)
        this.emit('p', `[${x},${y},${color},1]`)
        this.lastplace = Date.now()
        return true
    }

    private createGUItracker(client: boolean = false) {
        var name = client == true ? 'Client' : this.generalinfo.user.name
        const tracker = $('<div class="track" id="bottracker">').text(`[7P] ${name}`).css(trackercss)
        $('#canvas').ready(function() {
            // console.log(`[7p] created tracker: ${name}`)
            $('#painting-move').append(tracker)                        
        });
        return tracker              
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
    public get ws(): WebSocket {
        return this._ws
    }
}