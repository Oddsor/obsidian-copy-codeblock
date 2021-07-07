import { Notice, Plugin } from 'obsidian';

const copiedCodeBlock = () => {
	new Notice('Code copied!');
};

export default class MyPlugin extends Plugin {
	async onload() {
		console.log('loading plugin: copy code block');

		this.registerMarkdownPostProcessor(async (el, ctx) => {
			if (el.children.length === 1 && el.children[0].tagName === 'PRE') {
				const content = el.textContent;
				el.addClass('codeblock-with-copy-button');
				const copyButton = el.createDiv();
				copyButton.addClass('codeblock-copy-button');
				copyButton.setText('Copy');
				copyButton.onclick = (ev: any) => {
					console.log('Click!', content);
					navigator.clipboard.writeText(content);
					copiedCodeBlock();
				}
			}
        });
	}

	onunload() {
		console.log('unloading plugin: copy code block');
		
	}
}