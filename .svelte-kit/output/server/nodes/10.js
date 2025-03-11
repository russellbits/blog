import * as server from '../entries/pages/dashboard/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.98d647a0.js","_app/immutable/chunks/index.2ad7cf28.js","_app/immutable/chunks/forms.91b02c45.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/singletons.ace4bd12.js","_app/immutable/chunks/utils.073a8948.js"];
export const stylesheets = [];
export const fonts = [];
