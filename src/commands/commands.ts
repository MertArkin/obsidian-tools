import { App, Editor, MarkdownView, Plugin } from "obsidian";
import { SampleModal } from "../modals/modal";
import { openBookmarksView } from "../views/bookmarks/bookmarks";
import moment from "moment";


export async function initCommands(this: any) {
	    //Register Commands
		this.addCommand({
			id: "open chrome bookmarks panel",
			name: "open chrome bookmarks panel",
			hotkeys: [
			  {
				modifiers: ["Ctrl", "Shift"],
				key: "C",
				// action: "pressed",
			  },
			],
			callback: () => {
			  openBookmarksView.call(this);
			},
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView | any) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});


		this.addCommand({
			id: "insert-timestamp",
			name: "Insert timestamp",
			editorCallback: (editor: any) => {
			  // Get the current cursor position
			  // const cursor = editor.getCursor();
			  // console.log(cursor);
			  // console.log(editor.getCursor());
			  const now = moment().format("DD/MM/YYYY HH:mm"); //:ss is removed
			  editor.replaceRange(` \`${now}\``, editor.getCursor()); // - is rmeoved from beginning
			  editor.replaceRange(
				"> ",
				{ line: editor.getCursor().line, ch: 0 },
				{ line: editor.getCursor().line, ch: 0 }
			  );
			  // Get the end character position of the current line
			  const endOfLinePosition = editor.getLine(
				editor.getCursor().line
			  ).length;
			  editor.setCursor({
				line: editor.getCursor().line,
				ch: endOfLinePosition,
			  });
			},
			hotkeys: [
			  {
				modifiers: ["Mod"], // Mod represents the Command key on macOS and the Ctrl key on Windows/Linux
				key: "Shift+J",
			  },
			],
		  });
		}
