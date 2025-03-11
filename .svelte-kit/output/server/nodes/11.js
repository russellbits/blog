import * as server from '../entries/pages/dashboard/create/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/create/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/create/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.6546cc07.js","_app/immutable/chunks/index.2ad7cf28.js","_app/immutable/chunks/post.08ec0051.js","_app/immutable/chunks/index.526206b3.js","_app/immutable/chunks/forms.91b02c45.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/singletons.ace4bd12.js","_app/immutable/chunks/stores.5168bae8.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.afc4546c.js"];
export const stylesheets = ["_app/immutable/assets/post.92955209.css","_app/immutable/assets/ProgressBar.05e4960c.css"];
export const fonts = [];
