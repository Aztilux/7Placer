import { canvascss } from "../GUI/style";
import { hex2rgb } from "../modules";
import { processWater, processColors } from "./util/canvasloader";

export class Canvas {
    private static _instance: Canvas
    private _customCanvas: any
    private _isProcessed: boolean
    private _ID: number
    private _canvasArray: any[]
    private _colors: [r: number, g: number, b: number][]

    private constructor() {
        this._ID = this.ParseID()
        this._isProcessed = false
        this._customCanvas = this.newPreviewCanvas()
        this._colors = this.getPalette()
    }

    public static get instance() {
        if (!Canvas._instance) {
            Canvas._instance = new Canvas
            processColors()
        }
        return Canvas._instance
    }

    private newPreviewCanvas() {
        const canvas: any = $(`<canvas width="2500" height="2088">`).css(canvascss);
        $('#canvas').ready(function() {
            $('#painting-move').append(canvas)
            });
            const ctx = canvas[0].getContext("2d");
            return ctx
    }

    private ParseID(): number {
        return parseInt(window.location.href.split("/").slice(-1)[0].split("-")[0]);
    }

    public get previewCanvas() {
        return this._customCanvas
    }

    public get canvasArray() {
        return this._canvasArray
    }

    public get isProcessed() {
        return this._isProcessed
    }
    public set isProcessed(bool: boolean) {
        this._isProcessed = bool
    }
    public get ID() {
        return this._ID
    }
    public get colors() {
        return this._colors
    }

    public set canvasArray(array: any[]) {
        this._canvasArray = array
        this.isProcessed = true
    }


    public getColor(x: number, y: number): number {
        try { return this.canvasArray[x][y] }
        catch { return 200 };
    }

    public updatePixel(x: number, y: number, color: number) {
            if (!this._isProcessed) return
            this.canvasArray[x][y] = color
            // console.log(this.getColor(x, y), "->", color)
    }

    private getPalette() {
        const palette_buttons = document.querySelectorAll("#palette-buttons a");
        let unsorted_array: {color: string, id: number}[] = []
        palette_buttons.forEach((color) => {
            let id = color.getAttribute('data-id')
            let colorhex = color.getAttribute('title')
            unsorted_array.push({color: colorhex, id: parseInt(id)})
        });
        unsorted_array.sort((a, b) => { return a.id-b.id })

        let result: [r: number, g: number, b: number][] = []
        unsorted_array.forEach((colorobj) => {
            result.push(hex2rgb(colorobj.color))
        })

        return result
    };


}

export default Canvas
