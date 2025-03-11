import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/index3.js";
import { P as Post } from "../../../../../chunks/post.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="container mt-32"><h1 class="capitalize">Edit post</h1>
	${validate_component(Post, "Form").$$render($$result, { data: data.form }, {}, {})}</div>`;
});
export {
  Page as default
};
