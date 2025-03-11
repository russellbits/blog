import * as server from '../entries/pages/dashboard/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.8124ceed.js","_app/immutable/chunks/index.2ad7cf28.js","_app/immutable/chunks/forms.d0ac8a00.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/singletons.1b809a60.js","_app/immutable/chunks/utils.073a8948.js"];
export const stylesheets = [];
export const fonts = [];
