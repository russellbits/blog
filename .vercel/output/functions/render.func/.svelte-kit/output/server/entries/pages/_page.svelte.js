import { c as create_ssr_component, f as each, e as escape } from "../../chunks/index3.js";
import { d as date } from "../../chunks/utils.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<main class="container mt-32"><h1 class="capitalize">Latest posts</h1>

	<div class="mt-8 space-y-6">${each(data.posts, (post, i) => {
    return `<ol><li><h3><a class="unstyled font-semibold capitalize text-primary-500" href="${"/blog/" + escape(post.slug, true)}">${escape(post.title)}
						</a></h3>
					<p>${escape(post.description)}</p>
					<p class="mt-4 text-gray-600 dark:text-gray-400">${escape(date(post.createdAt))}</p>
				</li></ol>

			${data.posts.length > 1 && data.posts.length !== i + 1 ? `<hr>` : ``}`;
  })}</div></main>`;
});
export {
  Page as default
};
