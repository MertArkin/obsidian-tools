const {
  MarkdownRenderer,
  Plugin,
  MarkdownView,
  PluginSettingTab,
  Setting,
  TextFileView,
  MarkdownPreviewRenderer,
  ItemView,
  TFolder,
  TFile,
} = require("obsidian");

//Maybe you can get rid of all the settings ?
// const DEFAULT_SETTINGS = {
//   mySetting: "default",
//   dateFormat: "YYYY-MM-DD",
// };
// const VIEW_TYPE = "view";
//

const DEFAULT_SETTINGS = {
  dateFormat: "YYYY-MM-DD",
  acceptLinks: false,
  acceptOtherFiles: false, //render local files in obsidian file
  //saveLinksAsFile: false,
  openOtherFiles: false, //render local files in obsidian file view
  searchInCurrentFolder: false,
};

const VIEW_TYPE = "view";
var fileview = false;

acceptedExtensions = [];

savedURLfiles = [];

module.exports = class CodeEmbed extends Plugin {
  //give any css class name
  //static errorClass = "code-embed-error";
  static containerClass = "code-embed";
  static titleClasses = ["code-embed-title"];

  //async onload function
  async onload() {
    // /super.onload(); //custom stuff
    //get other extensions to support (or rendered in default obsidian app) ! supports also multiple params "",
    /*
    try {
      this.registerExtensions(["txt"], "markdown");
    } catch {
      console.log("catching");
    }
    */

    // register the custom view as a built-in view
    // whats the diffference { } or without it
    // this.registerView(VIEW_TYPE, (leaf) => new MyCustomView(leaf));
    //register extensions
    // this.registerExtensions(["txt", "py"], VIEW_TYPE);

    //icons that are shared in common parent folder cant referred
    // async defined "addRibbonIcon" here gets the icons late causing render issues

    //send also this class which extends plugin to keep a reference ? here its thus.settings (because it extends plugin i guess)
    this.registerView(VIEW_TYPE, (leaf) => new ExampleView(leaf, this));

    //settimeout or this from obsidian ts api should work
    // why tho? - 07/04/2024
    /*
    problems in running functions rot(right on time)
    settimeout seems to work better as a delay action
    */
    this.app.workspace.onLayoutReady(async () => {
      this.addRibbonIcon("dice", "superEdit", () => {
        this.app.plugins
          .disablePlugin(this.manifest.id)
          .then(() => this.app.plugins.enablePlugin(this.manifest.id));
        new Notice("plugin resetted");
        //this.test();
      });

      /* MOVE THIS BLOCK OUT OF registerMarkdownPostProcessor to run it once ? - why ? - */
      const activeLeaf = this.app.workspace.activeLeaf;
      if (!activeLeaf) return;
      //console.log(activeLeaf);
      const currentFile = activeLeaf.view.file;
      if (!currentFile) return;
      //console.log(currentFile);
      const currentDir = currentFile.parent.path; //make dynamix move it under post process ? NO RUNS TWICE
      if (!currentDir) return; //true returns all parents except file
      //console.log(currentDir); //returns where current file is (which folder)

      if (this.settings.openOtherFiles) {
        //async really needed here ?
        this.addRibbonIcon("star", "superEdit", async () => {
          //this.test();
          this.openFileView();
          new Notice("starrrrr");
        });
      }
    });

    //IT WORKS NOW WHEN I START OBSIDIAN - also can use the code below for every file-open
    //but it works now every time the function is called it checks bools from settings

    this.LinksPostProcessor();

    /*
    simdilik disable ki deneyim saved snippets thing
    this.registerEvent(
      this.app.workspace.on("file-open", async (file) => {
        // Do something when a file is opened
        //console.log(file);
        //console.log(file.extension);
        this.FilesView(file);
        //console.log("running procs");
      })
    );
    */
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  //works whne plugin reset
  async onunload() {
    //console.log("UNREGISTERING..."); //(try to register some stuff here)
    //this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  async ResetPlugin() {
    //reset this plugin
    console.log("resetting this plugin");
    this.app.plugins
      .disablePlugin(this.manifest.id)
      .then(() => this.app.plugins.enablePlugin(this.manifest.id));
  }

  //TODO: FUNCTIONIZE all functionality code and call where necessary with values from settings
  //
  async LinksPostProcessor() {
    //console.log("acceptOtherFiles=" + this.settings.acceptOtherFiles);
    //this.settings.acceptOtherFiles = true;
    //console.log("acceptOtherFiles=" + this.settings.acceptOtherFiles);

    //console.log("saveAsFile=" + this.settings.saveAsFile);

    this.registerMarkdownPostProcessor(async (doc, ctx) => {
      //console.log("document rendered again"); //for each element it renders it (the thing we access)
      // https://discord.com/channels/686053708261228577/840286264964022302/1091740508147159183

      // const codeblocks = doc.querySelectorAll(".internal-embed");
      const codeblocks = doc.querySelectorAll(".code");
      for (let index = 0; index < codeblocks.length; index++) {
        const fname = codeblocks[index].getAttribute("alt");
        //console.log(codeblocks[index]);
        //console.log(fname);

        /*
        
        limitations:
        if we want to get all the internal embedded links that we captured already
        we have to do rendering all over again ? or if we functionize more we can do this ? get(ter) set(ter)s
        we can do search in all vault ending ... [x]
        we can do search in current folder ending ... [x]
        we can do search in file ending ... ?! (we need to do this so [folderA--m] [folderB--n[m]] (m, n ar files, lets say when m is referred from any other file we should render that too))

        */

        //if (fname.endsWith("py")) { }

        //doesnt work
        //Deal with stuff in the backlinks section, still clickable and have errors
        //we cant disable click otherwise natural behaviour of program goes away
        /*
        const backlinks = document.querySelector(".search-result-container");
        console.log("Found search result container:", backlinks);
        */

        /*
        this.registerDomEvent(document, "click", (event) => {
          const treeItemSelf = event.target.closest(".tree-item-self");
          try {
            if (treeItemSelf) {
              event.preventDefault();
              //event.stopPropagation();
            }
          } catch (error) {
            if (
              error.message.includes(
                "File name cannot contain any of the following characters"
              )
            ) {
              new Notice("Invalid file name");
            } else {
              console.error(error);
              new Notice("An error occurred");
            }
          }
        });
        */

        /*
        Linked mentions: bu dosya nerelerde mentionlandi [[]]
        Unlinked mentions: bu dosyanin adi gecti ama mentionlanmadi

        itemview icon ?

        */

        if (this.settings.acceptLinks) {
          //it works (you download the plugin to be able to render http links that ends with suffix)

          //tirgger this also from settings
          if (fname.startsWith("http")) {
            console.log("running toggled"); //for each element it renders it (the thing we access)

            fetch(fname)
              .then((res) => res.text())
              .then((data) => {
                // create the file if it doesn't exist yet
                //if (!fileExists) {
                //  this.app.vault.create(newFilePath, data);
                //  console.log(`File ${newFilePath} created`);
                //}
                // just clear the inner HTML
                const suffix = fname.split(".").pop(); // only extension
                const syntax = "```" + suffix + "\n" + data + "\n```";

                const container = codeblocks[index];

                container.createDiv({
                  cls: [CodeEmbed.containerClass],
                });

                container.innerHTML = "";
                container.style.pointerEvents = "none";
                container.style.fontSize = "1.0em"; /* it is also nice */

                const buttons = container.createDiv({
                  cls: [CodeEmbed.titleClasses],
                });
                // Add a copy button to the container div
                const copyButton = buttons.createEl("button", {
                  text: "Copy",
                  //cls: ["copy-button"],
                });
                copyButton.style.position = "absolute";
                copyButton.style.top = "5px";
                copyButton.style.right = "5px";
                copyButton.style.zIndex = "1";
                copyButton.style.pointerEvents = "auto";

                buttons.style.paddingBottom = "18px"; //works

                copyButton.addEventListener("click", (event) => {
                  event.stopPropagation();
                  navigator.clipboard.writeText(data);
                  new Notice("Copied to Clipboard !");
                });

                //container.appendChild(buttons);

                //console.log(container);
                MarkdownRenderer.renderMarkdown(
                  syntax,
                  container,
                  ctx.sourcePath,
                  this
                );
              });
          }
        }
        //it works (you toggle this from settings the render local files in obsidian and ends with suffix)
        if (this.settings.acceptOtherFiles && !fname.startsWith("http")) {
          //for other files (txt, py, any other extension that exist in obsidian)
          console.log("its a normal file");

          //getFirstLinkpathDest linkpath, sourcePath returns TFile with the best match
          const flink = this.app.metadataCache.getFirstLinkpathDest(
            fname.split(" ").join("_").toLowerCase(), //whatever one word you type it will match the statement on left
            ""
          );
          //console.log(flink); //.path is with the file, .parent.path is without (just the file path)

          //console.log("path: " + flink.path);
          //console.log("parent path: " + flink.parent.path);
          //const fileExists = await this.app.vault.adapter.exists(flink);
          //console.log(fileExists);
          //console.log(fileExists);

          const suffix = fname.split(".").pop(); // only extension
          const fcontent = await this.app.vault.read(flink); //when url is broken this errors //read is Tfile
          const syntax = "```" + suffix + "\n" + fcontent + "\n```"; //suffix helps the syntax highlighting ```py ?

          codeblocks[index].innerHTML = "";
          codeblocks[index].style.pointerEvents = "none";
          codeblocks[index].style.fontSize = "15.07px"; // it is also nice

          const container = codeblocks[index].createDiv({
            cls: [CodeEmbed.containerClass],
          });

          //this below calls the post processor thats why we see multiple print comments
          //because that is the currently registered markdown post processor
          MarkdownRenderer.renderMarkdown(
            syntax,
            container,
            ctx.sourcePath,
            this
          );
        }
      }
    });

    /* IT WILL INITIALIZE AT THE START (enable event of plugin) */
    this.registerMarkdownPostProcessor(async (doc, ctx) => {
      //console.log("Processing markdown");
      /* find all internal links using its class selector */
      console.log(doc);
      for (let elem of doc.querySelectorAll(".code")) {
        console.log("Found internal-embed element");

        /* the alt attribute is the file name inside embed tags */
        const fname = elem.getAttribute("alt");
        console.log(fname); //url or file name
        const filename = decodeURIComponent(fname.split("/").pop());
        console.log(filename);
        //console.log(filename); //decoded
        //This all works
        //console.log(fname);
        //console.log(filename);
        // const a = this.app.metadataCache.getFirstLinkpathDest(filename, "");
        // const b = this.app.vault.getAbstractFileByPath(a.path);
        // console.log(a);
        // console.log(b.path);
        const suffix = fname.split(".").pop(); // only extension
        //create with path and file name ? use the codes above to search in all vault not current folders
        const newFilePath =
          currentDir + "/" + filename.split(" ").join("_").toLowerCase(); //path + file
        const fileExists = await this.app.vault.adapter.exists(newFilePath);

        /*
        if (
          !suffix.match(
            /(c)|(cpp)|(js)|(json)|(hs)|(py)|(java)|(ts)|(go)|(php)|(css)|(html)|(sql)|(cs)|(r)/
          )
        ) {
          console.log("it matches");
          continue;
        }
        */
        //check these supports later !
        //varolan dosya'larda sikinti yaratir (varsa bu yyoksa bunlar sonra bu) seklinde yaz programi
        // const flink = this.app.metadataCache.getFirstLinkpathDest(
        //   filename.split(" ").join("_").toLowerCase(), //whatever one word you type it will match the statement on left
        //   ""
        // ); // .parent.path all the path until file, .path all the path including file
        // console.log("File link: ", flink.path);

        //await works here wait for the app probs to load or cache ?
        //console.log("File exists: " + fileExists);
        //http check: when file exist is it https continue;

        // if (!fileExists) {
        //   console.log("file doesnt exist.. creating one");
        // }
        // if (fileExists) {
        //http check: when file exist
        //it can fetch and display no need for file but we will give user option to create a file with it boolean
        if (fname.startsWith("http")) {
          if (!fileExists) {
            //if file doesnt exist
            fetch(fname)
              .then((res) => res.text())
              .then((data) => {
                // create the file if it doesn't exist yet
                //if (!fileExists) {
                //  this.app.vault.create(newFilePath, data);
                //  console.log(`File ${newFilePath} created`);
                //}
                // just clear the inner HTML
                const syntax = "```" + suffix + "\n" + data + "\n```";
                elem.innerHTML = "";

                elem.style.pointerEvents = "none"; // disable pointer events (works, but gets rid of copy button too)

                const container = elem.createDiv({
                  cls: [CodeEmbed.containerClass],
                });

                const buttons = elem.createDiv({
                  cls: [CodeEmbed.titleClasses],
                });

                // Add a copy button to the container div
                const copyButton = buttons.createEl("button", {
                  text: "Copy",
                  cls: ["copy-button"],
                });

                const openVsCodeButton = buttons.createEl("button", {
                  text: "open in VSCode",
                  cls: ["vscode-button"],
                });

                /*
                //dont need it, just copy and paste or think what else
                const shareCodeLinkButton = buttons.createEl("button", {
                  text: "share code link",
                  cls: ["share-code-link-button"],
                });
                */

                //WE CAPTURE THE CLICK SO IT PREVENTS THE DEFAULT ERROR BELOW - interesting + (works on elem too ? so we can
                //disable these buttons or beacuse we have more that one button its just better to keep them as this)
                /*
                app.js:1 Error: File name cannot contain any of the following characters: * " \ / < > : | ?
                */

                // Add a click listener to the copy button
                copyButton.addEventListener("click", (event) => {
                  event.stopPropagation();
                  navigator.clipboard.writeText(data);
                  //copyButton.focus();
                  console.log("copying"); //look better ways to show user - notice ?
                  new Notice("Copied to Clipboard !");
                });

                openVsCodeButton.addEventListener("click", (event) => {
                  event.stopPropagation();
                  console.log("it works");
                  new Notice("opening in vscode: " + " ");
                  //navigator.clipboard.writeText(data);
                  //copyButton.focus();
                });

                /*
                shareCodeLinkButton.addEventListener("click", (event) => {
                  event.stopPropagation();
                  console.log("sharing link");
                  //navigator.clipboard.writeText(data);
                  //copyButton.focus();
                });
                */

                // Set position of copy button to top right
                copyButton.style.position = "absolute";
                copyButton.style.top = "5px";
                copyButton.style.right = "5px";
                copyButton.style.zIndex = "1"; // Set higher z-index

                // Disable pointer events only on the copy button
                copyButton.style.pointerEvents = "auto";

                openVsCodeButton.style.pointerEvents = "auto";
                //shareCodeLinkButton.style.pointerEvents = "auto";

                buttons.style.paddingBottom = "18px"; //works
                container.appendChild(buttons);

                /*
                const buttonContainer = container.createDiv({
                  cls: [CodeEmbed.titleClasses],
                });
                const button = buttonContainer.createEl("button", {
                  text: "Click me",
                });
                buttonContainer.style.position = "relative";
                buttonContainer.style.top = "0";
                buttonContainer.style.right = "0";
                buttonContainer.style.padding = "0.5em";
                button.style.marginLeft = "0.5em";
                */
                //container.appendChild(buttonContainer);

                container.style.fontSize = "1.1em"; /* it is also nice */
                //create new leaf on right same file source mode functionality ?
                MarkdownRenderer.renderMarkdown(
                  syntax,
                  container,
                  ctx.sourcePath,
                  this
                );
              });
          } else {
            //if exists user wants to save !
            const flink = this.app.metadataCache.getFirstLinkpathDest(
              filename.split(" ").join("_").toLowerCase(), //whatever one word you type it will match the statement on left
              ""
            );
            //console.log("File link: ", flink);
            console.log("file starts with http");
            const fileExists = await this.app.vault.adapter.exists(newFilePath);
            console.log(fileExists);
            //FINISH THIS LATER ALSO RENDER (methodla renderi)
          }
        } else {
          //this gets the file which is there already (local codes)
          console.log("normal file already exists");
          //console.log(`File ${newFilePath} already exists`);
          //get file link from file name (with obsidian api)
          const flink = this.app.metadataCache.getFirstLinkpathDest(
            filename.split(" ").join("_").toLowerCase(), //whatever one word you type it will match the statement on left
            ""
          ); //dont use split support with spaces
          //console.log("File link: ", flink);
          // read file content from cache not cachedRead
          const fcontent = await this.app.vault.read(flink); //when url is broken this errors
          //console.log(`File content:\n${fcontent}`); //*** */
          // decorate file content with file suffix (suffix gives the layout i tried)*/
          const syntax = "```" + suffix + "\n" + fcontent + "\n```";
          //console.log(`Decorated content: ${syntax}`);
          // just clear the inner HTML
          elem.innerHTML = "";
          elem.style.pointerEvents = "none"; // disable pointer events (works, but gets rid of copy button too)
          //maybe use this then create 3 buttons for run in copy, run in cmd, open in vs code
          // create container element for code block
          const container = elem.createDiv({
            cls: [CodeEmbed.containerClass],
          });
          //container.style.zoom = "140%";
          container.style.fontSize = "1.1em"; /* it is also nice */
          //render highlighted code to code block (renders inside the container
          //where the code is with ``` tags)
          //create new leaf on right same file source mode functionality ?
          MarkdownRenderer.renderMarkdown(
            syntax,
            container,
            ctx.sourcePath,
            this
          );
        }
      }
    });
  }

  /*
  async FilesView(f) {
    if (this.settings.openOtherFiles && !fileview) {
      //how to unrergister these
      //this.app.workspace.detachLeavesOfType(VIEW_TYPE);
      this.registerView(VIEW_TYPE, (leaf) => new MyCustomView(leaf));
      this.registerExtensions(["txt", "py"], VIEW_TYPE);
      fileview = true;
    } else if (this.settings.openOtherFiles) {
      //dont register again just return
      console.log("viewinggg");
      return;
    }
    if (!this.settings.openOtherFiles) {
      //this.app.workspace
      // .getLeavesOfType(VIEW_TYPE)
      // .forEach((leaf) => leaf.detach());

      //o way to unregister but can keep it like this fro now
      console.log("openOtherFiles false");
      console.log("Please click reset to save effects / ?");

      //this.app.workspace.detach(VIEW_TYPE);

      //this.app.workspace.detachLeavesOfType(VIEW_TYPE);
      //shell.openExternal(f.parent.path);
    }
  }

  */

  async test() {
    //const currentView = this.app.workspace.getActiveViewOfType(MarkdownView);
    //https://discord.com/channels/686053708261228577/1060148949878571089/1085786486856744990
    this.app.workspace.onLayoutReady(async () => {
      //now it doesnt render as it splits or duplicates problem is because markdown
      const activeLeaff = this.app.workspace.activeLeaf;
      const state = activeLeaff.getViewState();
      state.state.mode = "source";
      this.app.workspace.activeLeaf.setViewState(state);
      console.log(activeLeaff);

      /*
      const newLeaf = await this.app.workspace.duplicateLeaf(
        activeLeaff,
        "split",
        "vertical"
      );
      console.log(newLeaf);
      //automatically becomes activeleaf and also both source so user chooses what side ?
      //this.app.workspace.setActiveLeaf(newLeaf);
      //console.log("setting active\n");
      //console.log(this.app.workspace.activeLeaf); //old one will stay as old always call again or dynamically check
      //const state1 = this.app.workspace.activeLeaf.getViewState();
      //state1.state.mode = "source";
      state.state.mode = "source";
      this.app.workspace.activeLeaf.setViewState(state);
      */
    });
    /*activeLeaff.setViewState({
      type: "preview",
    });
    */
  }

  async test() {
    //const currentView = this.app.workspace.getActiveViewOfType(MarkdownView);
    //https://discord.com/channels/686053708261228577/1060148949878571089/1085786486856744990
    this.app.workspace.onLayoutReady(async () => {
      //now it doesnt render as it splits or duplicates problem is because markdown
      const activeLeaff = this.app.workspace.activeLeaf;
      const state = activeLeaff.getViewState();
      console.log(activeLeaff);
      //console.log("state" + state); //what object ?

      state.state.mode = "source";
      this.app.workspace.activeLeaf.setViewState(state);

      /*
      const newLeaf = await this.app.workspace.duplicateLeaf(
        activeLeaff,
        "split",
        "vertical"
      );
      console.log(newLeaf);
      //automatically becomes activeleaf and also both source so user chooses what side ?
      //this.app.workspace.setActiveLeaf(newLeaf);
      //console.log("setting active\n");
      //console.log(this.app.workspace.activeLeaf); //old one will stay as old always call again or dynamically check
      //const state1 = this.app.workspace.activeLeaf.getViewState();
      //state1.state.mode = "source";
      
      state.state.mode = "source";
      this.app.workspace.activeLeaf.setViewState(state);
      */
    });
  }

  async openFileView() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    console.log(leaves.length); //0 is start then goes 1,2,3 for each open leaf

    //comment this to unstack tabs as hotkey pressed
    //uncomment and use 0 instead of leaves.length in revealLeaf method
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);

    await this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE,
      active: true,
    });

    //await - bak belki kullanin ama nerde tam nasil kullanilir
    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
    );
    //n += 1; //ileri tracklar ama daha once acik olani gostermez,
    //cokta buyuk problem degil cunku user isterse 2 tane ayni page 1 tane
    //da farkli, acsin tek tek sonra manuel yerlerini degistirir
  }
};

class MyCustomView extends TextFileView {
  getViewData() {
    return this.data;
  }

  setViewData(data, clear) {
    this.data = data;

    this.contentEl.empty();

    //createEl and createDiv difference
    let header = this.contentEl.createEl("h4", { text: "FILE VIEW" });
    header.classList.add("header");

    const pre = this.contentEl.createEl("pre", { text: this.data });
    pre.classList.add(VIEW_TYPE); // add the class to the pre element

    pre.style.userSelect = "text";

    //this.contentEl.createDiv({ text: this.data });
  }

  clear() {
    this.data = "";
  }

  getViewType() {
    return VIEW_TYPE;
  }
}

//down below is view, settings, split, ...

class MyCustomView extends TextFileView {
  getViewData() {
    return this.data;
  }

  setViewData(data, clear) {
    this.data = data;
    this.contentEl.empty();

    //createEl and createDiv difference
    let header = this.contentEl.createEl("h4", { text: "FILE VIEW" });
    header.classList.add("header");

    const pre = this.contentEl.createEl("pre", { text: this.data });
    pre.classList.add(VIEW_TYPE); // add the class to the pre element
    pre.style.userSelect = "text";

    //this.contentEl.createDiv({ text: this.data });
  }

  clear() {
    this.data = "";
  }

  getViewType() {
    return VIEW_TYPE;
  }
}

//side view
class ExampleView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return "~ Link View ~";
  }

  //works now when we get a plugin reference(or object to view class(or extend ? whatever) this from plugin class to here)
  getSettings() {
    //always to that this reference object to Plugin refer to it as this.plugin.settings not this.settings
    console.log(this.plugin.settings.searchInCurrentFolder);
    // You can use this.plugin.settings.searchInCurrentFolder in your code
  }

  async onOpen() {
    //this.getSettings();

    const container = this.containerEl.children[1];
    container.empty();

    const header = document.createElement("div");
    header.setText("Files View");
    //header.setText("Files that ends with " + "");
    header.classList.add("header");
    container.appendChild(header);

    //it works now activeFile.parent.children gets all th ones in current folder
    const activeFile = this.app.workspace.getActiveFile();
    //console.log(activeFile); //the parent is
    //console.log(activeFile.parent);
    //console.log(activeFile.parent.parent); //will get more up depth wats the word here

    //if settings then true this below
    let pyFiles;

    if (this.plugin.settings.searchInCurrentFolder) {
      const files = this.app.vault.getAllLoadedFiles();
      pyFiles = files.filter((file) => file.path.endsWith(".py"));
    } else {
      pyFiles = activeFile.parent.children.filter((file) =>
        file.path.endsWith(".py")
      );
    }

    for (let i = 0; i < pyFiles.length; i++) {
      //console.log(file);
      const file = pyFiles[i];

      const parentPath = file.parent.path;
      //console.log("paths from vault:" + parentPath);

      const path = file.path;
      const content = await this.app.vault.read(file);

      const fileEl = document.createElement("div");
      fileEl.setAttr("class", "file");

      const fileContentEl = document.createElement("div");
      fileContentEl.classList.add("file-content");
      //fileContentEl.style.border = "2px solid green";

      const pathEl = document.createElement("h4");
      pathEl.setAttr("class", "path");
      //pathEl.setText(path);
      // /innerText or textContent
      pathEl.setText(path.split("/").pop()); // display only the file name

      const Fpath = document.createElement("p");
      Fpath.setAttr("class", "Fpath");
      //pathEl.setText(path);
      // /innerText or textContent
      Fpath.setText(
        "File path for this: " + "path:/" + parentPath.split("/").pop()
      );

      const contentEl = document.createElement("div");
      const suffix = path.split(".").pop(); // get the file extension
      const syntax = "```" + suffix + "\n" + content + "\n```";

      contentEl.style.fontSize = "0.8rem"; // set font size to 0.8rem
      contentEl.style.userSelect = "text"; // allow text selection

      await MarkdownRenderer.renderMarkdown(syntax, contentEl, path, this);

      const currentFile = this.app.vault.getAbstractFileByPath(file.path);
      const parentDir = currentFile.parent;
      //console.log(parentDir);
      //console.log(file.parent);
      //console.log(parentDir.children);
      //console.log(currentFile.parent.children);
      //console.log(currentFile.parent.name);
      //console.log(file.parent.children[0].parent.name);

      const folderNames = currentFile.parent.name;
      // .filter((absFile) => absFile instanceof TFolder)
      // .map((folder) => "" + folder.name);

      //get only the py files in that particular folder from vault is selected
      //but still we can iterate through all files

      const fileNames = parentDir.children
        .filter((absFile) => absFile instanceof TFile)
        .map((file) => "" + file.name);

      console.log("");
      console.log("Folder names: " + folderNames + "\n");
      console.log("File names: " + fileNames);

      const buttonEl = document.createElement("button");
      buttonEl.setAttr("class", "open-reading-view");
      buttonEl.setText("Open in VS Code"); //Default Application");

      /*
      buttonEl.onclick = async () => {
        const leaf = this.app.workspace.getLeaf();
        const readingView =
          leaf.getViewState()["type"] === "markdown-preview"
            ? leaf.getViewState()["state"]
            : "source";
        let view = await this.app.workspace.openLinkText(path, "", readingView);
        view.editor.setValue(content);
      };
      */

      buttonEl.onclick = async () => {
        //LOOK AT HERE !
        //TODO:
        //it will open it in vs code but wont set directory of vs code maybe try js vscode open
        //also if you make changes to the code it will change in obsidian since its the file in obsidian
        await this.app.workspace.openLinkText(path, "");
      };

      const spacerEl = document.createElement("hr");
      spacerEl.style.borderColor = "green";
      container.appendChild(spacerEl);

      //fileEl.appendChild(pathEl);

      //fileEl.appendChild(contentEl);

      //container.appendChild(fileEl);

      fileContentEl.appendChild(pathEl);

      fileContentEl.appendChild(Fpath);

      fileContentEl.appendChild(contentEl);

      fileEl.appendChild(fileContentEl);
      fileEl.appendChild(buttonEl);

      container.appendChild(fileEl);
      container.createEl("br"); //it works
    }
  }

  async onClose() {
    // Nothing to clean up.
  }
}

//settings

const desc = document.createDocumentFragment();
desc.appendChild(
  document.createTextNode("Renders anything in [internal links] that is a URL")
);
desc.appendChild(document.createElement("br"));
desc.appendChild(
  document.createTextNode("(Toggle off for opening in default app)")
);

const desc2 = document.createDocumentFragment();
desc2.appendChild(
  document.createTextNode("Open ...extensions in obsidian file/item view")
);
desc2.appendChild(document.createElement("br"));
desc2.appendChild(
  document.createTextNode(
    "(Toggle the button here/under to only open in current folder)"
  )
);

//store the setting class in a const variable
const test = new Setting(container)
  .setName("Render links")
  /*
      .setDesc(
        `Renders anything in [internal links] that its not url \n toggle off for opening in default app`
      )
      */
  //takes DocumentFragment as param
  .setDesc(desc)

  //https://marcus.se.net/obsidian-plugin-docs/reference/typescript/classes/ToggleComponent
  .addToggle((toggle) => {
    toggle
      .setValue(this.plugin.settings.acceptLinks)
      .onChange(async (value) => {
        this.plugin.settings.acceptLinks = value;
        await this.plugin.saveSettings();
        console.log(`Toggle value changed to ${value}`);
      });
  });

new Setting(container)
  .setName("Hi I am setting")
  .setDesc("This should be a descritpiton loremm ipsum bvla /...")
  .addText((text) =>
    text
      .setPlaceholder("MMMM dd, yyyy")
      .setValue(this.plugin.settings.dateFormat)
      .onChange(async (value) => {
        //on change how to use
        this.plugin.settings.dateFormat = value;
        await this.plugin.saveSettings();
      })
  );
console.log("hi"); //prints everytime user goes on settings tab (saves and loads data)

//https://marcus.se.net/obsidian-plugin-docs/reference/typescript/classes/Setting ***
//uses properties(check link for this) to add custom classes to each element of setting class
//test.nameEl.addClass("my-setting-name");

new Setting(container)
  .setName("render local files")
  .setDesc("Renders anything in [internal links] that is not a URL")
  .addToggle((toggle) => {
    toggle
      .setValue(this.plugin.settings.acceptOtherFiles)
      .onChange(async (value) => {
        this.plugin.settings.acceptOtherFiles = value;
        await this.plugin.saveSettings();
        console.log(`Toggle value changed to ${value}`);
      });
  });

//works
container.createEl("br");
container.createEl("h2", { text: "Saved Snippets" });

container.createEl("div", {
  text: "After changing these settings below, please click reset",
  cls: "setting-item-descriptionn",
});

new Setting(container)
  .setName("Open local files")
  .setDesc(desc2)
  .addToggle((toggle) => {
    toggle
      .setValue(this.plugin.settings.openOtherFiles)
      .onChange(async (value) => {
        this.plugin.settings.openOtherFiles = value;
        await this.plugin.saveSettings();
        console.log(`Toggle value changed to ${value}`);
      });
  })
  .addToggle((toggle) => {
    toggle
      .setValue(this.plugin.settings.searchInCurrentFolder)
      .onChange(async (value) => {
        this.plugin.settings.searchInCurrentFolder = value;
        await this.plugin.saveSettings();
        console.log(`searchInCurrentFolder changed to ${value}`);
      });
  });
//.setDisabled(true);

//add button
new Setting(container)
  .setName("RESET ...")
  .setDesc("Make sure reset save obsidian restart ...")
  //.setTooltip("s") //hover tip
  //.setHeading(this); gives bold to name

  //https://marcus.se.net/obsidian-plugin-docs/reference/typescript/classes/ButtonComponent
  //extends
  //https://marcus.se.net/obsidian-plugin-docs/reference/typescript/classes/BaseComponent
  .addButton((b) => {
    b.setButtonText("Click me!") //icons can be used here ? SVG ?
      .onClick(() => {
        console.log("Button clicked!");
        new Notice("Reseting plugin " + this.plugin.manifest.name);
        // Reload the plugin
        this.plugin.ResetPlugin();
        /*
          this.plugin refers to the instance of the plugin class, which is passed to the constructor of MySettingsTab as an argument. 
          By calling this.plugin.resetPlugin() from within the MySettingsTab class, we can invoke the resetPlugin() method of the main
          plugin class, which reloads the plugin.
          Since resetPlugin() is defined in the main plugin class and not in MySettingsTab, we need to access the instance of the main 
          plugin class to call the method. By passing the plugin instance to the MySettingsTab constructor, we can then access it using 
          this.plugin within the settings tab class.
          */
      })

      //this.plugin.settings
      //await this.plugin.saveSettings();

      //.setDisabled(true); disables the onclick

      .setWarning(); //works here makes it red
    //.setCta(); //makes it purple but why
  });

//console.log("settings tab loaded"); //prints everytime user goes on settings tab (saves and loads data)
