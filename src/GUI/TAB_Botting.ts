import { botImage, BotSquare } from "../modules";
import Queue from "../modules/defaultModules/Queue";
import getClientMouse from "../modules/util/getClientMouse";
import { MainGUI } from "./GUICore";

$(function() {
    const GUI = MainGUI.instance;
    const TAB = GUI.createTab("Botting", "https://pngimg.com/d/android_logo_PNG5.png");
    GUI.switchTab("Botting")

    const image_submenu = TAB.createSubmenu("Images");
    let current_image: File;
    let current_image_x: number;
    let current_image_y: number;
    image_submenu.createDrop("Drop Image", dropped_image => {
        current_image = dropped_image;
    });
    image_submenu.createButton("Choose Image", () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    document.body.appendChild(input);

    input.addEventListener('change', function () {
        const file = input.files[0];
        if (!file) return;

        const dropTarget = document.querySelector('.dropImage');

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const dragEnter = new DragEvent('dragenter', { dataTransfer: dataTransfer });
        const dragOver = new DragEvent('dragover', { dataTransfer: dataTransfer });
        const drop = new DragEvent('drop', { dataTransfer: dataTransfer });

        dropTarget.dispatchEvent(dragEnter);
        dropTarget.dispatchEvent(dragOver);
        dropTarget.dispatchEvent(drop);
    });
    input.click();
});
    image_submenu.createInput("X", "number", x_coord => {
        current_image_x = parseInt(x_coord);
    });
    image_submenu.createInput("Y", "number", y_coord => {
        current_image_y = parseInt(y_coord);
    });

    const dithering_options = [
        {label: "None", value: "None"},
        {label: "FloydSteinberg", value: "FloydSteinberg"},
        {label: "FalseFloydSteinberg", value: "FalseFloydSteinberg"},
        {label: "Stucki", value: "Stucki"},
        {label: "Atkinson", value: "Atkinson"},
        {label: "Jarvis", value: "Jarvis"},
        {label: "Burkes", value: "Burkes"},
        {label: "Sierra", value: "Sierra"},
        {label: "TwoSierra", value: "TwoSierra"},
        {label: "SierraLite", value: "SierraLite"},
    ]
    image_submenu.createSelect("-- select dithering --", dithering_options, (value) => {
        if (value == "None") {
            window.seven.dither = null
            return
        }
        window.seven.dither = value
    })

    image_submenu.createButton("Start", () => {
        botImage(current_image_x, current_image_y, current_image);
    });
    image_submenu.createButton("Stop", () => {
        Queue.stop();
    });

    const protecting_submenu = TAB.createSubmenu("Protecting");
    protecting_submenu.createToggle("Protect", false, (state) => {
        window.seven.protect = state;
    });
    protecting_submenu.createToggle("Agressive protection", false, (state) => {
        window.seven.agressive_protection = state;
    });

    const square_submenu = TAB.createSubmenu("Squares");
    let square_x1: number;
    let square_y1: number;
    let square_x2: number;
    let square_y2: number;
    square_submenu.createText("Select color as usual")
    square_submenu.createInput('X1', "number", text => {
        square_x1 = parseInt(text);
    });
    square_submenu.createInput('Y1', "number", text => {
        square_y1 = parseInt(text);
    });
    square_submenu.createInput('X2', "number", text => {
        square_x2 = parseInt(text);
    });
    square_submenu.createInput('Y2', "number", text => {
        square_y2 = parseInt(text);
    });
    square_submenu.createButton("Start", () => {
        BotSquare(square_x1, square_y1, square_x2, square_y2, getClientMouse()[2]);
    });
    square_submenu.createButton("Stop", () => {
        Queue.stop();
    });
})
