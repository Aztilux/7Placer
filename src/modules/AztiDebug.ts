import { Client } from "../bot/Bot";
import Canvas from "../canvas/Canvas";
import Queue from "./defaultModules/SevenQueue";
import '../variables'
import '../css/drop'
import getClientMouse from "./util/getClientMouse";
import AztiHackerPlacer from "./AztiHackerPlacer";

const client = Client.instance;
const canvas = Canvas.instance;
const seven = (window as any).seven
seven.brushdotter = true

function debugSquare() {
  const [x, y, color] = getClientMouse()    
  const size = 100
  var colorindex = 0
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if (colorindex >= 50) {
        colorindex = 0
      }
      Queue.add(x+j, y+i, color)
      colorindex += 1
    }
  }
  Queue.start()
}

$(document).on('keyup', function(event) {
  if($(':input[type="text"]').is(':focus')) return // azti debug custom keys

  switch (event.which) {
      case 90:
        AztiHackerPlacer()
        break
      case 68:        
        debugSquare()
        break
      case 88:
        var [x, y] = getClientMouse()
        console.log(`7p> [${x}, ${y}]: ${canvas.getColor(x, y)}`) 
        break  
  }
});

export * from './AztiDebug'