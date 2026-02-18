import { MarkdownView } from "obsidian";

//https://chatgpt.com/c/f7ae61df-7549-4eb9-b217-1f1c0f8cc0d4
export async function initStatusbar(this: any) {
    // private item: HTMLElement;

    //Register Status Bar Items
    this.item = this.addStatusBarItem();
    await this.registerInterval(
    window.setInterval(() => updateStatusBar.call(this), 250)
    );
    const item = this.addStatusBarItem();
    item.createEl("span", { text: "Hello World 🌍" });

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText('Status Bar Text');


}

export async function updateStatusBar(this: any) {
    // Make sure the user is editing a Markdown file.
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
    const editor = view.editor;
    const lastLine = editor.lastLine() + 1; //add +1 always cause it starts to count from 0
    // console.log(lastLine);
    this.item.setText(/*"span", { text: */ `Last line: ${lastLine}` /*}*/);
    }



    //TODO: implement what line cusror is on -->(returns) int

}