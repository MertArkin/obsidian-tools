import * as obsidian from 'obsidian';

//https://chatgpt.com/c/2d6733f0-14f9-4e31-a077-1b17ff21628c

// Extend the existing 'obsidian' module
declare module "obsidian" {
    interface App {
        //somehow we can get only enabled plugins by calling this.app.plugins.plugins and plugins general attributes when we call this.app.plugins
        // plugins: plugins; // Extend App to include the plugins property
        // Vault: DataAdapter;    
    }
}