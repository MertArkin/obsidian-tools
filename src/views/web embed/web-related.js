//to insert Letter At Beginning of (timestamp lines)
const {
  TextComponent,
  Plugin,
  ItemView,
  MarkdownView,
  FileView,
  TextFileView,
  EditableFileView,
  PluginSettingTab,
  Setting,
  WorkspaceLeaf,
  Menu,
  MenuItem,
  TAbstractFile,
  TFolder,
  TFile,
  MarkdownRenderer,
  normalizePath,
  App,
  Modal,
} = require("obsidian");

const VIEW_TYPE = "custom-view";
const VIEW_TYPE_EXAMPLE = "link-view";

class ExampleView extends ItemView {
  constructor(leaf) {
    super(leaf);
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "~ custom view ~";
  }
  async onOpen() {
    //also fix this part where current view has to be remodified for this to cpature
    //instead make it so if any file is already open in editor use that as my `active view of type`
    const currentView = this.app.workspace.getActiveViewOfType(MarkdownView);
    // console.log(currentView);
    if (currentView == null) {
      console.log("current view is null");
      return;
    } else {
      const viewData = currentView.getViewData(); //returns data as string
      const editor = currentView.editor;
      const lines = editor.getValue();
      const urls = [];
      const regex = /(https?:\/\/[^\s]+)/;
      const url = lines.split("\n");
      for (const line of url) {
        const match = line.match(regex);
        if (match) {
          urls.push(match[0]);
        }
      }
      console.log(urls);
      const container = this.containerEl.children[1];
      container.empty();
      container.createEl("h4", { text: this.getDisplayText() });
      //more dynamic way
      for (const url of urls) {
        this.frame = document.createElement("webview");
        // this.frame = document.createElement("iframe");
        //create iframes for urls that exist in the file user is viewing
        this.frame.setAttr(
          "style",
          "height: 100%; width:100%; padding-left: 25px; padding-right: 25px;"
        );
        // const userAgent =
        // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36";
        // this.frame.setAttr("userAgent", userAgent);
        // this.frame.setAttribute(
        //   "sandbox",
        //   "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads"
        // );
        // this.frame.setAttribute(
        //   "allow",
        //   "encrypted-media; fullscreen; oversized-images; picture-in-picture; sync-xhr; geolocation;"
        // );
        this.frame.setAttr("tabindex", "0");
        this.frame.setAttr("src", url);
        this.containerEl.children[1].appendChild(this.frame);
        //add a line break after the iframe - const lineBreak =
        //console.log(this.frame);
        this.containerEl.children[1].appendChild(document.createElement("hr"));
      }
      // const webview = document.querySelector("webview");
      // webview.addEventListener("dom-ready", () => {
      //   console.log("ready for these web views");
      // });
      /*
      https://chat.openai.com/c/aec19b8c-9ff6-489c-8113-05885940da99
      https://www.electronjs.org/docs/latest/api/webview-tag#:~:text=Use%20the%20webview%20tag%20to,separate%20process%20than%20your%20app.
      https://www.electronjs.org/docs/latest/api/web-contents
      
      ^ check how can you fix and use embed within electron node js obsidian and codemirror support
      +
      couldnt make all of the methods and params defined in above links work, so look at them
      and maybe the strcturing of my plugin too (change it since now i learned how to do import/export moudles etc in commonjs) - 07/04/2024
      (The WebView must be attached to the DOM and the dom-ready event emitted before this method can be called.)
      */
      // const webviews = document.querySelectorAll("webview");
      // webviews.forEach((webview) => {
      //   webview.addEventListener("dom-ready", () => {
      //     webview.loadURL("https://github.com'");
      //     const contents = webview.webContents;
      //     console.log(contents);
      //   });
      // });
      /*
        webview.loadURL(
          "https://stackoverflow.com/questions/3290424/set-a-cookie-to-never-expire"
        );
        let useragent = webview.getUserAgent();
        console.log(useragent);
        */
    }
  }
  async onClose() {
    // Nothing to clean up.
  }
}
module.exports = class ExamplePlugin2 extends Plugin {
  //hold an external variable reference to the custom view class (see also how other people have done it)
  //customView = new ExampleView();
  async onload() {
    this.addRibbonIcon("dice", "Resetttttttttttt Plugin", () => {
      this.app.plugins
        .disablePlugin(this.manifest.id)
        .then(() => this.app.plugins.enablePlugin(this.manifest.id));
      new Notice("Resetting plugin - " + this.manifest.name);
      //const window = activeWindow;
      this.showView(); //it works and also check what focus is
    });

    this.registerView(VIEW_TYPE, (leaf) => new ExampleView(leaf));

    // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // Using this function will automatically remove the event listener when this plugin is disabled.
    // this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
    // 	console.log('click', evt);
    // });

    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    // this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

    //window | document here?
    this.registerDomEvent(window, "click", (el) => {
      //check/get activeviewoftpye view when click is happening not before the event (in case it dissapears by the time we capture it)
      const currentView = this.app.workspace.getActiveViewOfType(MarkdownView);
      // console.log(el);
      // console.log(el.target);
      console.log("el innertext: " + el.target.innerText); //only captures the text that is too inner so we use the editor trick below to patch our program top get the full line usign editor api class
      const editor = currentView.editor;
      const cursor = editor.getCursor();
      // console.log(editor.getCursor());
      // console.log(cursor.line);
      console.log("editor get line: " + editor.getLine(cursor.line));
      console.log(el.target.innerText.startsWith("https://"));
      if (
        el.target.innerText.startsWith("http://") ||
        el.target.innerText.startsWith("https://")
      ) {
        // console.log("matched url");
        // const markdownLinks = document.querySelectorAll(
        //   ".markdown-reading-view div p a"
        // );
        // console.log(markdownLinks);
        // markdownLinks.forEach((link) => {
        //   link.style.pointerEvents = "none"; // Disable click behavior
        //   link.style.backgroundImage = "none"; // Remove hyperlink icon
        //   // link.style.cursor = "pointer"; // doesnt work
        // });
        // el.preventDefault();
        // el.target.preventDefault();
        // el.stopPropagation();
        // el.target.stopPropagation();
        this.showView();
      }
    });
    this.addRibbonIcon("help", "show web", () => {
      if (this.app.workspace.rightSplit.collapsed == true) {
        this.app.workspace.rightSplit.expand();
        // this.app.workspace.onLayoutReady(async () => {
        //   this.showView();
        // });
        // this.showView();
        // https://docs.obsidian.md/Reference/TypeScript+API/Component/registerInterval
        setTimeout(() => {
          this.showView(); //it works and also check what focus is
        }, 50);
      } else if (this.app.workspace.rightSplit.collapsed == false) {
        this.app.workspace.rightSplit.collapse();
      }
    });
  }

  async onunload() {
    // Clean up when the plugin is unloaded
    // No explicit cleanup for view plugin is necessary as it will be automatically destroyed
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);

    // Clean up when the plugin is unloaded
    // No explicit cleanup for view plugin is necessary as it will be automatically destroyed
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);
  }

  async showView() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);

    await this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE,
      active: false, //solved (dont set the link view active just create it instead)
    });

    // Reveal the leaf
    const leavesOfType = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (leavesOfType.length > 0) {
      const leafContainer =
        leavesOfType[0].containerEl.parentElement.parentElement.parentElement;
      // leafContainer.style.width = "1200px"; // Set the width of the leaf container
      this.app.workspace.revealLeaf(leavesOfType[0]);
    }
    // this.app.workspace.revealLeaf(
    //   this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
  }
};
