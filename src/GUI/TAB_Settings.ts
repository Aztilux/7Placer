import { MainGUI } from "./GUICore"
import packageInfo from '../../package.json';

$(function() {
    const gui = MainGUI.instance
    const tab = gui.getTab("settings")

    const bot_settings = tab.createSubmenu("bot settings")
    bot_settings.createText("pixel speed default is 21")
    const pixelspeed_input = bot_settings.createInput(`pixel speed`, "number", (number) => {
        number = parseInt(number)
        if (number < 16.5) number = 16.5
        window.seven.pixelspeed = number
    })

    const sort_options = [
        {label: "none", value: "none"},
        {label: "grid", value: "grid"},
        {label: "top left", value: "topleft"},
        {label: "random", value: "rand"},
        {label: "colors", value: "colors"},
        {label: "vertical", value: "vertical"},
        {label: "horizontal", value: "horizontal"},
        {label: "circle", value: "circle"},
    ]
    bot_settings.createSelect('-- select sorting --', sort_options, value => {
        window.seven.order = value
    })

    bot_settings.createText('Only works in canvas your admin')
    const pixel_type_options = [
        {label: "default", value: "default"},
        {label: "protect", value: "protect"},
        {label: "sea protect", value: "seaprotect"},
        {label: "unprotect", value: "unprotect"},
        {label: "replace", value: "replace"},
    ]
    bot_settings.createSelect('-- select tool --', pixel_type_options, value => {
        window.seven.pixel_type = value
    })
    bot_settings.createColor("GUI Color Picker", "", color => {
        $(":root").css("--gui-main-color", color)
    })

    tab.createSubmenu("version").createText("7Placer version " + packageInfo.version)
})
