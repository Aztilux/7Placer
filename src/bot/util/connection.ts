import Bot from "../Bot";
import { onBotMessage, onClientMessage } from "./onmessage";


// client
const customWS = window.WebSocket;
(window as any).WebSocket = function(url: string | URL, protocols?: string | string[]): WebSocket {
  const client = Bot.botClient
  const socket = new customWS(url, protocols);
  socket.addEventListener("message", (event: any) => { onClientMessage(event) });
  client.websocket = socket
  return socket;
};

// multibot

export function connect(bot: Bot) {
  const socket = new customWS("wss://pixelplace.io/socket.io/?EIO=4&transport=websocket");
  socket.addEventListener("message", (event: any) => { onBotMessage(event, bot) });
  return socket
} 