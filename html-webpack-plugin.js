const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

function HtmlPlugin ({ templatePath }) {
  this.templatePath = templatePath;
}

function emitFile ({ template, filePath, context }) {
  const fileContents = template(context);
  fs.writeFileSync(filePath, fileContents);
}

function getScriptTag (name) {
  return `<script src="${name}.js"></script>`;
}

HtmlPlugin.prototype.apply = function apply (compiler) {
  const templatePath = this.templatePath;
  compiler.plugin('after-emit', (compilation) => {
    // create files
    const indexTemplate = fs.readFileSync(templatePath);
    // send it via handlebars
    const template = handlebars.compile(indexTemplate.toString());
    const namedChunks = compilation && compilation.namedChunks;

    // emit the main app html
    emitFile({
      template,
      filePath: path.resolve(compilation.outputOptions.path, 'index.html'),
      context: {
        title: 'See all the examples!',
        examples: Object.keys(namedChunks).map(c => ({
          heading: c.replace('/index', ''),
        })),
      },
    });

    // emit sub app htmls
    for (const prop in namedChunks) {
      emitFile({
        template,
        filePath: path.resolve(compilation.outputOptions.path, `${prop}.html`),
        context: {
          scripts: getScriptTag('index'),
        },
      });
    }
  });
};

module.exports = HtmlPlugin;
