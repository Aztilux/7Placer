import Bot from "../bot/Bot"

const windoww = (window as any)
windoww.queue = [];
windoww.inprogress = false;
windoww.protect = false;
windoww.tickspeed = 200

class Queue {
  private static botindex: number
  private static queueindex: number
  private static tick: number

  constructor() {
    Queue.queueindex = 0
    Queue.botindex = 0
  }

  public static add(x: number, y: number, color: number) {
    windoww.queue.push({x: x, y: y, color: color})
  }
  public static clear() {
    windoww.queue = []
  }

  public static async start() { // waiter waiter! I want .sort!
    Queue.queueindex = 0
    Queue.botindex = 0
    Queue.tick = 0
    const Bots = Bot.Bots
    windoww.inprogress = true
    while (windoww.inprogress == true && windoww.queue.length > 0) {
    const pixel = windoww.queue[Queue.queueindex]
    const response = Bots[Queue.botindex].placePixel(pixel.x, pixel.y, pixel.color)
    Queue.botindex += 1

    if (Queue.botindex >= Bots.length) {
      Queue.botindex = 0
    }
    
    // next pixel
    if (response && Queue.queueindex < windoww.queue.length) {
      Queue.queueindex += 1
    }

    // handles depending on protect or not
    if (windoww.protect == false && Queue.queueindex == windoww.queue.length) {
      Queue.stop()
      console.log('finished q')
    } else if (windoww.protect == true && Queue.queueindex == windoww.queue.length) {
      Queue.queueindex = 0
    }

    // tick management 
    if (Queue.tick >= windoww.tickspeed) {
      Queue.tick = 0
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    Queue.tick += 1
    }
  }

  public static stop() {
    windoww.inprogress = false
    Queue.clear();
  }

}

export default Queue