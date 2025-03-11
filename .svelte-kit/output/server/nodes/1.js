

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.aff6fb36.js","_app/immutable/chunks/index.2ad7cf28.js","_app/immutable/chunks/stores.5168bae8.js","_app/immutable/chunks/singletons.ace4bd12.js"];
export const stylesheets = [];
export const fonts = [];
