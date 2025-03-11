import { blake3 } from "@noble/hashes/blake3";
const generateChecksum = (input) => {
  return convertUint8ArrayToHex(blake3(input));
};
const convertUint8ArrayToHex = (arr) => {
  return [...arr].map((x) => x.toString(16).padStart(2, "0")).join("");
};
const handleServerSession = (fn) => {
  const handleServerSessionCore = async ({ locals }) => {
    const { session, user } = await locals.validateUser();
    if (session) {
      return {
        _lucia: {
          user,
          sessionChecksum: generateChecksum(session.sessionId)
        }
      };
    }
    return {
      _lucia: {
        user: null,
        sessionChecksum: null
      }
    };
  };
  return async (event) => {
    const { _lucia } = await handleServerSessionCore(event);
    const loadFunction = fn ?? (async () => {
    });
    const result = await loadFunction(event) || {};
    return {
      _lucia,
      ...result
    };
  };
};
const load = handleServerSession();
export {
  load
};
