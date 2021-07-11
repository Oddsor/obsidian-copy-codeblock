import { Notice, Plugin } from 'obsidian';

const notify = (text: string) => {
    new Notice(text);
};

export default class MyPlugin extends Plugin {
    async onload() {
        console.log('loading plugin: copy code block');

        this.registerMarkdownPostProcessor(async (el, ctx) => {
            // If there are more than one children in the code block, it is safe to assume
            // that this is not a simple code block, so we should not add a button
            if (el.children.length === 1 && el.children[0].tagName === 'PRE') {
                const content = el.textContent;
                el.addClass('codeblock-with-copy-button');
                const copyButton = el.createDiv();
                copyButton.addClass('codeblock-copy-button');
                copyButton.setText('Copy');
                copyButton.onclick = _ => {
                    const preNode = el.find('pre').cloneNode(true) as HTMLElement;
                    // This regex replace removes a trailing newline that 
                    // is automatically added to the condend of code blocks
                    preNode.find('code').innerHTML = preNode.find('code').innerHTML.replace(/\n$/, '');

                    var htmlblob = new Blob([preNode.outerHTML], { type: 'text/html' });
                    // For the text-copy, apply a trim to remove leading and trailing whitespace
                    var textblob = new Blob([content.replace(/\n$/, '')], { type: 'text/plain' });
                    var data = [new ClipboardItem({ 'text/html': htmlblob, 'text/plain': textblob })];

                    navigator.clipboard.write(data).then(
                        function () {
                            notify('Code copied to clipboard!');
                        },
                        function () {
                            notify('Failed to copy code to clipboard!');
                        }
                    );
                }
            }
        });
    }

    onunload() {
        console.log('unloading plugin: copy code block');
    }
}