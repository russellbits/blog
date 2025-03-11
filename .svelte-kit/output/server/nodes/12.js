import * as server from '../entries/pages/dashboard/edit/_slug_/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/edit/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/edit/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.d1cb617c.js","_app/immutable/chunks/index.2ad7cf28.js","_app/immutable/chunks/post.25896255.js","_app/immutable/chunks/index.16711a41.js","_app/immutable/chunks/forms.d0ac8a00.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/singletons.1b809a60.js","_app/immutable/chunks/stores.6819fe79.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.d4c2facb.js"];
export const stylesheets = ["_app/immutable/assets/post.92955209.css","_app/immutable/assets/ProgressBar.05e4960c.css"];
export const fonts = [];
