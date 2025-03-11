import { c as create_ssr_component, v as validate_component } from "../../../../chunks/index3.js";
import { A as Auth } from "../../../../chunks/auth.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="mx-auto mt-32 max-w-sm"><h1>Log in</h1>
	${validate_component(Auth, "AuthForm").$$render($$result, { data: data.form }, {}, {})}
	<p class="mt-4">Don&#39;t have an account? <a href="/register">Register</a></p></div>`;
});
export {
  Page as default
};
