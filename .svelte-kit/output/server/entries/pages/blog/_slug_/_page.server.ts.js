import { a as getPost } from "../../../../chunks/posts.js";
const load = async ({ params }) => {
  return { post: await getPost(params.slug) };
};
export {
  load
};
