import { e as error, f as fail, r as redirect } from "../../../../../chunks/index.js";
import { s as superValidate, p as postSchema } from "../../../../../chunks/schema.js";
import { marked } from "marked";
import { a as getPost, u as updatePost } from "../../../../../chunks/posts.js";
const load = async ({ params }) => {
  const post = await getPost(params.slug);
  if (!post) {
    throw error(400, "Could not find post");
  }
  const form = await superValidate(post, postSchema);
  return { form };
};
const actions = {
  default: async (event) => {
    const form = await superValidate(event, postSchema);
    if (!form.valid) {
      return fail(400, { form });
    }
    try {
      const data = {
        ...form.data,
        html: marked.parse(form.data.markdown)
      };
      await updatePost(form.data.slug, data);
    } catch (error2) {
      return fail(400, { form });
    }
    throw redirect(300, "/dashboard");
  }
};
export {
  actions,
  load
};
