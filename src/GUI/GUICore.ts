import dragElement from "./dragElement";

export class MainGUI {
    private static _instance: MainGUI
    private _tabs: Map<String, Tab> = new Map()

    constructor() {
        this._createMainGUI();
    }

    public createTab(name: string, tab_image: string): Tab {
        if (this._tabs.has(name)) return;
        const created_tab = new Tab(this, name, tab_image)
        this._tabs.set(name, created_tab)
        return created_tab
    }

    public switchTab(name: string): void {
        const tab = this._tabs.get(name)
        this._tabs.forEach((tab) => {
            tab.hide()
        })
        tab.show()
    }

    public getTab(name: string): Tab {
        return this._tabs.get(name)
    }

    private _createMainGUI(): void {
        // main gui elements
        let GUI_core = `
        <div id='sevenGUI' style="display: none;">
            <div id="sevenGUIheader">7PLACER</div>
            <div id="rainbowBar"></div>
            <div id="generalContainer">
                <div id="sideBarContainer">
                    <div id="sideBarTabContainer"></div>
                </div>
            </div>
        </div>
        `;
        $("body").append(GUI_core);
        dragElement($("#sevenGUI")[0])

        // menu toggle
        const toggle_gui_button = $('<a href="#" title="Seven Opener" class="grey margin-top-button"><img src="https://infonutricional.tomatelavida.com.co/wp-content/uploads/2023/06/postobon_informacion_nutriconallogo-7up.png" alt="icon"></a>')
        $("#menu-buttons").append(toggle_gui_button)
        let toggle = false
        toggle_gui_button.on("click", () => {
            if (toggle) {
                $('#sevenGUI').css("display", "none")
                toggle = false
            } else {
                $('#sevenGUI').css({"display": "flex", "top": "50%", "left": "50%", "transform": "translate(-50%, -50%)"})
                toggle = true
            }
        })

        // settings tab
        const settings_tab = this.createTab('settings', 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Settings-icon-symbol-vector.png')
        settings_tab.tab_button.appendTo('#sideBarContainer')
    };

    public static get instance() {
        if (!this._instance) {
            this._instance = new MainGUI
        }
        return this._instance
    }
};

export class Tab {
    private _submenus: Map<string, Submenu> = new Map()
    private _main_gui: MainGUI
    private _tab_button: JQuery<HTMLElement>
    private _submenu_container: JQuery<HTMLElement>

    constructor(main_gui: MainGUI, name: string, tab_image: string) {
        this._main_gui = main_gui
        this._createTab(name, tab_image);
    };

    public createSubmenu(name: string) {
        if (this._submenus.has(name)) return;
        const created_submenu = new Submenu(this, name)
        this._submenus.set(name, created_submenu)
        return created_submenu
    }

    public getSubmenu(name: string) {
        return this._submenus.get(name)
    }

    public show() {
        this._tab_button.addClass("selected")
        this._submenu_container.css("display", "flex")
    }

    public hide() {
        this._tab_button.removeClass("selected")
        this._submenu_container.css("display", "none")
    }

    private _createTab(name: string, tab_image: string) {
        this._tab_button =  $(`<div class="sideBarTab" id="tabButton_${name}"><img src="${tab_image}" class="sideBarTab"></div>`);
        this._tab_button.on("click", () => {
            this._main_gui.switchTab(name)
        })
        $("#sideBarTabContainer").append(this._tab_button);

        this._submenu_container = $(`<div class="GUITabContainer" id="tab_${name}">`).css("display", "none")
        $("#generalContainer").append(this._submenu_container)
    };

    get submenu_container() {
        return this._submenu_container
    }
    get tab_button() {
        return this._tab_button
    }
}

export class Submenu {
    private _parent_tab: Tab
    private _submenu_element: JQuery<HTMLElement>
    private _submenu_inside: JQuery<HTMLElement>

    constructor(parent_tab: Tab, name: string) {
        this._parent_tab = parent_tab
        this._createSubmenu(name)
    }

    public createToggle(name: string, default_state: boolean, callback: (state: boolean) => void): JQuery<HTMLElement> {
        const container = $(`<div class="toggleContainer" id="toggle_${name}"></div>`)
        container.append('<div class="toggleSquare"></div>')
        container.append(`<p class="toggleName">${name}</p>`)
        this._submenu_inside.append(container)
        if (default_state) {
            container.addClass("toggled")
        }
        let state = default_state
        container.on("click", () => {
            if (state) {
                state = false
                container.removeClass("toggled")
            } else {
                state = true
                container.addClass("toggled")
            }
            callback(state)
        })
        return container
    }

    public createButton(name: string, callback: () => void): JQuery<HTMLElement> {
        const button = $(`<div class="button" id="button_${name}">${name}</div>`)
        this._submenu_inside.append(button)
        button.on("click", () => {
            callback()
        })
        return button
    }

    public createDrop(label: string, onFile: (img: File) => void): JQuery<HTMLElement> {
        const drop_container = $(`<div class="dropImage">${label}</div>`);
        drop_container.on("dragover", function (event) {
            event.preventDefault();
        });
        drop_container.on("drop", function (event) {
            event.preventDefault();
            const file = event.originalEvent.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    drop_container.html(`<img src="${e.target.result}" style="max-width: 100%; max-height: 100%;">`);
                };
                reader.readAsDataURL(file);
                onFile(file);
            }
        });
        this._submenu_inside.append(drop_container);
        return drop_container
    }

    public createInput(placeholder: string, type: string, onType: (text: any) => void) {
        const input = $(`<input class="input" type="${type}" placeholder="${placeholder}">`)
        input.on("input", () => {
            onType(input.val())
        })
        this._submenu_inside.append($(`<div class="inputContainer"></div>`).append(input))
    }

    public createText(text: string) {
        const container = $(`<div class="textContainer">`)
        container.append(`<p>${text}</p>`)
        this._submenu_inside.append(container)
    }

    public createSelect(default_value: string, options: {label: string, value: string}[], onChange: (value: any) => void) {
        const selector = $(`<select id="selector_${default_value}"></select>`)
        selector.append(`<option value="">${default_value}</option>`)
        for (const option of options) {
            selector.append(`<option value="${option.value}">${option.label}</option>`)
        }
        selector.on("change", () => {
            const value = selector.val()
            if (value == "") return
            onChange(value)
        })
        this._submenu_inside.append(selector)
    }

    private _createSubmenu(name: string): void {
        this._submenu_element = $(`<div class="GUISubmenu" id="submenu_${name}">`)
        this._submenu_element.append(`<p class="submenuTitle">${name}</p>`)
        this._submenu_inside = $('<div class="submenuInside">')
        this._submenu_element.append(this._submenu_inside)
        this._parent_tab.submenu_container.append(this._submenu_element)
    }
}
