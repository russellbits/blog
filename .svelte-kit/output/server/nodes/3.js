import * as server from '../entries/pages/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.e72ffd4e.js","_app/immutable/chunks/index.2ad7cf28.js","_app/immutable/chunks/utils.073a8948.js"];
export const stylesheets = [];
export const fonts = [];
