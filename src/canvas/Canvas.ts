import { canvascss } from "../css/style";
import { processWater, processColors } from "./util/canvasloader";

export class Canvas {
    private static _instance: Canvas    
    private _customCanvas: any
    private _isProcessed: boolean
    private _ID: number
    private _canvasArray: any[]

    private constructor() {
        this._ID = this.ParseID()
        this._isProcessed = false
        this._customCanvas = this.newPreviewCanvas()
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

    public set canvasArray(array: any[]) {
        this._canvasArray = array
        this.isProcessed = true
    }


    public getColor(x: number, y: number) {
        try { return this.canvasArray[x][y] }
        catch { return 200 };
    }

    public updatePixel(x: number, y: number, color: number) {
            if (!this._isProcessed) return
            this.canvasArray[x][y] = color
            // console.log(this.getColor(x, y), "->", color) 
    }

}

export default Canvas
