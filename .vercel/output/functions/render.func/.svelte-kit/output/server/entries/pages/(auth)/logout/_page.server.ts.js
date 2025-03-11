import { f as fail, r as redirect } from "../../../../chunks/index.js";
import { a as auth } from "../../../../chunks/auth2.js";
const actions = {
  default: async ({ locals }) => {
    const session = await locals.validate();
    if (!session)
      return fail(401);
    await auth.invalidateSession(session.sessionId);
    locals.setSession(null);
    throw redirect(303, "/");
  }
};
export {
  actions
};
