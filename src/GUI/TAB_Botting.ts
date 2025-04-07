import { botImage } from "../modules";
import Queue from "../modules/defaultModules/Queue";
import { MainGUI, Tab, Submenu } from "./GUICore";

$(function() {
    const GUI = MainGUI.instance;
    const TAB = GUI.createTab("Botting", "https://pngimg.com/d/android_logo_PNG5.png");
    const image_submenu = TAB.createSubmenu("Images");

    let current_image: File;
    let current_x: number;
    let current_y: number;
    image_submenu.createDrop("Drop Image", dropped_image => {
        current_image = dropped_image;
    })
    image_submenu.createInput("X", "number", x_coord => {
        current_x = parseInt(x_coord);
    })
    image_submenu.createInput("Y", "number", y_coord => {
        current_y = parseInt(y_coord);
    })
    image_submenu.createButton("Start", () => {
        botImage(current_x, current_y, current_image)
    })
    image_submenu.createButton("Stop", () => {
        Queue.stop()
    })

    const protecting_submenu = TAB.createSubmenu("Protecting");
    protecting_submenu.createToggle("Protect", false, (state) => {
        window.seven.protect = state
    })
})
