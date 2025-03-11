import { f as fail, r as redirect } from "../../../../chunks/index.js";
import { s as superValidate, p as postSchema } from "../../../../chunks/schema.js";
import { marked } from "marked";
import { c as createPost } from "../../../../chunks/posts.js";
const load = async (event) => {
  const form = await superValidate(event, postSchema);
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
      await createPost(data);
    } catch (error) {
      return fail(400, { form });
    }
    throw redirect(300, "/dashboard");
  }
};
export {
  actions,
  load
};
