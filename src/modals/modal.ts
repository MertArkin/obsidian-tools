import { App, Modal } from 'obsidian';

export class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
		contentEl.createEl("div", { text: 'from diffferent file' });
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

  

//TODO: implement page up down buttons
//TODO: implement sync scroll


/*

//https://docs.obsidian.md/Plugins/User+interface/Modals
class ExampleModal extends Modal {
  constructor(app, file) {
    super(app);
    this.file = file;
  }

  onOpen() {
    let { contentEl } = this;
    // contentEl.setText("Look at me, I'm a modal! 👀");
    contentEl.setText("Pick a color for this file");
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}

*/