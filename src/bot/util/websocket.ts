import { Bot, WSBot, Client } from "../Bot";
import { onBotMessage, onClientMessage } from "./onmessage";
import '../../variables'

const seven = (window as any).seven 

// client
const customWS = window.WebSocket;
(window as any).WebSocket = function(url: string | URL, protocols?: string | string[]): WebSocket {
  const client = new Client()
  const socket = new customWS(url, protocols);
  socket.addEventListener("message", (event: any) => { onClientMessage(event) });
  client.ws = socket
  return socket;
};

// multibot
export async function hookBot(bot: WSBot) {
  console.log(`[7p] Attempting to connect account ${bot.username}`)
  const socket = new customWS("wss://pixelplace.io/socket.io/?EIO=4&transport=websocket");
  socket.addEventListener("message", (event: any) => { onBotMessage(event, bot); });
  socket.addEventListener("close", () => { Bot.botIndex -= 1 });
  return socket
} 

export function closeBot(bot: WSBot) {
  if (bot instanceof Client) return
  if (!bot) {console.log('[7p] Cannot close bot that doesnt exist.'); return}
  bot.ws.close()
  const result = seven.bots.filter((checkedBot: Bot) => checkedBot.botid != bot.botid)
  seven.bots = result
  console.log('[7placer] Ended bot ', bot.botid)
} 