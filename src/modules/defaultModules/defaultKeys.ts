import { createDropArea } from "../../css/drop";
import getClientMouse from "../util/getClientMouse";
import Queue from "./SevenQueue";
import { BotSquare } from "./SevenSquareMaker";

var coord1: { x: any; y: any; } = null
$(document).on('keyup', function(event) {
    if($(':input[type="text"]').is(':focus')) return //; prevent with chat open

    switch (event.which) {
        case (87):
          if (!event.altKey) return
          Queue.stop()
          break
        case (66):
          if (!event.altKey) return
          createDropArea()
          break               
        case 88:
          const [x, y, color] = getClientMouse()
          if (coord1 == null) { coord1 = {x: x, y: y}; return; }
          BotSquare(coord1.x, coord1.y, x, y, color)
          coord1 = null
          break                   
        // add more 
    }
});