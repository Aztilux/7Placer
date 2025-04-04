class MainGUI {
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
        <div id='sevenGUI'>
            <div id="rainbowBar"></div>
            <div id="generalContainer">
                <div id="sideBarContainer"></div>
            </div>
        </div>
        `;
        $("body").append(GUI_core);
    };
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
    constructor(parent_tab: Tab, name: string) {
        this._parent_tab = parent_tab
        this._createSubmenu(name)
    }

    private _createSubmenu(name: string) {
        const submenu_element = $(`<div class="GUISubmenu" id="submenu_${name}">`)
        submenu_element.append('<p class="submenuTitle">Test</p>')
        submenu_element.append('<div class="submenuInside">')
        this._parent_tab.submenu_container.append(submenu_element)
    }
}

//Debug
// $("#menu-buttons").append('<a href="#" title="Seven Opener" class="grey margin-top-button"><img src="https://infonutricional.tomatelavida.com.co/wp-content/uploads/2023/06/postobon_informacion_nutriconallogo-7up.png" alt="icon"></a>')
// const GUI = new MainGUI();
// const tab1 = GUI.createTab("test", "https://pngimg.com/d/android_logo_PNG5.png")
// GUI.switchTab("test")
// tab1.createSubmenu("test")
// GUI.createTab("test2", "https://pngimg.com/d/android_logo_PNG5.png")
