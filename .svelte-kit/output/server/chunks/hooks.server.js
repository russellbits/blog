import { S as SESSION_COOKIE_NAME, a as auth } from "./auth2.js";
import "@noble/hashes/blake3";
const handleHooks = (auth2) => {
  return async (data) => {
    const event = data.event;
    const resolve = data.resolve;
    let getSessionPromise = null;
    let getSessionUserPromise = null;
    event.locals.setSession = (session) => {
      auth2.createSessionCookies(session).forEach((cookie) => {
        event.cookies.set(cookie.name, cookie.value, cookie.attributes);
      });
      getSessionPromise = null;
      getSessionUserPromise = null;
    };
    event.locals.validate = async () => {
      if (getSessionPromise)
        return getSessionPromise;
      if (getSessionUserPromise)
        return (await getSessionUserPromise).session;
      getSessionPromise = new Promise(async (resolve2) => {
        try {
          auth2.validateRequestHeaders(event.request);
          const sessionId = event.cookies.get(SESSION_COOKIE_NAME) || "";
          const session = await auth2.validateSession(sessionId);
          if (session.isFresh) {
            event.locals.setSession(session);
          }
          resolve2(session);
        } catch {
          event.locals.setSession(null);
          resolve2(null);
        }
      });
      return getSessionPromise;
    };
    event.locals.validateUser = async () => {
      if (getSessionUserPromise)
        return getSessionUserPromise;
      getSessionUserPromise = new Promise(async (resolve2) => {
        try {
          auth2.validateRequestHeaders(event.request);
          const sessionId = event.cookies.get(SESSION_COOKIE_NAME) || "";
          const { session, user } = await auth2.validateSessionUser(sessionId);
          if (session.isFresh) {
            event.locals.setSession(session);
          }
          resolve2({ session, user });
        } catch {
          resolve2({
            session: null,
            user: null
          });
        }
      });
      return getSessionUserPromise;
    };
    return await resolve(event);
  };
};
const handle = handleHooks(auth);
export {
  handle
};
