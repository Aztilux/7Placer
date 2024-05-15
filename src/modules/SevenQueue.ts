import Bot from "../bot/Bot"
import '../variables'

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
    seven.queue = []
  }

  public static async start() { // waiter waiter! I want .sort!
    console.log('q start: ', seven.queue)
    Queue.queueindex = 0
    Queue.botindex = 0
    Queue.tick = 0
    const Bots = seven.bots
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
      console.log('finished q')
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
    Queue.clear();
  }

}

export default Queue