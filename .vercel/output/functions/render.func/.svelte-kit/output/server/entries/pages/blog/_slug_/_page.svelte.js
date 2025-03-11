import { c as create_ssr_component, e as escape } from "../../../../chunks/index3.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="container mt-32"><h1>${escape(data.post.title)}</h1>
	<div class="mt-8 max-w-[80ch] space-y-8"><!-- HTML_TAG_START -->${data.post.html}<!-- HTML_TAG_END --></div></div>`;
});
export {
  Page as default
};
