import { minify } from 'html-minifier';
import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

const minification_options = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    decodeEntities: true,
    html5: true,
    ignoreCustomComments: [/^#/],
    minifyCSS: true,
    minifyJS: false,
    removeAttributeQuotes: true,
    removeComments: false, // some hydration code needs comments, so leave them in
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true
};

const minifyHTML = (async({ event, resolve }) =>{
    let page = '';
    return resolve(event, {
        transformPageChunk: ({ html, done }) => {
            page += html;
            if (done) {
                return building ? minify(page, minification_options) : page
            }
        }
    });
}) satisfies Handle;



export default minifyHTML;