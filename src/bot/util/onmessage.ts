import Bot from "../Bot";
import Canvas from "../../canvas/Canvas";
import getPalive from "./palive";
import { close } from './websocket';

// client
export function onClientMessage(event: any) {
        const msg = event.data
        const bot = Bot.botClient
        if (msg.startsWith("42")) {
          const msg = JSON.parse(event.data.substr(2))
          const type = msg[0]
          if (type == "p") {
            const pixelsReceived = msg[1]
            for (const pixel of pixelsReceived) {
              const canvas = Canvas.instance
              const x = pixel[0]
              const y = pixel[1]
              const color = pixel[2]
              const id = pixel[4]  
              canvas.UpdatePixel(x, y, color)
            }
          }
        }
}

// multibot
export function onBotMessage(event: any, bot: Bot) {
  const message = event.data;

  if (message.startsWith("42")) {
      const message = JSON.parse(event.data.substr(2));
      const type = message[0];

      if (type === "server_time") {
          bot.paliveServerTime = message[1]; // stores servertime for palive
      } else if (type === "ping.alive") {
          const hash = getPalive(bot.paliveServerTime);
          bot.emit('pong.alive', `"${hash}"`);
      } else if (type === "throw.error") {
          console.log(`[7p] [Bot ${bot.botid}] Pixelplace WS error: ${message[1]}`);
          close(bot)
          
      }
  } else if (message.startsWith("0")) {
      bot.ws.send('40');
  } else if (message.startsWith("40")) {
      bot.ws.send(`42["init",{"authKey":"${bot.auth.authKey}","authToken":"${bot.auth.authToken}","authId":"${bot.auth.authId}","boardId":${Canvas.ID}}]`);
  } else if (message.startsWith("2")) {
      bot.ws.send('3');
  }
}
