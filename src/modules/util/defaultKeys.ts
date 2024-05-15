import getClientMouse from "./getClientMouse";
import Canvas from "../../canvas/Canvas";
import { createDropArea } from "../../css/drop";

$(document).on('keyup', function(event) {
  if($(':input[type="text"]').is(':focus')) return //; prevent with chat open
  const canvas  = Canvas.instance

  switch (event.which) {
      case 66:
        createDropArea()
        break
      // add more  
  }
});

export * from './defaultKeys'