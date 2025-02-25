    import { Bot } from "../../bot/Bot"
    import Canvas from "../../canvas/Canvas"
    import '../../variables'

    const seven = (window as any).seven

    export class Queue {
        private static performance: number

        constructor() { 
            Queue.performance = performance.now()
        }

        public static add(x: number, y: number, color: number) {
            seven.queue.push({x: x, y: y, color: color})
            if (seven.queue.length == 1) { Queue.start() }
        }
        public static clear() {
            // console.log('Queue cleared: ', seven.queue)
            seven.queue = []
        }

        public static async start() { // waiter waiter! I want .sort!
            const canvas = Canvas.instance
            if (!canvas.isProcessed) { console.log('[7p] Error starting queue: Canvas has not been processed yet.'); Queue.stop(); return }
            seven.inprogress = true

            while (seven.inprogress) {
                console.log(performance.now() - Queue.performance)
                Queue.performance = performance.now()
                const pixel = seven.queue[0]
                const bot = await Bot.findAvailableBot()
                await bot.placePixel(pixel.x, pixel.y, pixel.color)
                seven.queue.shift()
                if (seven.protect) {
                    seven.queue.push(pixel)
                }
                if (seven.queue.length == 0) {
                    seven.inprogress = false
                    Queue.stop()
                    console.log('[7p] Queue done.')
                }
            }
        }
            
        public static stop() {
            seven.inprogress = false
            const canvas = Canvas.instance
            canvas.previewCanvas.clearRect(0,0,3000,3000)
            Queue.clear();
        }

        }