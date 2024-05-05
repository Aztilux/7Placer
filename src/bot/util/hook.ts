import Bot from "../Bot";

const pxpWS = window.WebSocket;
(window as any).WebSocket = function(url: string | URL, protocols?: string | string[]): WebSocket {
  const bot = Bot.getInstance()
  const socket = new pxpWS(url, protocols);
  (window as any).hookedsocket = socket;
  bot.websocket = socket
  return socket;
};