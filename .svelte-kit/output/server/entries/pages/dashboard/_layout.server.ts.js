import { r as redirect } from "../../../chunks/index.js";
const load = async ({ locals }) => {
  const session = await locals.validate();
  if (!session)
    throw redirect(302, "/login");
};
export {
  load
};
