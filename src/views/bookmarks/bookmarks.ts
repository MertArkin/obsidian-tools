
import {Plugin, ItemView, WorkspaceLeaf} from "obsidian";
import * as fs from "fs";
import * as path from "path";

/*

//class {}

/*
search happens in 2 ways
results found in (current folder)
results found in (other folders)

normal bookmarks at chrome://bookmarks is sorted by oldest (default)
normal bookmarks at side panel is sorted by newest (default)


Here's how you can write the JavaScript code for let { workspace } = this.app;:
javascript
const { workspace } = this.app;
This code destructures the workspace property from the app object, making workspace available as a variable in your code.

Yes, you can use this.app.workspace directly to access the workspace property of the app object in Obsidian.
There's no need to destructure it if you prefer to access it using this.app.workspace.

Here's how you can use it:
javascript
const workspace = this.app.workspace;
Both approaches, either using destructuring or accessing this.app.workspace directly, are functionally equivalent.
You can choose the one that you find more readable or preferable for your coding style.

a parent and children param recursive funciton, every run assign the parent back to item, to achieve nested printing?
c p --> p(c) - c p --> p(c) p(c) c p --> p(c) p(c) p(c) c p --> ...
every turn the previous parent content pair becomes a (root)parent, etc...

a

NEXT:

is to organize codevault information and decide what is going to be hosted on git and also be stored in codevault

after nice sort above 5/10 then decideif needed ove things to obsidian

obsidian finalize layout of things
codevault <--> obsidian finalize
...

how to sort them very custom
custom json sorter based on title and url
vs
custom json sorter based on title and url's content (more to scraping)

also new .js/obsidian plugin file for displaying bookmarks in a better view/leaf/pop-out window etc
first import them recursively then do this above ^

*/



/*


DISPLAY PILE OF LINKS IN OBSIDIAN PLUGIN
TODO:

# first sort then display in obsidian plugin
# 1. sort by folder choices parent child
# 2. sort links inside ?
# 3. sort folders if needed create or delete more
# 4. add AI ? to help for sort
# 5. perfect the sort for this .py file

# there will be this program where bookmakrs
# will be sorted mnaual and controlled environment

# the other program will parse all in a readable way to a file
# for the ai to do the sorting and foldering (hard !)

# how to do foldering both nice to obsidian and fix dt dl a h3 for old bookmarks file
# how to do this above ^ -

# IT GOES BY RELAZIE HOW YOUR/MY PROGRAM REACTS, OR HOW THE IMPORTED LIBRARY
# THEN FIX THAT AND BE ON THE SAME ~ FREQUENCY~ WITH THE PROGRAM (SPPED OF LIGHT ANALOGY)
# AND GO MINIMAL STEP BY STEP TO SOLVE IT !

# HOW PERFECT DO I WANT TO HAVE BOOKMARKS PARSED ?
# EASILITY REVERSIBLE REPLACABLE WAY

# OKAY BIG UPDATE
# 16/10/2023
# SO THERE ARE DIFFERENT LAYERS OF EXPORTING THE BOOKMARKS +
# BEING ABLE TO ACCESS IT.





*/



const VIEW_TYPE = "bookmarks-view"


export async function openBookmarksView(this:any) {
  //https://www.geeksforgeeks.org/how-to-fix-object-is-possibly-null-in-typescript/
  //https://docs.obsidian.md/Plugins/User+interface/Views
  //https://chatgpt.com/c/2d6733f0-14f9-4e31-a077-1b17ff21628c

  let leafToReveal: WorkspaceLeaf | null = null;
  // this.app.workspace.detachLeavesOfType(this.VIEW_TYPE);
  const leavesOfType = this.app.workspace.getLeavesOfType(VIEW_TYPE);
  console.log(leavesOfType.length)
  
  if (leavesOfType.length > 0) {
    leafToReveal = leavesOfType[0];
    // console.log("already exists defaulting/using the first one")
  } else {
     //when getRightLeaf true bottom of right ribbon spawn when false  top of right ribbon spawn
    // leafToReveal = this.app.workspace.getRightLeaf(false);
    // await leafToReveal!.setViewState({ type: VIEW_TYPE, active: true });
    // console.log("no view its created one, revealing...")
    leafToReveal = this.app.workspace.getLeaf("split", "vertical");
    leafToReveal!.setViewState({ type: VIEW_TYPE, active: true });
    // this.app.workspace.revealLeaf(leafToReveal!);
  }
  this.app.workspace.revealLeaf(leafToReveal!);
}


// Define interfaces to represent the structure of the JSON data
interface BookmarkNode {
    name?: string;
    type?: string;
    children?: BookmarkNode[];
    url?: string;
}
interface BookmarksData {
    roots: {
        bookmark_bar: BookmarkNode;
        other: BookmarkNode;
        // Add other root nodes if present
    };
}
class GetBookmarksFile {
    /*
    #####
    Please adjust the interfaces and the necessary data types later'cause they're wrong
    12/08/2024
    #####
    */
    private data: BookmarksData;
    private bookmarkBar: BookmarkNode;
    private bookmarkFolderContents: BookmarkNode[];
    private other: BookmarkNode;
    private otherFolderContents: BookmarkNode[];
    
    constructor() {
        const filePath = "C:/Users/Mert Arkin/AppData/Local/Google/Chrome/User Data/Default/Bookmarks";
        try {
            const fileData = fs.readFileSync(filePath, "utf8");
            this.data = JSON.parse(fileData);
            
            this.bookmarkBar = this.data.roots.bookmark_bar;
            this.bookmarkFolderContents = this.bookmarkBar.children || [];
            
            this.other = this.data.roots.other;
            this.otherFolderContents = this.other.children || [];

            // Uncomment these lines for debugging
            // console.log(this.data);
            // console.log(this.bookmarkBar);
            // console.log(this.bookmarkFolderContents);
            // console.log(this.other);
            // console.log(this.otherFolderContents);

        } catch (error) {
            console.error("Error reading or parsing bookmarks file:", error);
        }
    }
  }
  
  const VIEW_TYPE_EXAMPLE = "bookmarks-view";
  
  // bookmarks_to_obsidian
  //FILE NAME = bookmarks_to_obsidian .js
  
  //View class
  // ItemView, you can render HTMLElements etc., FileView is create, open, recent, close etc.
  // dont use ItemView to display files/notes/pdf's etc instead use FileView
  // only use ItemView for rendering custom panel's for such(your) purposes
  // https://docs.obsidian.md/Reference/TypeScript+API/ItemView

  /*

  HOW WE WANT TO RENDER BOOKMARKS

  ## THE STRUCTURE
  folder immersion view
  so there should be a div element that should have a back button as well as the current folder's name. below that it should display all the top/root for the hierarchy if a folder clicked the other folders on the same level disappear the clicked folder opens with its contents inside and its name comes next to the back button this is the functionality I want

  can you create this in obsidian plugin use my template and the code given above
  no use the program above but just adapt the functions inside the program

  - sort with ai
  - display better
  - finish the folder immersion view
    (find examples from somehwerres)
  - connect bookmarks to create folder function

  STRUCTURE
  - bookmark-root
    - folder
    - folder
      - folder name
      -
    - folder
  ^ etc.

  attempted versions
  - folder
    - item-name ~ folder name
    - folder contents
      - folder
        - item-name ~ folder name
        - link has `<a>`
      - folder
        - item-name ~ folder name
          - folder contents
            - folder
              - item-name ~ folder name
              - link has `<a>`
  - folder
    - item-name ~ folder name
    - folder contents
      - folder
        - item-name ~ folder name
        - link has `<a>`
  give space betweeen each folder not subfolder though !



[just to add](just%20to%20add.md)
is my main folder structure gonna be like a dropdown?
or
is my main folder structure gonna be like enter a folder then the parent folder dissapears, to give the full effect of user being in that folder.
(is called 'folder immersion' by chatgpt)

choice is folder immersion
so the search has to search with/within the folders on display(active panel)
Try folder immersion then can change to dropdown, or both functionality?


create 2 divs on top of each other when necessary hide and make visible ?
there is panel, which has:
- back button
- folder (name) info
- etc
there is bookmarks, which has:

- all the folders(nested too)
- links

> when main folder is clicked, its name is gone to panel as folder (name) info
> back button becomes visible
> all the other bookmarks is hidden to give user folder immersion view - feeling
> the clicked folder contents is passed to panel to display
^ nice way of creating view over view sort of look - 0 1, 1 0, visible hidden, hidden visible


generalize and interface this python file
obsidian plugin UI yap 18/10/2023 now
after you make obsidian display a tree like structure like the one in chrome then you can copy other parts and finally display them

^ - (connect it with the parser program,) you have to write it in js
will only work on windows and mac not tel, (not worth to sync, air/over-transfer bookmarks)
parser + obsidian ui = chrome bookmarks in obsidian
after adding a bookmark from chrome, click the refresh icon in obsidian plugin to update the plugin/bookmarks

back button top left
 folders by level structure
 if folder clicked, continue the pattern structure above
 if a folder has subfolders and url's, display both under each other as normal
 (sort by: newest, oldest, last opened, A to Z, Z to A)
 
 compact view, visual view, bigger/smaller folders (I prefer smalls w spaces and when clicked previews)
	 edit, if clicked, bin, move, open all, rename,
	 numbers of how many urls in each folder (if it has a subfolder, dont count)
	 search bookmarks at above (this search does the searches to the folder and subfolders within that folder that the user currently in)

 normal search bookmarks at chrome://bookmarks will do the search in the whole pile but it would also give you the option to open its location - ^ - (show in folder)
 can have this ^ in plugin to highlight the folder or the url for couple of seconds, etc.
 
 reading list, history, is not synced, maybe future versions,
 what if - also try - get browser on obsidian, login on chrome, see if bookmarks sync and has or is better UI than my idea/project?
 
 if user chooses to have the same structure in chrome, then the program will give user options to
 if the user chooses to have a different structure then the program will give user options to

 first the folders then the parents one contents !!
 but maybe change bookmarks folder layout, do like 2 most nested
 cant go further than 3 the bookmarks (probably chrome makes it 3 at most) after
 `06/02/2024`


some of them need to have card/x design to show items/toys/clothing
some of them need to have card/x design to show info + myb upgraded search to update real-time give you answers - coding ~
^ all of these above can be custom written in a plugin - (worth + not too hard) + self-made/diy so more fine-tuned to my own needs, such as, in this case, indiviudal files for sorting stuff in my life,,, with their own way of dealing with the data in them. myb use prepostprocssor|create iframes dynamically|etc.

if i can get them show /render, it will be enoguh for me to not keep them on chrome bookmarks anymore(???-obsidian network breaks? -tel-macbook-pc) and also enough for the markdown file to have it. + the next thing i may do with this link is either use/store/dlete/??? - if its ever needed it can be organised to eternity in obsidian since its(the link) is already in the editor its a win-win.

for more lightweight chrome bookmarks on axtual chrome, i need a way to replciate obsidian to do most of my work, steps start from:
- bookmarks sorted/folderşzed on chromeby type
- obsidian has files for each type of bookmark
- each file in obsidian treats its bookmark~type in a specific way its designed to
  (resulst) =


Just sort and develop them as pluign in obsidian
Then build a project mode to open codevault with bookmarks from obsidian and have avlittle icon to switch betwen


- can try obsidian plugin then windows side by side
- can try plugin/extension for both of them

*/

  class BookmarksView extends ItemView {
    private bookmarksFile: any
    constructor(leaf: WorkspaceLeaf) {
      super(leaf);
      // Example usage
      this.bookmarksFile = new GetBookmarksFile();// Assuming you have a class like GetBookmarksFile
    }
  
    getViewType() {
      return VIEW_TYPE_EXAMPLE;
    }

    getDisplayText() {
      return "This is " + VIEW_TYPE_EXAMPLE;
    }
    async onOpen() {
      //DRAW WHAT IS NEEDED - ? (copy the structure from chrome ??)
      //do your own nested divs structure for building
      //try to use the methods that come with obsidian API, use/make default js second option
      //its the layer outside the panel
      // const con = this.containerEl;
      // con.createEl("h1", { text: "This is the BookmarksViewwwwww" });
      // console.log(con);
  
      const container = this.containerEl.children[1];
      // [0] is the html element of the icon on side bar and its value/text
      // [1] is the html element of the rest, which is the panel being instantiated
      // <div class="view-content"><h2>Bookmarks</h2></div>
      container.empty();
      container.createEl("h2", { text: "Bookmarks" });
  
      //draw a line between them 2 headers
      //container.createEl("h2", { text: "Bookmarks" });
      //container.createEl("h5", { text: "Search Bar" });
  
      //the Constructors, Properties and Methods parts from obsidin docs, use them in
      //the class that you are creating which extends the (parent) class,
      //used to retrieve the active view of a specified type within the workspace
      //type: This is a parameter of type Constructor<T>. It specifies the type of view you want to retrieve.
      //You would provide the constructor function for the view type you are interested in. (like what type of view, markdownview, itemview, fileview)
      //Returns: The method returns either an instance of the specified view type (T) if it is active, or null if no such view is currently active.
      //https://docs.obsidian.md/Reference/TypeScript+API/workspace/getActiveViewOfType
  
      this.app.workspace.onLayoutReady(() => {
        // Your code to be executed when the layout is ready
        console.log("Layout is ready!");
        //check for active view with the type ... if it doesn't match it goes to else block
        const activeItem = this.app.workspace.getActiveViewOfType(ItemView);
        //returns and prints the view, (etc...)
        console.log(activeItem);
  
        if (activeItem) {
          //container.createEl("hr");
          /*
            const actionElementDice = activeItem.addAction("dice", "dice", () => {
              console.log("Custom action clicked!");
            });
            const actionElementStar = activeItem.addAction("star", "star", () => {
              console.log("Star action clicked!");
            });
    
            //define the cls parameter for the html element to be assigned to
            const mainDiv = container.createEl("div", {
              cls: "icon-text-container",
            });
    
            const divDice = mainDiv.createEl("div", {
              text: "dice: ",
              cls: "pair-container",
            });
            divDice.appendChild(actionElementDice);
    
            const divStar = mainDiv.createEl("div", {
              text: "star: ",
              cls: "pair-container",
            });
            divStar.appendChild(actionElementStar);
          } else {
            console.log("No active ItemView found.");
          }
          */
          //const bookmarks = new GetBookmarksFile();
  
          //change this to createEl
          const root = container.createDiv("bookmark-root");
  
          //this.createTree(this.bookmarksFile.bookmark_folder_contents, root);
          //this.createTree(this.bookmarksFile.other_folder_contents, root);
  
          this.createFolderView(
            this.bookmarksFile.bookmarkFolderContents,
            root,
            0
          );
        }
        //container.createEl("hr");
      });
  
      //container.createEl("p", { text: actionElement });
  
      //contentEl is the panel that is being instantiated by/when this class is instantianted
      //has sub div elements like normal HTML
      //https://docs.obsidian.md/Reference/TypeScript+API/Workspace
      //lives within - means that this code runs when this class is created etc. - BookmarksView that extends ItemView so it will print the HMTLElement for that
  
      //const contentElement = activeItem.contentEl;
      //console.log(contentElement);
  
      // const test = this.containerEl.children[0];
      // console.log(test);
      // console.log(container);
  
      //logging the function definition itself, not the result of calling the function.
      //To see the result of the function, you should call it by adding parentheses, like this:
      //The output will then display the value returned by the getViewType function, which is VIEW_TYPE_EXAMPLE.
      //console.log(this.getViewType());
      //console.log(this.getDisplayText());
  
      //change icon on the side panel
      //this.icon = "dice";
    }
  
    //works fully, just needs to be adjusted for obsidian view
    //it kinda bugs obsidian since there is too many, that is why I am going to try to make folder/folder names collapsable
    //how to fix laggy, effiency, memory <- ?
    //(goes laggy if obsidian is kept open for too long), maybe dont keep file open always or ???
    //how to fix better viewing/displaying
    //
  
    //https://docs.obsidian.md/Plugins/User+interface/HTML+elements
    //(togle classes based on clicks ^)
  
    //TODO: draw border around every title-url pair for better visibility & make thme support opening in surfing pluhgin ! - 28/07/2024
    createFolderView(folderContents: any[], parent: HTMLElement, depth: number): void {
        // console.log("folderContents:", folderContents);

        for (const item of folderContents) {
        if (item.type === "folder") {
          const folderElement = parent.createEl("div", { cls: "folder" });
          const folderName = folderElement.createEl("div", {
            cls: "item-name",
            text: item.name,
          });
  
          const folderContents = folderElement.createEl("div", {
            cls: "folder-contents",
          });
          folderContents.style.display = "none"; // Initially hide folder contents
  
          folderName.style.marginLeft = `${depth * 10}px`;
          folderName.style.fontWeight = "bold";
          folderName.style.fontSize = "16px";
  
          folderName.addEventListener("click", () => {
            this.toggleFolderContents(folderContents);
          });
  
          //check this what is this part - 28/07/2024
          if (depth === 0) {
            const folderElement = parent.createEl("div", {
              cls: "space",
            });
            // ...
          } else {
          }
  
          this.createFolderView(item.children, folderContents, depth + 1);
        } else {
          const linkElement = parent.createEl("div", { cls: "link" });
          linkElement.createEl("div", { text: item.name, cls: "url-name" });
          linkElement.createEl("a", {
            href: item.url,
            text: item.url,
            cls: "url",
          });
          linkElement.style.marginLeft = `${depth * 10}px`;
          linkElement.style.fontSize = "16px";
        }
        parent.createEl("p", { text: "" });
        // parent.createEl("hr");
        // parent.createEl("br");
      }
    }
  
    toggleFolderContents(folderContents: HTMLElement): void {
    // const folderContents = folderElement.find(".folder, .url");
    // folderContents.toggle("none");
    const display = folderContents.style.display;
    folderContents.style.display = display === "none" ? "block" : "none"; // Toggle visibility
    }
  
    //can start depth from 0 too
    //bu depth sayimi isine yarar bookmarks levellerinde/nestinginde search yapacaksan
    //folderleri, subfolderlei, sirayla url'leri falana kep depth yani count olarak sayabilin
    //ama sayim level based olur yani 3. level deki mesela url'lerin hepsi url${3} gibi olur
    //bunu daha sonra dinamiklestirebilirmiyim?
    createTree(bookmarkFolderContents: any[], parent: HTMLElement, depth: number = 1): void {
        //console.log("creating tree");
      let i = 1;
      let x = 1;
      for (const item of bookmarkFolderContents) {
        if (item.type === "folder") {
          const folder = parent.createEl("div", {
            //This is so good, dynamically the program renames all
            cls: `bookmark-folder${depth}`,
            text: `${x} - ${item.name}`,
          });
          this.createTree(item.children, folder, depth + 1);
          x++;
        } else {
          // Assuming that item represents a link or URL
          const linkItem = parent.createEl("div", {
            cls: "bookmark-link",
            text: "",
          });

          // Assuming that item has a name
          const name = item.name;
          const nameLabel = linkItem.createEl("div", {
            cls: "bookmark-name",
            text: "",
          });
          nameLabel.setText(`${i} - ${name}`);
  
          // Logic for displaying URL
          const url = item.url;
          const urlLabel = linkItem.createEl("a", { href: url, text: url });
          i++;
        }
      }
    }
  
    async onClose() {
      // Nothing to clean up.
    }

  }

  export { GetBookmarksFile, BookmarksView };
  
