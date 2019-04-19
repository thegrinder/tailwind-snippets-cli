const isSingleClass = rule => !rule.selector.includes(',') && rule.selector.includes('.');

const trimClass = selector => selector.replace('html ', '').replace('\\', '').replace('.', '');

const createSublimeCompletions = cssObject => ({
  completions: Object.keys(cssObject),
});

const createVscodeSnippets = cssObject => Object.keys(cssObject)
  .reduce((acc, next) => ({
    ...acc,
    [next]: {
      body: next,
      prefix: next,
      scope: 'javascript,javascriptreact,typescriptreact',
      description: JSON.stringify(cssObject[next]),
    },
  }), {});

module.exports = {
  isSingleClass,
  trimClass,
  createSublimeCompletions,
  createVscodeSnippets,
};
