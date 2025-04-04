class MainGUI {
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
        let GUI_core = `
        <div id='sevenGUI' style="display: none;">
            <div id="rainbowBar"></div>
            <div id="generalContainer">
                <div id="sideBarContainer"></div>
            </div>
        </div>
        `;
        $("body").append(GUI_core);

        const toggle_gui_button = $('<a href="#" title="Seven Opener" class="grey margin-top-button"><img src="https://infonutricional.tomatelavida.com.co/wp-content/uploads/2023/06/postobon_informacion_nutriconallogo-7up.png" alt="icon"></a>')
        $("#menu-buttons").append(toggle_gui_button)
        let toggle = false
        toggle_gui_button.on("click", () => {
            if (toggle) {
                $('#sevenGUI').css("display", "none")
                toggle = false
            } else {
                $('#sevenGUI').css("display", "flex")
                toggle = true
            }
        })
    };

    public static get instance() {
        if (!this._instance) {
            this._instance = new MainGUI
        }
        return this._instance
    }
};

class Tab {
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
        $("#sideBarContainer").append(this._tab_button);

        this._submenu_container = $(`<div class="GUITabContainer" id="tab_${name}">`).css("display", "none")
        $("#generalContainer").append(this._submenu_container)
    };

    get submenu_container() {
        return this._submenu_container
    }
}

class Submenu {
    private _parent_tab: Tab
    private _submenu_element: JQuery<HTMLElement>
    private _submenu_inside: JQuery<HTMLElement>

    constructor(parent_tab: Tab, name: string) {
        this._parent_tab = parent_tab
        this._createSubmenu(name)
    }

    public createToggle(name: string, default_state: Boolean, callback: (state: Boolean) => void): JQuery<HTMLElement> {
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
        const button = $(`<div class="button" id="button_${name}">Test</div>`)
        this._submenu_inside.append(button)
        button.on("click", () => {
            callback()
        })
        return button
    }

    private _createSubmenu(name: string): void {
        this._submenu_element = $(`<div class="GUISubmenu" id="submenu_${name}">`)
        this._submenu_element.append('<p class="submenuTitle">Test</p>')
        this._submenu_inside = $('<div class="submenuInside">')
        this._submenu_element.append(this._submenu_inside)
        this._parent_tab.submenu_container.append(this._submenu_element)
    }
}

//Debug
// const GUI = new MainGUI();
// const tab1 = GUI.createTab("test", "https://pngimg.com/d/android_logo_PNG5.png")
// GUI.switchTab("test")
// let submenu = tab1.createSubmenu("test")
// submenu.createToggle("toggleTest", false, state => {
//     console.log("I am now: ", state)
// })
// GUI.createTab("test2", "https://pngimg.com/d/android_logo_PNG5.png")
