/* ==========================================================================
  Plugin Name: OBSIDIAN TOOLS PLUGIN
  Description: 
  Author: MERT ARKIN
  Date: range: xx/xx/xxxx - xx/xx/xxxx

  This is the tools plugin, it implments the;
  - a
  - a
  - a

  // {

// 	"id": "Tools Plguin",
// 	"name": "0Tools Plguin",
// 	"version": "0.3.3",
// 	"minAppVersion": "0.2.5",
// 	"description": "Custom Plugin",
// 	"author": "Mert Arkin",
// 	"authorUrl": "https://github.com/MertArkin",
// 	"isDesktopOnly": false,
	
// 	"fundingUrl": "https://buymeacoffee.com"

// }

========================================================================== */
/* IMPORTS */

//Obsidian API
import { App, Editor, MarkdownView, Modal, Notice, MenuItem, TFolder, TFile, WorkspaceLeaf, EventRef, Plugin, PluginSettingTab, Setting } from 'obsidian';

//Settings
import { ExampleSettingTab } from "./src/settings/settings";

//Modals
import { SampleModal } from "./src/modals/modal";
import moment from 'moment';

//File Watchers (move folders/files)
import { startWatching, moveFileToVault, moveAllToVault } from './src/move folder file/move files-folders';

// import * as path from 'path';
// import * as fs from 'fs';

//Chrome Local Bookmarks
import { GetBookmarksFile, BookmarksView } from './src/views/bookmarks/bookmarks';

//MarkdownCodeBlockProcessors
import { initProcessor } from './src/postprocessors/postprocessors';
import { initCommands } from './src/commands/commands';
import { initEvents } from './src/events/events';
import { initStatusbar } from './src/statusbar/statusbar';
import { initRibbons } from './src/ribbons/ribbons';
import { initVaultStats } from './src/metadata/vaultstats';
import { initWorkspaces } from './src/workspaces/workspaces';

//Constants
import { VIEW_TYPE } from './src/constants/constants';

//Plugin Settings interface
interface MyPluginSettings {
	dateFormat: string;
	DataVault: string;
	externalFolderPath: string;
	vaultPath: string;
	filePath: string;
}
//Default Settings
const DEFAULT_SETTINGS: Partial<MyPluginSettings> = {
	dateFormat: "YYYY-MM-DD",
	DataVault: "",
	externalFolderPath: "",
	vaultPath: "",
	filePath: ""
}
//https://docs.obsidian.md/Reference/TypeScript+API/Plugin
export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	private fileMenuHandler: EventRef | any
	private fileMenuHandler2: EventRef | any;

	async onload() {
		// Log the plugin name and version when it's loaded
		// console.log(`Plugin Name: ${this.manifest.name} | Version: ${this.manifest.version}`);
		//Load Settings
		await this.loadSettings();
		// console.log(this.app.plugins)

		//On Layout Ready...
		this.app.workspace.onLayoutReady(async () => {
			this.addSettingTab(new ExampleSettingTab(this.app, this));
			// console.log("active editor:", this.app.workspace.activeLeaf);
			// console.log("active editor:", this.app.workspace.getActiveViewOfType(MarkdownView));

			// This adds a settings tab so the user can configure various aspects of the plugin
			//other vault paths
			this.settings.DataVault =
			"C:/Users/Mert Arkin/iCloudDrive/iCloud~md~obsidian/DataVault";
			
			// this.settings.DataVault ="C:/Users/Mert Arkin/Desktop/Main PC/03VAULTS/DataVault"
			
			// Your folder to watch
			// this.settings.externalFolderPath = "C:/Users/Mert Arkin/Desktop/Main PC/test";
			this.settings.externalFolderPath = "C:/Users/Mert Arkin/Desktop/Main PC";
			// Log the paths to verify
			// console.log('DataVault:', this.settings.DataVault);
			// console.log('External Folder Path:', this.settings.externalFolderPath);
			// console.log('Vault Path:', this.settings.vaultPath);
			// console.log(`\n'DataVault:' ${this.settings.DataVault}\n\n'External Folder Path:' ${this.settings.externalFolderPath}\n\n'Vault Path:' ${this.settings.vaultPath}`);

			// Register Extensions/.ts files so we can edit .bat/batch files/code/programs quickly in our editor
			// this.registerExtensions(["py, bat, docx"], "markdown"); //shows encrypted (what does microsoft use default to encrypt)
			await initStatusbar.call(this);
			await initCommands.call(this);
			await initEvents.call(this);
			await initRibbons.call(this);
			await initVaultStats.call(this);
			await initWorkspaces.call(this);

			this.registerView(VIEW_TYPE, (leaf) => new BookmarksView(leaf)); //Register view when plugin onloads
			this.registerMarkdownCodeBlockProcessor("t", (source, el, ctx) => {
				console.log("registering processor");
				initProcessor(source, el, ctx);
			});
			this.registerObsidianProtocolHandler("mert", (data) => {
				console.log("data:", data)

			});
		});
	}
	
	async onunload() {
    // console.log(`${this.manifest.name} Plugin Unloaded.`);
    // Remove the event handler
    this.app.workspace.off("file-menu", this.fileMenuHandler);
    this.app.workspace.off("file-menu", this.fileMenuHandler2);
	// Clean up when the plugin is unloaded, No explicit cleanup for view plugin is necessary as it will be automatically destroyed
	// const leaf = this.app.workspace.getLeaf();
    // this.app.workspace.detachLeavesOfType(leaf.getViewState().type);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
	}

	//Load Settings
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	  }

	//Save Settings 
	async saveSettings() {
		await this.saveData(this.settings);
	}

}

/*
COMMENTS:

change package.json file 	// "name": "obsidian-sample-plugin",
you open a new terminal in your repo/(per) plugin folder
then you type npm run build to save/update changes and then
when you enable the plugin in obsidian you can see the new changes working

https://chatgpt.com/c/69111294-7794-832c-b84f-9739836a8585


*/





