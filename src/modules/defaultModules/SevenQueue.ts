import Bot from "../../bot/Bot"
import Canvas from "../../canvas/Canvas"
import '../../variables'

const seven = (window as any).seven

class Queue {
  private static botindex: number
  private static queueindex: number
  private static tick: number

  constructor() {
    Queue.queueindex = 0
    Queue.botindex = 0
    Queue.tick = 0
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
    Queue.queueindex = 0
    Queue.botindex = 0
    Queue.tick = 0
    const Bots = seven.bots
    // seven.queue.sort(() => Math.random() - 0.5); - rand
    // seven.queue.sort((a: { color: number }, b: { color: number }) => a.color - b.color); - colors
    // circle
    let CX = Math.floor((seven.queue[0].x + seven.queue[seven.queue.length - 1].x) / 2);
    let CY = Math.floor((seven.queue[0].y + seven.queue[seven.queue.length - 1].y) / 2);  
      seven.queue.sort((a: { x: number; y: number }, b: { x: number; y: number }) => {
          const distanceA = Math.sqrt((a.x - CX) ** 2 + (a.y - CY) ** 2);
          const distanceB = Math.sqrt((b.x - CX) ** 2 + (b.y - CY) ** 2);
          return distanceA - distanceB;
      });
    seven.inprogress = true
    while (seven.inprogress == true && seven.queue.length > 0) {
    const bot = Bots[Queue.botindex]
    const pixel = seven.queue[Queue.queueindex]
    const response = bot.placePixel(pixel.x, pixel.y, pixel.color)
    Queue.botindex += 1

    if (Queue.botindex == Bots.length) Queue.botindex = 0
    if (response && Queue.queueindex < seven.queue.length) Queue.queueindex += 1 // next pixel

    // handles depending on protect or not
    if (!seven.protect && Queue.queueindex == seven.queue.length) {
      Queue.stop()
      console.log('[7p] Queue done.')
    } else if (seven.protect == true && Queue.queueindex == seven.queue.length) {
      Queue.queueindex = 0
    }

    // tick management 
    if (Queue.tick >= seven.tickspeed) {
      Queue.tick = 0
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    Queue.tick += 1
    }
  }

  public static stop() {
    seven.inprogress = false
    Canvas.customCanvas.clearRect(0,0,3000,3000)
    Queue.clear();
  }

}

export default Queue