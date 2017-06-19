"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metalsmith = require("metalsmith");
const layouts = require("metalsmith-layouts");
const markdown = require("metalsmith-markdown");
const getTemplateConfig = (dir) => ({
    engine: 'handlebars',
    directory: dir.pages + 'template/',
    partials: dir.pages + 'partials/',
    default: 'page.html'
});
exports.buildHtml = (dir) => metalsmith(dir.base)
    .clean(false)
    .source(dir.pages + 'html/')
    .destination(dir.destination)
    .use(markdown()) // convert markdown
    .use(layouts(getTemplateConfig(dir))) // layout templating
    .build((err) => {
    if (err) {
        console.log('error in metalsmith: ', err);
    }
    else {
        console.log('metalsmith finished... without err');
    }
});
//# sourceMappingURL=metal.js.map