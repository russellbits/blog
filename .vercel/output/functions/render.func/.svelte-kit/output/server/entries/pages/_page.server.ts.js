import { g as getPublishedPosts } from "../../chunks/posts.js";
const load = async () => {
  return { posts: getPublishedPosts() };
};
export {
  load
};
