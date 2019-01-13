const postcss = require('postcss');
const clipboardy = require('clipboardy');
const { readFile, writeFile } = require('fs');
const { Command, flags } = require('@oclif/command');
const {
  isSingleClass,
  trimClass,
  createSublimeCompletions,
  createVscodeSnippets,
} = require('./helpers');

const formatters = {
  vscode: createVscodeSnippets,
  sublime: createSublimeCompletions,
};

class TailwindSnippetsCliCommand extends Command {
  async run() {
    const {
      flags: { editor },
      args: { input },
    } = this.parse(TailwindSnippetsCliCommand);

    readFile(input, (err, css) => {
      postcss([() => {}])
        .process(css, { from: input })
        .then(({ root }) => {
          let cssObject = {};
          root.walkRules((rule) => {
            if (isSingleClass(rule)) {
              const selector = trimClass(rule.selector);
              cssObject[selector] = {};
              rule.walkDecls(({ prop, value }) => {
                cssObject[selector][prop] = value;
              });
            }
          });
          return cssObject;
        })
        .then((cssObject) => {
          const formattedSnippets = formatters[editor](cssObject);
          return clipboardy.write(JSON.stringify(formattedSnippets, null, 1));
        })
        .then(() => {
          this.log('Your snippet has been copied to clipboard! Enjoy');
        });
    });
  }
}

TailwindSnippetsCliCommand.args = [
  { name: 'input' },
];

TailwindSnippetsCliCommand.flags = {
  editor: flags.string({ char: 'e' }),
};



module.exports = TailwindSnippetsCliCommand;
