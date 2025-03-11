import { c as create_ssr_component, d as add_attribute, f as each, e as escape } from "../../../chunks/index3.js";
import { d as date } from "../../../chunks/utils.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredPosts;
  let { data } = $$props;
  let search = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  filteredPosts = data.posts.filter((post) => post.title.toLowerCase().includes(search.trim()));
  return `<div class="container mt-32"><main class="container mt-32"><h1 class="capitalize">Search posts</h1>

		<form class="mt-8"><label for="search"><input type="search" autocomplete="off" class="input" name="search" id="search"${add_attribute("value", search, 0)}></label></form>

		<div class="mt-8"><ol class="space-y-6">${each(filteredPosts, (post, i) => {
    return `<li><h3><a class="unstyled font-semibold capitalize text-primary-500" href="${"/blog/" + escape(post.slug, true)}">${escape(post.title)}
							</a></h3>
						<p>${escape(post.description)}</p>
						<p class="mt-4 text-gray-600 dark:text-gray-400">${escape(date(post.createdAt))}
						</p></li>

					${data.posts.length > 1 && data.posts.length !== i + 1 ? `<hr>` : ``}`;
  })}</ol></div></main></div>`;
});
export {
  Page as default
};
