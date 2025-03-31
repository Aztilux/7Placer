import { hex2rgb } from "../../modules";

const getColors = function() {
    const palette_buttons = document.querySelectorAll("#palette-buttons a");
    let unsorted_array: {color: string, id: number}[] = []
    palette_buttons.forEach((color) => {
        let id = color.getAttribute('data-id')
        let colorhex = color.getAttribute('title')
        unsorted_array.push({color: colorhex, id: parseInt(id)})
    });
    unsorted_array.sort((a, b) => { return a.id-b.id })

    let result: {r: number, g: number, b: number}[] = []
    unsorted_array.forEach((colorobj) => {
        result.push(hex2rgb(colorobj.color))
    })

    return result
};

export const colors = getColors()
