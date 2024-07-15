import { WSBot, Client } from "../Bot";
import Canvas from "../../canvas/Canvas";
import getPalive from "./palive";
import { closeBot } from './websocket';
import "../../variables";
import { deleteAccount } from "../../auth/util/commands";

const seven = (window as any).seven 
// client
export function onClientMessage(event: any) {
    const msg = event.data
    const bot = Client.instance
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
export async function onBotMessage(event: any, bot: WSBot) {
  const message = event.data;

  // game packets
  if (message.startsWith("42")) {
      const message = JSON.parse(event.data.substr(2));
      const type = message[0];
      const botid = bot.generalinfo.user.id
      const botname = bot.username
      switch (type) {
          case "server_time":
            bot.paliveServerTime = message[1]; // stores servertime for palive
            break
          case "ping.alive":
            const hash = getPalive(bot.paliveServerTime, botid);
            console.log('[7p]', botname, ': pong =', hash, botid)
            bot.emit('pong.alive', `"${hash}"`);
            break
          case "throw.error":
            if (message[1] == 49) { 
              console.log(`[7p] [Bot ${botname}] Error (${message[1]}): This auth is not valid! Deleting account from saved accounts...`); 
              deleteAccount(botname)
              closeBot(bot) 
              return; 
            } else if (message[1] == 16) {
              closeBot(bot)
            }
            console.log(`[7p] [Bot ${botname}] Pixelplace WS error: ${message[1]}`);
            break
          case "canvas":  
            console.log(`[7p] Succesfully connected to bot ${bot.username}`)
            seven.bots.push(bot);
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
