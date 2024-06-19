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
    await Queue.sort()
    var pos = 0
    var tick = 0
    seven.inprogress = true
    while (seven.inprogress == true && seven.queue.length > 0) {
    const pixel = seven.queue[pos]
    const bot = await Bot.findAvailableBot()
    await bot.placePixel(pixel.x, pixel.y, pixel.color)

    pos += 1 // next pixel
    if (!seven.protect && pos == seven.queue.length) {
      Queue.stop()
      console.log('[7p] Queue done.')
    } else if (seven.protect == true && pos == seven.queue.length) {
      pos = 0
    }

    await new Promise(resolve => setTimeout(resolve, 0));
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