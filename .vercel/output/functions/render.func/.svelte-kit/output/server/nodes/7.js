

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.e40453a0.js","_app/immutable/chunks/index.2ad7cf28.js"];
export const stylesheets = [];
export const fonts = [];
