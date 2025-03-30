import { Bot } from "../Bot";

export class MessageHandler {
    private _listeners: Map<any, Function[]> = new Map()
    private _bot: Bot
    private _websocket: WebSocket

    constructor(bot: Bot, websocket: WebSocket) {
        this._bot = bot;
        this._websocket = websocket;
        this._startHandler()
    };

    public on(message_type: any, callback: (data?: any) => void) {
        if (!this._listeners.has(message_type)) this._listeners.set(message_type, []);
        this._listeners.get(message_type).push(callback);
    };

    public cancel(func: Function) {
        this._listeners.forEach((value) => {
            value.filter((listener) => {
                listener != func;
            });
        });
    };

    private _startHandler() {
       this._websocket.addEventListener('message', event => this._handleMessage(event));
    }

    private _handleMessage(message: any) {
        message = message.data
        if (message.startsWith('42')) {
            message = JSON.parse(message.slice(2));
            const message_type = message[0]
            this._fire(message_type, message)
            return
        }
        if (message.startsWith('0')) {
            this._fire('start')
            return
        }
        if (message.startsWith('40')) {
            this._fire('init')
        }
        this._fire(message)

    };

    private _fire(message_type: any, data?: Object) {
        if (!this._listeners.has(message_type)) return
        this._listeners.get(message_type).forEach((listener) => {
            listener(data)
        });
    };
};
