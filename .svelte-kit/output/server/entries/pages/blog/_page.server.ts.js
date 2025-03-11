import { g as getPublishedPosts } from "../../../chunks/posts.js";
const load = async () => {
  return { posts: await getPublishedPosts() };
};
export {
  load
};
