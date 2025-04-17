    import { Bot, Client } from "../../bot/Bot"
    import Canvas from "../../canvas/Canvas"
    import '../../variables'
    import Protector from "./Protect"

    export default class Queue {
        private static performance: number

        constructor() {
            Queue.performance = performance.now()
        }

        public static add(x: number, y: number, color: number, protection: boolean, atStart: boolean = false, client: boolean = false) {
            const seven = window.seven
            const pixel = { x: x, y: y, color: color, protected: protection, client: client };
            if (atStart) seven.queue.unshift(pixel);
            else {
                seven.queue.push(pixel);
            }
            if (seven.queue.length == 1) Queue.start();
        };

        public static clear() {
            const seven = window.seven
            // console.log('Queue cleared: ', seven.queue);
            seven.queue = [];
        };

        public static async start(): Promise<void> { // waiter waiter! I want .sort!
            const seven = window.seven
            const canvas = Canvas.instance
            const protector = new Protector
            if (!canvas.isProcessed) {
                Toastify ({
                    text: `Canvas has not been processed yet.`,
                    style: {
                        background: "#1a1a1a",
                        border: "solid rgb(255, 0, 0)"
                    },
                }).showToast();
                console.log('[7p] Error starting queue: Canvas has not been processed yet.');
                Queue.stop();
                return
            }
            seven.inprogress = true
            let tick = 0
            while (seven.inprogress) {
                // console.log(performance.now() - Queue.performance);
                Queue.performance = performance.now();
                const pixel = seven.queue[0];

                let bot: Bot
                if (pixel.client) {
                    bot = Client.instance;
                } else {
                    bot = await Bot.findAvailableBot();
                };

                // Anti lag when skipping (fix it pls)
                const canvas_color = canvas.getColor(pixel.x, pixel.y)
                if (pixel.color == canvas_color) {
                    tick += 1;
                } else tick = 0;
                if (tick == 100) {
                  await new Promise(resolve => setTimeout(resolve, 0));
                  tick = 0;
                };


                await bot.placePixel(pixel.x, pixel.y, pixel.color);

                var indexOfRemoval = seven.queue.indexOf(pixel);
                seven.queue.splice(indexOfRemoval, 1);

                if (pixel.protected && seven.protect) {
                    protector.protect(pixel.x, pixel.y, pixel.color);
                }
                if (seven.queue.length == 0) {
                    seven.inprogress = false;
                    console.log('[7p] Queue done.');
                };
            };
        };

        public static stop() {
            const seven = window.seven
            seven.inprogress = false;
            const canvas = Canvas.instance;
            canvas.previewCanvas.clearRect(0,0,3000,3000);
            Protector.clear();
            Queue.clear();
        };

        };
