

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.4edf01e9.js","_app/immutable/chunks/index.2ad7cf28.js","_app/immutable/chunks/stores.6819fe79.js","_app/immutable/chunks/singletons.1b809a60.js"];
export const stylesheets = [];
export const fonts = [];
