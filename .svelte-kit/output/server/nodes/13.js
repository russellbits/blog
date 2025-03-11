import * as server from '../entries/pages/newsletter/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/newsletter/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/newsletter/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.65456dae.js","_app/immutable/chunks/index.2ad7cf28.js","_app/immutable/chunks/forms.d0ac8a00.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/singletons.1b809a60.js"];
export const stylesheets = [];
export const fonts = [];
