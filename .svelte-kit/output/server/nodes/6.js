import * as server from '../entries/pages/(auth)/register/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(auth)/register/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(auth)/register/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.0c36336f.js","_app/immutable/chunks/index.2ad7cf28.js","_app/immutable/chunks/auth.d4b4f645.js","_app/immutable/chunks/index.526206b3.js","_app/immutable/chunks/forms.91b02c45.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/singletons.ace4bd12.js","_app/immutable/chunks/stores.5168bae8.js"];
export const stylesheets = [];
export const fonts = [];
