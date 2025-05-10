import Canvas from "../canvas/Canvas";
import Auth from "../auth/Auth";
import '../variables'
import '../GUI/style'
import { trackercss } from "../GUI/style";
import getPainting from "../requests/get-painting";
import { MessageHandler } from "./util/MessageHandler";
import Protector from "../modules/defaultModules/Protect";
import getPalive from "./util/palive";
import { deleteAccount } from "../auth/util/commands";
export class Bot {

    public username: string;
    private _ws: WebSocket;
    public handler: MessageHandler;
    public tracker: JQuery<HTMLElement>;
    private trackeriters: number = 0;
    public paliveServerTime: number;
    public lastplace: number = performance.now();

    constructor(websocket: WebSocket) {
        this._ws = websocket;
        this.handler = new MessageHandler(this, this.ws);
    };

    public emit(event: any, params: any) {
        this.ws.send(`42["${event}",${params}]`);
    };

    public kill() {
        const seven = window.seven;
        seven.bots.delete(this.username);
        if (this._ws.readyState == 1) {
            this._ws.close();
        };
    };

    public async placePixel(pixel: Pixel, tracker: boolean = true): Promise<boolean> {
        const canvas = Canvas.instance;
        const seven = window.seven;

        if (window.seven.pixel_type == "default" && (canvas.isSameColor(pixel) || canvas.isProtected(pixel))) {
            return true;
        };

        while (performance.now() - this.lastplace < seven.pixelspeed) {
            await new Promise(resolve => setTimeout(resolve, 0));
        };

        // console.log(performance.now() - this.lastplace)
        const pixel_param = this.determinePixelType(pixel)
        this.emit('p', pixel_param);
        this.lastplace = performance.now();

        if (tracker && this.trackeriters >= 6) {
            $(this.tracker).css({ top: pixel.y, left: pixel.x, display: 'block' });
            this.trackeriters = 0;
        };

        this.trackeriters += 1;
        return true;
    };

    private determinePixelType(pixel: Pixel, type?: string): string {
        const types = {
            default: `[${pixel.x},${pixel.y},${pixel.color},1]`,
            protect: `[${pixel.x},${pixel.y},${pixel.color},1,1]`,
            seaprotect: `[${pixel.x},${pixel.y},-100,1,1]`,
            unprotect: `[${pixel.x},${pixel.y},${pixel.color},1,2]`,
        };
        if (!type) type = window.seven.pixel_type;
        if (!(type in types)) {
            throw new Error(type + " is not a valid pixel type.");
        }
        return types[type as keyof typeof types];
    };

    public static async findAvailableBot(): Promise<Bot> {
        const seven = window.seven;
        const bots = (seven.bots as Map<string, Bot>);
        var tick = 0;
        while (true) {
            for (const [_, bot] of bots) {
                if (Date.now() - bot.lastplace >= seven.pixelspeed) {
                    // console.log(`[7p] found available bot: ${bot.username}, ${ Date.now() - bot.lastplace }`);
                    return bot;
                };
            };

            tick += 1;
            if (tick == seven.tickspeed) {
                tick = 0;
                await new Promise(resolve => setTimeout(resolve, 0));
            };
        };

    }


    public createTracker() {
        const tracker = $('<div class="track" id="bottracker">').text(`[7P] ${this.username}`).css(trackercss);
        $('#canvas').ready(function() {
            // console.log(`[7p] created tracker: ${name}`)
            $('#painting-move').append(tracker);
        });
        return tracker;
    };

    public get ws(): WebSocket {
        return this._ws;
    };
}

export class WSBot extends Bot {
    private _auth: Auth;
    public username: string;
    public generalinfo: any;

    constructor(auth: Auth, username: string, websocket: WebSocket) {
        super(websocket);
        this._auth = auth;
        this.username = username;
        this.startBot();
    }

    private async startBot() {
        this.generalinfo = await getPainting(this.auth.authId, this.auth.authKey, this.auth.authToken);
        this.tracker = this.createTracker();
        this.internalListeners();
    }

    public get auth(): Auth {
        return this._auth;
    };

    private internalListeners() {
        this.handler.on('server_time', (data) => {
            this.paliveServerTime = data[1]; // stores servertime for palive
        })
        // this.handler.on('ping.alive', () => {
        //         const hash = getPalive(this.paliveServerTime, this.botid);
        //         console.log('[7p]', this.username, ': pong =', hash, this.botid)
        //         this.emit('pong.alive', `"${hash}"`);
        // })
        this.handler.on('throw.error', (data) => {
                if (data[1] == 49) {
                console.log(`[7p] [Bot ${this.username}] Error (${data[1]}): This auth is not valid! Deleting account from saved accounts...`);
                deleteAccount(this.username);
                this.kill();
                return;
                } else if (data[1] == 16) {
                this.kill();
                };
                console.log(`[7p] [Bot ${this.username}] Pixelplace WS error: ${data[1]}`);
        })
        this.handler.on('canvas', () => {
            const seven = window.seven;
            console.log(`[7p] Succesfully connected to bot ${this.username}`);
            seven.bots.set(this.username, this);
        })
        this.handler.on(2, () => {
            this.ws.send('3');
        })
        this.handler.on('start', () => {
            this.ws.send('40');
        })
        this.handler.on('init', () => {
            this.emit('init', `{"authKey":"${this.auth.authKey}","authToken":"${this.auth.authToken}","authId":"${this.auth.authId}","boardId":${Canvas.instance.ID}}`);
        })
    }
}

export class Client extends Bot {
    public username: string;
    public static instance: Client;

    constructor(websocket: WebSocket) {
        super(websocket);
        Client.instance = this;
        this.start();
    };

    public static get Client(): Client {
        return Client.instance;
    };

    private start() {
        const seven = window.seven;
        this.username = 'Client';
        this.tracker = this.createTracker();
        this.internalListeners();
        seven.bots.set(this.username, this);
    };

    private internalListeners() {
        // Bot canvas array updater
        this.handler.on('p', (data) => {
            for (const pixel of data[1]) {
                const canvas = Canvas.instance;
                const x = pixel[0];
                const y = pixel[1];
                const color = pixel[2];
                const id = pixel[4];
                canvas.updatePixel(x, y, color);
                Protector.checkPixel(x, y, color);
            }
        })
        // Rewrites some pixels after loading (I think because of cache lag)
        this.handler.on("canvas", (data) => {
            for (const pixel of data[1]) {
                const canvas = Canvas.instance;
                const x = pixel[0];
                const y = pixel[1];
                const color = pixel[2];
                canvas.updatePixel(x, y, color);
            };
        });
    };

};
