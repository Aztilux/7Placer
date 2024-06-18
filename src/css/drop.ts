import { drop } from './style'
import { botImage, ImageToPixels } from '../modules/defaultModules/SevenImageTools'
import getClientMouse from '../modules/util/getClientMouse'

export function createDropArea() {
    const dropobject = $('<div>').text('Drop Image').css(drop)
    const [x, y] = getClientMouse()
    $('body').append( dropobject )

    dropobject.on("click", function() {
      dropobject.remove() 
    })

    dropobject.on("drop", async function(event) {
        event.preventDefault(); event.stopPropagation();
        const image = event.originalEvent.dataTransfer.files[0]
        dropobject.remove() 
        await botImage(x, y, image)
        // console.log(image)
    }).on('dragover', false);
}