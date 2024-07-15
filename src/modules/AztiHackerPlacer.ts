import { Bot, Client } from "../bot/Bot"
import Canvas from "../canvas/Canvas"
import "../variables"
import getClientMouse from "./util/getClientMouse"

var toggle: boolean = false
export default async function AztiHackerPlacer() {
    toggle = toggle === false ? true : false; 
    const canvas = Canvas.instance
    const client = Client.instance
    const seven = (window as any).seven
    var lastpixel: { x: number, y: number } = {x: 0, y:0}
    // console.log('Yallahplacer toggle: ', toggle)

    async function brushDotter (x: number,y: number, color: number) {
      var e = 3 // expansion
      var unpainted = []
      for (let i = -e; i <= e; i++) {
        for (let j = -e; j <= e; j++) {
          unpainted.push({x: x+i, y: y+j})
        }    
      }
      var final = unpainted[Math.floor(Math.random()*unpainted.length)];
      if (unpainted.length > 0) {
        client.placePixel(final.x, final.y, color)
      }
    }

    while (toggle === true) { 
      const [x, y, color] = getClientMouse()
      await client.placePixel(x, y, color, false)
      if (seven.brushdotter && lastpixel.x != x || lastpixel.y != y) {
        brushDotter(x, y, color) 
      }
      lastpixel = {x, y}
      await new Promise(resolve => setTimeout(resolve, 0));    
    } 
}

