import { Bot, WSBot, Client } from "../Bot";
import '../../variables'
import Auth from "../../auth/Auth";

const seven = (window as any).seven

// client
function hookClient() {
    const unmodifiedWS = window.WebSocket;
    (window as any).WebSocket = function(url: string | URL, protocols?: string | string[]): WebSocket {
        const socket = new unmodifiedWS(url, protocols);
        socket.addEventListener("open", () => new Client(socket));
        socket.addEventListener("close", hookClient);
        // client.handler = new MessageHandler(client, socket)
        return socket;
    };
}
hookClient()

// multibot
export async function createBot(auth: Auth, username: string) {
    console.log(`[7p] Attempting to connect account ${username}`);
    const socket = new WebSocket("wss://pixelplace.io/socket.io/?EIO=4&transport=websocket");
    const bot = new WSBot(auth, username, socket)
    socket.addEventListener("close", () => { bot.kill() });
}
