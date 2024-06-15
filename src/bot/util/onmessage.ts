import Bot from "../Bot";
import Canvas from "../../canvas/Canvas";
import getPalive from "./palive";
import { disconnect } from './websocket';

// client
export function onClientMessage(event: any) {
    const msg = event.data
    const bot = Bot.botClient
    if (msg.startsWith("42")) {
      const msg = JSON.parse(event.data.substr(2))
      const type = msg[0]
      switch (type) {
        case "p":
            for (const pixel of msg[1]) {
                const canvas = Canvas.instance
                const x = pixel[0]
                const y = pixel[1]
                const color = pixel[2]
                const id = pixel[4]  
                canvas.updatePixel(x, y, color)
            }
            break
        case "canvas":
            for (const pixel of msg[1]) {
                const canvas = Canvas.instance
                const x = pixel[0]
                const y = pixel[1]
                const color = pixel[2]
                canvas.updatePixel(x, y, color)
            } 
            break       

      }
    }
}
// multibot
export function onBotMessage(event: any, bot: Bot) {
  const message = event.data;

  // game packets
  if (message.startsWith("42")) {
      const message = JSON.parse(event.data.substr(2));
      const type = message[0];
      switch (type) {
          case "server_time":
            bot.paliveServerTime = message[1]; // stores servertime for palive
            break
          case "ping.alive":
            const hash = getPalive(bot.paliveServerTime, bot.generalinfo.user.id);
            console.log('[7p]', bot.generalinfo.user.name, ': pong =', hash, bot.generalinfo.user.id)
            bot.emit('pong.alive', `"${hash}"`);
            break
          case "throw.error":
            console.log(`[7p] [Bot ${bot.botid}] Pixelplace WS error: ${message[1]}`);
            disconnect(bot)  
            break
        }   

  }
  // start
  if (message.startsWith("0")) bot.ws.send('40')
  // auth
  if (message.startsWith("40")) bot.ws.send(`42["init",{"authKey":"${bot.auth.authKey}","authToken":"${bot.auth.authToken}","authId":"${bot.auth.authId}","boardId":${Canvas.ID}}]`);
  // keep alive
  if (message.startsWith("2")) bot.ws.send('3');
}
