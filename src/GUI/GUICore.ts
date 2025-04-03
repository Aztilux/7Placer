class MainGUI {
    private _tabs: Map<String, Tab> = new Map()

    constructor() {
        this._createMainGUI();
    }

    public createTab(name: string, tab_image: string) {
        if (this._tabs.has(name)) return;
        const created_tab = new Tab(this, name, tab_image)
        this._tabs.set(name, created_tab)
    }

    public switchTab(name: string) {
        const tab = this._tabs.get(name)
        this._tabs.forEach((tab) => {
            tab.hide()
        })
        tab.show()
    }

    public getTab(name: string) {
        return this._tabs.get(name)
    }

    private _createMainGUI() {
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
    private main_gui: MainGUI
    private tab_button: JQuery<HTMLElement>
    private submenu_container: JQuery<HTMLElement>

    constructor(main_gui: MainGUI, name: string, tab_image: string) {
        this.main_gui = main_gui
        this._createTab(name, tab_image);
    };

    public show() {
        this.tab_button.addClass("selected")
        this.submenu_container.css("display", "block")
    }

    public hide() {
        this.tab_button.removeClass("selected")
        this.submenu_container.css("display", "none")
    }


    private _createTab(name: string, tab_image: string) {
        this.tab_button =  $(`<div class="sideBarTab" id="tabButton_${name}"><img src="${tab_image}" class="sideBarTab"></div>`);
        this.tab_button.on("click", () => {
            this.main_gui.switchTab(name)
        })
        $("#sideBarContainer").append(this.tab_button);

        this.submenu_container = $(`<div class="GUISubmenuContainer" id="tab_${name}">`)
        $("#generalContainer").append(this.submenu_container)
    };
}

const GUI = new MainGUI();
const tab1 = GUI.createTab("test", "https://pngimg.com/d/android_logo_PNG5.png")
GUI.createTab("test2", "https://pngimg.com/d/android_logo_PNG5.png")
