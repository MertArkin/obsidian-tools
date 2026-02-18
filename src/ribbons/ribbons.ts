import { MarkdownView, Notice } from "obsidian";

import * as fs from 'fs';


export async function initRibbons(this: any) {

		// const resetRibbonIcon = 
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', async () => {
            console.log(this)
            console.log(this.app)
            // const pluginManager = (this.app as any).plugins; // TypeScript cast to access plugins
            const pluginManager = this.app.plugins; // TypeScript cast to access plugins
            console.log("enabled plugins " +  Array.from(pluginManager.enabledPlugins))
    
                // Disable the plugin
                await this.app.plugins.disablePlugin(this.manifest.id);
                // Enable the plugin
                await this.app.plugins.enablePlugin(this.manifest.id);
        
                // Show a notice that the plugin is being reset
                new Notice(`resetting plugin - ${this.manifest.name}`);
    
                //https://developer.mozilla.org/en-US/docs/Web/API/console/clear_static
                console.clear()
            });
            // Perform additional things with the ribbon
            ribbonIconEl.addClass('my-plugin-ribbon-class');
    
    
            this.addRibbonIcon("star", "RUN", async () => {
                const activeFile = this.app.workspace.getActiveFile();
                // console.log(activeFile);
          
                const leaf = this.app.workspace.getLeaf();
                // console.log(leaf);
          
                const activeLeaf = this.app.workspace.activeLeaf;
                // console.log(activeLeaf);
          
                const leavesOfType = this.app.workspace.getLeavesOfType(
                  leaf.getViewState().type
                );
                if (leavesOfType.length < 2) {
                  const dupLeaf = await this.app.workspace.duplicateLeaf(
                    leaf,
                    "split",
                    "vertical"
                  );
                  // console.log(dupLeaf);
                  // await this.app.workspace.setActiveLeaf(dupLeaf, { focus: false });
          
                  const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                  console.log(view);
                  //TODO: do this only if view exists
                  if (view) {
                    const viewState = view.getState();
                    console.log(viewState);
                    // view.setState({ mode: "preview", source: false }, view);
                  }
                } else {
                  console.log(this.app.workspace.activeLeaf);
          
                  const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                  console.log(view);
                  //TODO: do this only if view exists
                  if (view) {
                    const viewState = view.getState();
                    console.log(viewState);
                    // view.setState({ mode: "preview", source: false }, view);
                  }
                  // Set the view state of the active leaf to "source"
                  // await leaf.setViewState({ type: "markdown" }); //, active: true });
                  // this.app.workspace.activeLeaf.setViewState({ type: "source" }); //wrong
                  this.app.workspace.rightSplit.collapse();
          
                  // const leavesOfType = this.app.workspace.getLeavesOfType(
                  //   leaf.getViewState().type
                  // );
                  console.log(leavesOfType);
                  console.log(leavesOfType.length);
                  // legnth is 2 array starts from 0, 1, ...
                  // if (leavesOfType.length > 2) {
                  // return;
                  // this.app.workspace.detachLeavesOfType(leaf.getViewState().type);
                  //TODO: for simpplicity we do it like detaching ne dup leaf (since we know its just a reading mode version of the one we have open already duplicated)
                  // fix 1: get current file split then open file instead of using built in duplciate funcitons (complexity for better future neccessities like extending expansion fine tuning etc) | choose obsidian performance stuff that is huilt in already
                  // fix 2: if 1 is open then dont open anymore, (can add background checks to see if both panels are source & preview version of each other)
                  // fix 3: TODO
                  // dupLeaf.detach();
                  // this.app.workspace.detachLeavesOfType(leaf.getViewState().type);
                  // }
                }
            });


            
            //Should this move all the contents inside the external folder path that is defined
        
            /*
            So basically our functionality of moving files and folders works both way using
            context menu we can send files or folders to another world or external location
            but then also by using ribbon icon we can map an external location to always pull
            files/folders from there into our Obsidian vault
            */
            this.addRibbonIcon(
                "document",
                `move from '${this.externalFolderPath}'`,
                () => {
                    if (fs.existsSync(this.externalFolderPath)) {
                    new Notice(`moving from '${this.externalFolderPath}`);
                    //Check if layout is ready before putting ribbon icons not after inside the nest
                    // this.app.workspace.onLayoutReady(() => {
                    // this.startWatching();
                    // moveFileToVault(this.externalFolderPath, this.vaultPath);
                    // this.moveAllToVault(this.externalFolderPath, this.vaultPath);
                    // });
                    } else {
                    new Notice(`${this.externalFolderPath} doesn't exist!`);
                    // console.log(`${this.externalFolderPath} doesn't exist!`);
                    }
                }
                );
    
}