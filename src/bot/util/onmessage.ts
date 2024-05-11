import Bot from "../Bot";
import Canvas from "../../canvas/Canvas";

  function onmessage(event: any, bot: Bot) {
  const msg = event.data
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

export default onmessage