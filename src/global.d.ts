declare const Toastify: any;
declare const RgbQuant: any;

interface Pixel {
    x: number,
    y: number,
    color: number
}
interface Window {
        seven: {
            bots: Map<string, any>,
            pixelspeed: number,
            queue: Array<any>,
            inprogress: boolean,
            protect: boolean,
            tickspeed: number,
            order: string,
            multi: Object,
            dither: string,
            agressive_protection: boolean,
            pixel_type: string,
        }
}
