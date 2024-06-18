import { Bot } from "../../bot/Bot"
import Canvas from "../../canvas/Canvas"
import '../../variables'

const seven = (window as any).seven

class Queue {

  constructor() {
  }

  public static add(x: number, y: number, color: number) {
    seven.queue.push({x: x, y: y, color: color})
  }
  public static clear() {
    // console.log('Queue cleared: ', seven.queue)
    seven.queue = []
  }

    public static async start() { // waiter waiter! I want .sort!
      if (!Canvas.isProcessed) { console.log('[7p] Error starting queue: Canvas has not been processed yet.'); Queue.stop(); return }
      const Bots = seven.bots
      var position = 0
      var tick = 0
      var botpos = 0
      await Queue.sort()
      seven.inprogress = true
      while (seven.inprogress == true && seven.queue.length > 0) {
      if (botpos == Bots.length) botpos = 0
      if (!seven.protect && position == seven.queue.length) {
        Queue.stop()
        console.log('[7p] Queue done.')
      } else if (seven.protect == true && position == seven.queue.length) {
        position = 0
      }
      const bot = Bots[botpos]
      const pixel = seven.queue[position]
      const response = bot.placePixel(pixel.x, pixel.y, pixel.color)

      botpos += 1
      if (response) position += 1
      // tick management 
      if (tick >= seven.tickspeed) {
        tick = 0
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      tick += 1
      }
    }

    static async sort() {
      const array = seven.queue;
      switch (seven.order) {
        case 'rand':
          array.sort(() => Math.random() - 0.5);
          break;
    
        case 'colors':
          array.sort((a: { color: number }, b: { color: number }) => a.color - b.color);
          break;
    
        case 'vertical':
          array.sort((a: { x: number }, b: { x: number }) => a.x - b.x);
          break;
    
        case 'horizontal':
          array.sort((a: { y: number }, b: { y: number }) => a.y - b.y);
          break;

        default:
        case 'circle':
          const CX = Math.floor((array[0].x + array[array.length - 1].x) / 2);
          const CY = Math.floor((array[0].y + array[array.length - 1].y) / 2);  
          array.sort((a: { x: number; y: number }, b: { x: number; y: number }) => {
            const distanceA = Math.sqrt((a.x - CX) ** 2 + (a.y - CY) ** 2);
            const distanceB = Math.sqrt((b.x - CX) ** 2 + (b.y - CY) ** 2);
            return distanceA - distanceB;
          });
          break;
      }
    }
    

    public static stop() {
      seven.inprogress = false
      Canvas.customCanvas.clearRect(0,0,3000,3000)
      Queue.clear();
    }

}

export default Queue