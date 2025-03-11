import * as server from '../entries/pages/(auth)/register/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(auth)/register/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(auth)/register/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.531f81ad.js","_app/immutable/chunks/index.2ad7cf28.js","_app/immutable/chunks/auth.2111d109.js","_app/immutable/chunks/index.16711a41.js","_app/immutable/chunks/forms.d0ac8a00.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/singletons.1b809a60.js","_app/immutable/chunks/stores.6819fe79.js"];
export const stylesheets = [];
export const fonts = [];
