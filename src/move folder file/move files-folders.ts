import * as fs from "fs";
import * as path from "path";
import { Notice } from "obsidian"; // Import Notice from Obsidian API

// let filePath: string = "";

export async function startWatching(externalFolderPath: string): Promise<void> {
  if (fs.existsSync(externalFolderPath)) {
    fs.watch(externalFolderPath, (eventType, filename) => {
      if (filename && (eventType === "rename" || eventType === "change")) {
        console.log(`Event: ${eventType}, Filename: ${filename}`); // Debug log
        //if we need to store it then use class or variables
        // filePath = 
        path.join(externalFolderPath, filename);
        // Provide a destination path if needed
        // moveFileToVault(filePath, 'destinationPath');
      }
    });
  } else {
    //simdilik unmute - while beta/building
    // console.log(`${externalFolderPath} doesn't exist!`);
    // console.error(`${externalFolderPath} doesn't exist!`);
  }
}

export async function moveFileToVault(filePath: string, destination: string): Promise<void> {
  console.log(`File path:\n${filePath}\nDestination:\n${destination}`);
  if (filePath === "") {
    // Optional: Provide feedback if no file path is available
    // new Notice(`Watching\n'${externalFolderPath}'\n\nno event happened`);
    return;
  }

  if (fs.existsSync(filePath)) {
    console.log("Path exists");
    const fileName = path.basename(filePath);
    const destinationPath = path.join(destination, fileName);

    try {
      await fs.promises.rename(filePath, destinationPath);
      new Notice(`File moved: ${filePath}`);
      filePath = "";
    } catch (err) {
      console.error(`Error moving file: ${err}`);
    }
  } else {
    console.error(`File path does not exist: ${filePath}`);
  }
}

export async function moveAllToVault(sourcePath: string, destinationPath: string): Promise<void> {
  try {
    const items = await fs.promises.readdir(sourcePath, { withFileTypes: true });

    console.log(items);

    if (items.length === 0) {
      new Notice(`No contents at ${sourcePath}`);
      return;
    } else {
      new Notice(`Moving contents from ${sourcePath} to ${destinationPath}`);
      for (const item of items) {
        const srcPath = path.join(sourcePath, item.name);
        const destPath = path.join(destinationPath, item.name);

        if (item.isDirectory()) {
          // Create destination directory
          await fs.promises.mkdir(destPath, { recursive: true });
          // Recursively move contents of the directory
          await moveAllToVault(srcPath, destPath);
          // Optionally remove the source directory if empty
          await fs.promises.rmdir(srcPath);
        } else if (item.isFile()) {
          // Move the file
          await fs.promises.rename(srcPath, destPath);
        }
      }
      new Notice("Move completed successfully.");
    }
  } catch (error) {
    console.error("Error moving files:", error);
  }
}
