import getClientMouse from "../util/getClientMouse";
import Queue from "./Queue";
import { BotSquare } from "./SquareMaker";

var coord1: { x: any; y: any; } = null
$(document).on('keydown', function(event) {
    if($(':input[type="text"]').is(':focus')) return
    let x: number, y: number, color: number

    switch (event.which) {
        case (87):
          if (!event.altKey) return
          Queue.stop()
          break
        case (66):
          [x, y, color] = getClientMouse();
          $("#number_input_X").val(x)
          $("#number_input_Y").val(y)
          break;
        case 88:
          [x, y, color] = getClientMouse();
          if (coord1 == null) { coord1 = {x: x, y: y}; return; };
          BotSquare(coord1.x, coord1.y, x, y, color);
          coord1 = null;
          break;
    }
});
