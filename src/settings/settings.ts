import  MyPlugin  from "../../main"
import { App, Notice, PluginSettingTab, Setting } from "obsidian";

//https://docs.obsidian.md/Plugins/User+interface/Settings
//https://docs.obsidian.md/Reference/TypeScript+API/Setting
export class ExampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;
    
    containerEl.empty();   
     
    containerEl.createEl("h2", { text: `${this.plugin.manifest.name}` });

    /* BELOW IS ADDING SETTINGS AND ITS PANELS FOR INITIALIZATIONS IN THE MAIN.TS FILE */
    // containerEl.createEl("br");
    containerEl.createEl("h5", { text: "File Watcher Settings" });

    new Setting(containerEl)
      // .setHeading()
      .setName("Other Vault Path")
      .setDesc("Other Vault Path")
      .addText((text) =>
        text
          .setPlaceholder("Enter Other Vault Path to send")
          .setValue(this.plugin.settings.DataVault)
          .onChange(async (value) => {
            this.plugin.settings.DataVault = value;
            await this.plugin.saveSettings();
          })
      );
      new Setting(containerEl)
      // .setHeading()
      .setName("External Vault Path")
      .setDesc("External Vault Path")
      .addText((text) =>
        text
          .setPlaceholder("Enter External folder Path to watch")
          .setValue(this.plugin.settings.externalFolderPath)
          .onChange(async (value) => {
            this.plugin.settings.externalFolderPath = value;
            await this.plugin.saveSettings();
          })
      );

      /*
      new Setting(containerEl)
      // .setHeading()
      .setName("a a a")
      .setDesc("example")
      .addText((text) =>
        text
          .setPlaceholder("Enter ")
          // .setValue(this.plugin.settings.externalFolderPath)
          .onChange(async (value) => {
            // this.plugin.settings.externalFolderPath = value;
            // await this.plugin.saveSettings();
          })
      );
      */

      containerEl.createEl("br");
      containerEl.createEl("h5", { text: "Initialization Settings" });
  
      // let lfcr = "&#13;&#10;"
      new Setting(containerEl)
      .setName(`Register statusbar commands events ribbons vaultstats`)
      .setDesc("example setting")
      .addToggle((cb) => 
        cb
      .setValue(true)
        .onChange(async (value) => {
          const currentValue = cb.getValue()
          console.log('Toggle value changed:', currentValue);
          new Notice("toggled")
        // this.plugin.settings.dateFormat = value; // Update settings with the new format
        // await this.plugin.saveSettings(); // Save the updated settings
      })
      );

      /*
      new Setting(containerEl)
      .setName("Date format")
      .setDesc("Default date format")
      .addColorPicker((colorPicker) => {
        // Define an RGB object with values for red, green, and blue
        const rgb = { r: 100, g: 44, b: 6 };
        // Set the color picker value using the RGB object
        colorPicker
          .setValueRgb(rgb) // Sets the color using the RGB values
          .onChange(async (color) => {
            // Handle color change
            console.log(`Selected color: ${color}`);
            // You can save the new color to settings or perform other actions here
            // this.plugin.settings.dateFormatColor = color; // Assuming `color` is in a suitable format
            await this.plugin.saveSettings();
          });
    });
    */
    /*
      .addText((text) =>
        text
          // .setPlaceholder("MMMM dd, yyyy")
          .setPlaceholder("Enter date in format ofaaaaa: MMMM dd, yyyy")
          .setValue(this.plugin.settings.dateFormat)
          .onChange(async (value) => {
            this.plugin.settings.dateFormat = value;
            await this.plugin.saveSettings();
          })
            */
      // );

      // new Setting(containerEl)
      // .setName("Example setting format")
      // .setDesc("example setting")
      // .addText((text) =>
      //   text
      //     .setPlaceholder("placeholder")
      //     .setValue(this.plugin.manifest.name)
      //     .onChange(async (value) => {
      //       let a  = "b";
      //       await this.plugin.saveSettings();
      //     })
      // );
      
      //https://chatgpt.com/c/e501da8b-64ea-49dd-9f88-01f3bbfa70b1
      new Setting(containerEl)
      .setName("Register custom bookmarks view")
      .setDesc("example setting")
      .addToggle((cb) => 
        cb
      .setValue(true)
        .onChange(async (value) => {
          const currentValue = cb.getValue()
          console.log('Toggle value changed:', currentValue);
          new Notice("toggled")
        // this.plugin.settings.dateFormat = value; // Update settings with the new format
        // await this.plugin.saveSettings(); // Save the updated settings
      })
      );

      //this is where we
      //implement also one click view in custom view enable/disable for x/special/picked/specified type files
      new Setting(containerEl)
      .setName("Register custom MarkdownCodeBlockProcessor")
      .setDesc("example setting")
      .addToggle((cb) => 
        cb
      .setValue(true)
        .onChange(async (value) => {
          const currentValue = cb.getValue()
          console.log('Toggle value changed:', currentValue);
          new Notice("toggled")
        // this.plugin.settings.dateFormat = value; // Update settings with the new format
        // await this.plugin.saveSettings(); // Save the updated settings
      })
      );

      new Setting(containerEl)
      .setName("Register custom ObsidianProtocolHandler")
      .setDesc("example setting")
      .addToggle((cb) => 
        cb
      .setValue(true)
        .onChange(async (value) => {
          const currentValue = cb.getValue()
          console.log('Toggle value changed:', currentValue);
          new Notice("toggled")
        // this.plugin.settings.dateFormat = value; // Update settings with the new format
        // await this.plugin.saveSettings(); // Save the updated settings
      })
      );

      /*
      new Setting(containerEl)
      .setName("Date Format")
      .setDesc("Set the format for displaying dates.")
      .addMomentFormat((momentFormat) => {
        // Set the default format and placeholder text
        momentFormat
          .setDefaultFormat("YYYY-MM-DD")  // Default format to use when input is cleared
          .setPlaceholder("Enter date format") // Placeholder text for the input field
          .setValue(this.plugin.settings.dateFormat) // Set the initial value from plugin settings
          .onChange(async (value) => {
            // this.plugin.settings.dateFormat = value; // Update settings with the new format
            await this.plugin.saveSettings(); // Save the updated settings
          })
          // .setSampleEl(document.getElementById('formatSample')); // Optionally set a sample element to show format preview
      });
      */

      /*
      new Setting(containerEl)
      .setName("Example setting format")
      .setDesc("example setting")
      .addDropdown((dropdown) => {
        dropdown
          // .addOption('light', 'Light Theme')  // Adding an option with value 'light' and display text 'Light Theme'
          // .addOption('dark', 'Dark Theme')    // Adding an option with value 'dark' and display text 'Dark Theme'
          .addOptions({ "a":"b", "c":"d"})
          // .setValue(this.plugin.settings.theme) // Set the initial value from plugin settings
          .onChange(async (value) => {
            // this.plugin.settings.theme = value; // Update settings with the selected value
            await this.plugin.saveSettings();    // Save the settings
          });
      });
      */

      containerEl.createEl("br");
      containerEl.createEl("h5", { text: "Deployable Obsidian USB Settings" });

      new Setting(containerEl)
      .setName("Choose folder for USB deployable Obsidian")
      .setDesc("example setting")
      .addButton((cb) => cb
          .setButtonText("DEPLOY")
          .setWarning()
          .setTooltip("!")
          .onClick(() => {
            // new Notice("reset")
          })
          // .setValue(this.plugin.manifest.name)
          // .onChange(async (value) => {
          //   let a  = "b";
          //   await this.plugin.saveSettings();
          // })
      );

  }
}

/*
//SETTINGS CLASS
//hasOwnProperty bak sonra

class SettingsWindow extends PluginSettingTab {
// extends https://marcus.se.net/obsidian-plugin-docs/reference/typescript/classes/SettingTab
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    var container = this.containerEl;
    container.empty();

    container.createEl("h2", { text: "Custom Code Embed Settings" });
    container.createEl("h4", { text: "Embed Settings" });
    container.createEl("br");
    container.createEl("h2", { text: "Render Settings" });

    //addtext
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
  }
}
*/