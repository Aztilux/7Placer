import Bot from "../Bot";

const pxpWS = window.WebSocket;
(window as any).WebSocket = function(url: string | URL, protocols?: string | string[]): WebSocket {
  console.log('debug2')
  const socket = new pxpWS(url, protocols);
  (window as any).mysocket = socket;
  const bot = new Bot(socket)
  return socket;
};