import { Notice, TFolder, MenuItem, TFile } from "obsidian";
import { SampleModal } from "../modals/modal";
import * as path from "path";
import { moveFileToVault, startWatching } from "../move folder file/move files-folders";

export async function initEvents(this: any) {
		//Register Events
		this.registerEvent(
			this.app.workspace.on("file-open", () => {
			  new Notice("new file opened");
			})
		  );

		// https://docs.obsidian.md/Reference/TypeScript+API/Vault
		// https://docs.obsidian.md/Reference/TypeScript+API/DataAdapter
		this.registerEvent(
		// Store the reference to the event handler
		(this.fileMenuHandler = this.app.workspace.on(
		"file-menu",
		(menu:any, fileOrFolder:any) => {
			if (fileOrFolder instanceof TFolder) {
			//check for folder or file instance
			menu.addItem((item:any) => {
				item
				.setTitle("Open in vscode (folder)")
				.setIcon("search")
				.onClick(() => {
					// console.log(fileOrFolder)
					// const folderPath = fileOrFolder.path;
					const vaultPath = this.app.vault.adapter.basePath;
					// console.log("basepath:", vaultPath)
					const folderPath = path.join(vaultPath, fileOrFolder.path);
					console.log(folderPath)
					window.open(`vscode://file/${folderPath}`)
					new Notice("folder open in vscode")

				});
			});
			}
		}
		))
		);
		this.registerEvent(
			// Store the reference to the event handler
			(this.fileMenuHandler = this.app.workspace.on(
			"file-menu",
			(menu:any, fileOrFolder:any) => {
				if (fileOrFolder instanceof TFolder) {
				//check for folder or file instance
				menu.addItem((item:any) => {
					item
					.setTitle("Search in folder")
					.setIcon("search")
					.onClick(() => {
						const folderPath = fileOrFolder.path;

						this.app.internalPlugins
						.getPluginById("global-search")
						.instance.openGlobalSearch(`path:"${folderPath}"`);

						// console.log(this.app.internalPlugins)
						// console.log(this.app.internalPlugins.config) //internal plguins t | f
						// console.log(this.app.internalPlugins.plugins) //plugins w their/its/own attributes

						// this.app.plugins.internalPlugins
						// .getPluginById("global-search")
						// .instance.openGlobalSearch(`path:"${folderPath}"`);
					});
				});
				}
			}
			))
		  );
		  this.registerEvent(
			(this.fileMenuHandler2 = this.app.workspace.on(
			  "file-menu",
			  (menu:any, fileOrFolder:any) => {
				const addFileColorMenuItem = (item: MenuItem) => {
				  item.setTitle("Set priority");
				  item.setIcon("arrow-up");
				  item.onClick(() => {
					new SampleModal(this.app).open();
				  });
				};
				menu.addItem(addFileColorMenuItem);
	  
				/*
				  if (fileOrFolder instanceof TFolder || TFile) {
					menu.addItem((item) => {
					  item
						.setTitle("Testing")
						.setIcon("rocket")
						.onClick(() => {
						  console.log("working");
						  new Notice("working");
						});
					});
					*/
			  }
			))
		  );

		  this.registerEvent(
			(this.fileMenuHandler = this.app.workspace.on(
				"file-menu",
				(menu:any, fileOrFolder:any) => {
				// const basename = path.basename(this.DataVault);
				// console.log(`The basename of the path is: ${basename}`);
				if (fileOrFolder instanceof TFolder || TFile) {
					menu.addItem((item:any) => {
					item
						.setTitle(`Send to ${path.basename(this.settings.DataVault)}`)
						.setIcon("document")
						.onClick(() => {
						if (fileOrFolder.path.endsWith(".md")) {
							//okay so the function (especially path join rename part requires FULL PATH) (check types and API support)
		
							moveFileToVault(
							"C:/Users/Mert Arkin/Desktop/Main PC/03VAULTS/O_BASE/" +
								fileOrFolder.path,
							this.DataVault
							);
		
							// console.log(fileOrFolder);
							// console.log(fileOrFolder.path);
		
							console.log(
							`file sent to vault: ${path.basename(this.settings.DataVault)}`
							);
							new Notice(
							`file sent to vault: ${path.basename(this.settings.DataVault)}`
							);
						} else {
							console.log("its a folder");
							//probably do what I did above and send folders to another vault - also maybe functionize it later
							// this.moveAllToVault(
							//   "C:/Users/Mert Arkin/Desktop/Main PC/O_BASE/" +
							//     fileOrFolder.path,
							//   this.DataVault
							// );
						}
						});
					});
				}
				}
			))
			);



			//TODO: implement flip path from highlighting path
			//TODO: implement file/folder coloring #later


			//TODO: bulk properties add rem upd exp imp folder to apply etc
			
			//TODO: implement oneclikc create repo with everything commands etc

			//TODO: implement 

			//A lot of errors below but solve them later now just UNcommenting and debugging
			// this.filePath = "";
			startWatching(this.settings.externalFolderPath);
}