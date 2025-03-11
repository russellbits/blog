import { f as fail } from "../../../chunks/index.js";
import { b as getPosts, d as deletePost } from "../../../chunks/posts.js";
const load = async () => {
  return { posts: await getPosts() };
};
const actions = {
  delete: async ({ url }) => {
    const slug = String(url.searchParams.get("slug"));
    try {
      await deletePost(slug);
    } catch (error) {
      return fail(400);
    }
  }
};
export {
  actions,
  load
};
