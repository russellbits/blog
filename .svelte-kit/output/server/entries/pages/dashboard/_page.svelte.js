import { c as create_ssr_component, f as each, e as escape } from "../../../chunks/index3.js";
import "devalue";
import { t as truncate, d as date } from "../../../chunks/utils.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<main class="container mt-32"><h1 class="font">Dashboard</h1>

	<div class="mt-8"><a class="font-bold capitalize underline-offset-4" href="/dashboard/create">+ Create a new post
		</a></div>

	<div class="table-container mt-8"><table class="table-hover table"><thead><tr><th>Title</th>
					<th>Created</th>
					<th>Published</th>
					<th>Actions</th></tr></thead>

			<tbody>${each(data.posts, (post, i) => {
    return `<tr><td><a class="unstyled capitalize" href="${"/dashboard/edit/" + escape(post.slug, true)}">${escape(truncate(post.title))}
							</a></td>
						<td>${escape(date(post.createdAt))}</td>
						<td>${escape(post.published ? "Yes" : "No")}</td>
						<td><form method="POST" action="${"?/delete&slug=" + escape(post.slug, true)}"><button class="btn variant-soft-error" type="submit">Delete
								</button>
							</form></td>
					</tr>`;
  })}</tbody></table></div></main>`;
});
export {
  Page as default
};
