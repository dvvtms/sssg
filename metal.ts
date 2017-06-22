import * as metalsmith from 'metalsmith'
import * as layouts from 'metalsmith-layouts'
import * as markdown from 'metalsmith-markdown'

const getTemplateConfig = (dir) => ({
    engine: 'handlebars',
    directory: dir.pages + 'template/',
    partials: dir.pages + 'partials/',
    default: 'page.html'
})

export const buildHtml = (dir) => metalsmith(dir.base)
    .clean(false)
    .source(dir.pages + 'html/')
    .destination(dir.destination)
    .use(markdown()) // convert markdown
    .use(layouts(getTemplateConfig(dir))) // layout templating
    .build((err) => {
        if (err) {
            console.log('error in metalsmith: ', err)
        } else {
            console.log('metalsmith finished... without err')
        }
    });
