import { drop } from './css'
import { botImage, ImageToPixels } from '../modules/SevenImageTools'
import getClientMouse from '../modules/util/getClientMouse'

export function createDropArea() {
    const dropobject = $('<div>').text('Drop Image').css(drop)
    const [x, y] = getClientMouse()
    $('body').append( dropobject )
    dropobject.on("click", function() {
      dropobject.remove() 
    })
    dropobject.on("drop", async function(event) {
      event.preventDefault();  
      event.stopPropagation();
      const image = await createImageBitmap(event.originalEvent.dataTransfer.files[0])
      dropobject.remove() 
      const processed = await ImageToPixels(image)
      await botImage(x, y, processed)
      console.log(processed)
    }).on('dragover', false);
}