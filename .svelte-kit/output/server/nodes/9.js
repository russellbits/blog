import * as server from '../entries/pages/blog/_slug_/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.d4d6f442.js","_app/immutable/chunks/index.2ad7cf28.js"];
export const stylesheets = [];
export const fonts = [];
