import Canvas from "../../canvas/Canvas"
import Queue from "./SevenQueue"

export default class Protector {
    private static protected: Array<{x: number, y: number, color: number}> = []

    public protect(x: number, y: number, color: number) {
        Protector.protected.push({x: x, y: y, color: color})
    }

    public clear() {
        Protector.protected = []
    }

    public static checkPixel(x: number, y: number, color: number) {
        const canvas = Canvas.instance

        if (Protector.protected.length == 0) { return }

        function isInsideProtected(pixel: {x: number, y: number, color: number}): boolean {
            if (pixel.x == x && pixel.y == y) { return true }
            return false
        }
        
        function isSameColor(pixel: {x: number, y: number, color: number}): boolean {
            const canvasColor = canvas.getColor(x, y)
            if (canvasColor == pixel.color) { return true }
            return false
        }

        Protector.protected.forEach((pixel) => {
            if(isInsideProtected(pixel) && !isSameColor(pixel)) {
                Queue.add(x, y, pixel.color)
            }
        })
    }

}   