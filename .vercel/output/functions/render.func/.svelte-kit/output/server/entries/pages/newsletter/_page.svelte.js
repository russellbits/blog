import { c as create_ssr_component } from "../../../chunks/index3.js";
import "devalue";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main class="container mt-32"><h1>Newsletter</h1>

	<div class="mt-8 max-w-md"><form method="POST" action="?/subscribe"><div class="flex gap-2"><input class="input" type="email" name="email">
				<button class="btn variant-filled-primary" type="submit">Subscribe
				</button></div></form></div></main>`;
});
export {
  Page as default
};
