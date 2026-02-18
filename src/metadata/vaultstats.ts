import { MarkdownView } from "obsidian";

//https://docs.obsidian.md/Reference/TypeScript+API/Vault
// https://docs.obsidian.md/Reference/TypeScript+API/MetadataCache
export async function initVaultStats(this: any) {
  //Name of Vault
  const name = this.app.vault.getName();
  // console.log("Name of Vault:", name);

  // Path to the Obsidian vault
  this.settings.vaultPath = this.app.vault.getName();
  // console.log("vault is at: " + this.vaultPath);

  //all files in vault
  const files = this.app.vault.getFiles();
  //getMarkdownFiles
  //getAllLoadedFiles
  //getFiles
  // console.log(files);
  // console.log(files.length + " files in the vault " + files.name);
  // for (let i = 0; i < files.length; i++) {
  //   console.log(files[i].path);
  // }

  const configDir = this.app.vault.configDir;
  // console.log(`config dir is: ${configDir}`);


  const view =  this.app.workspace.getActiveViewOfType(MarkdownView)
  // console.log(view);
  // console.log(view.file);
  // console.log(view.file.path);
  // console.log(this.app.workspace.getActiveFile());
  if (this.app.workspace.getActiveFile() == undefined) {
    return;
  }
  else {
    const metadata = this.app.metadataCache.getFileCache(this.app.workspace.getActiveFile())
  }
  // console.log(metadata);
  // console.log(metadata.frontmatter); //json { a : b } frontmatter
  // console.log(metadata.frontmatter.date_created);
  // console.log(metadata.headings); //# ## ### ...
  // console.log(metadata.links); // [[]] ...

  // console.log(metadata.listItems);
  // console.log(metadata.sections); //types of sections breakdown

  const resolvedLinks  = this.app.metadataCache.resolvedLinks;
  // console.log(resolvedLinks)
  
  /*
  // Loop through each source path in resolvedLinks
  for (const sourcePath in resolvedLinks) {
    if (resolvedLinks.hasOwnProperty(sourcePath)) {
      // Get the destinations for the current source path
      const destinations = resolvedLinks[sourcePath];

      // Check if destinations is not an empty object
      if (Object.keys(destinations).length > 0) {
        console.log(`Source Path: ${sourcePath}`);

        // Loop through each destination in the current source path
        for (const destPath in destinations) {
          if (destinations.hasOwnProperty(destPath)) {
            const count = destinations[destPath];
            console.log(`  Destination Path: ${destPath}, Count: ${count}`);
          }
        }
      }
    }
  }
  */

}
