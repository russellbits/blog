import * as server from '../entries/pages/blog/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.02e7d0f7.js","_app/immutable/chunks/index.2ad7cf28.js","_app/immutable/chunks/utils.073a8948.js"];
export const stylesheets = [];
export const fonts = [];
