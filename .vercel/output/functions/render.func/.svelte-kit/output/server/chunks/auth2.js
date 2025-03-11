import { customRandom, random } from "nanoid";
import { scryptAsync } from "@noble/hashes/scrypt";
import prisma from "@lucia-auth/adapter-prisma";
import { d as db } from "./database.js";
const __toString = Object.prototype.toString;
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
const parseCookie = (str, options) => {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options ?? {};
  const dec = opt.decode ?? decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.charCodeAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
};
const serializeCookie = (name, val, options) => {
  const opt = options ?? {};
  const enc = opt.encode ?? encode;
  if (!fieldContentRegExp.test(name))
    throw new TypeError("argument name is invalid");
  const value = enc(val);
  if (value && !fieldContentRegExp.test(value))
    throw new TypeError("argument val is invalid");
  let str = name + "=" + value;
  if (null != opt.maxAge) {
    const maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge))
      throw new TypeError("option maxAge is invalid");
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain))
      throw new TypeError("option domain is invalid");
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path))
      throw new TypeError("option path is invalid");
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    const expires = opt.expires;
    if (!isDate(expires) || isNaN(expires.valueOf()))
      throw new TypeError("option expires is invalid");
    str += "; Expires=" + expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
};
const decode = (str) => {
  return str.includes("%") ? decodeURIComponent(str) : str;
};
const encode = (val) => {
  return encodeURIComponent(val);
};
const isDate = (val) => {
  return __toString.call(val) === "[object Date]" || val instanceof Date;
};
const tryDecode = (str, decodeFunction) => {
  try {
    return decodeFunction(str);
  } catch (e) {
    return str;
  }
};
const SESSION_COOKIE_NAME = "auth_session";
const createSessionCookie = (session, env, options) => {
  return new Cookie(SESSION_COOKIE_NAME, session?.sessionId ?? "", {
    ...options,
    httpOnly: true,
    expires: new Date(session?.idlePeriodExpires ?? 0),
    secure: env === "PROD"
  });
};
class Cookie {
  constructor(name, value, options) {
    this.name = name;
    this.value = value;
    this.attributes = options;
  }
  name;
  value;
  attributes;
  serialize = () => {
    return serializeCookie(this.name, this.value, this.attributes);
  };
}
const logError = (message) => {
  console.log("\x1B[31m%s\x1B[31m", `[LUCIA_ERROR] ${message}`);
};
const generateRandomString = (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  return customRandom(characters, length, random)();
};
const generateHashWithScrypt = async (s) => {
  const salt = generateRandomString(16);
  const key = await scrypt(s.normalize("NFKC"), salt);
  return `s2:${salt}:${key}`;
};
const scrypt = async (s, salt, blockSize = 16) => {
  const keyUint8Array = await scryptAsync(new TextEncoder().encode(s), new TextEncoder().encode(salt), {
    N: 16384,
    r: blockSize,
    p: 1,
    dkLen: 64
  });
  return convertUint8ArrayToHex(keyUint8Array);
};
const validateScryptHash = async (s, hash) => {
  const arr = hash.split(":");
  if (arr.length === 2) {
    const [salt2, key2] = arr;
    const targetKey = await scrypt(s, salt2, 8);
    return constantTimeEqual(targetKey, key2);
  }
  if (arr.length !== 3)
    return false;
  const [version, salt, key] = arr;
  if (version === "s2") {
    const targetKey = await scrypt(s, salt);
    return constantTimeEqual(targetKey, key);
  }
  return false;
};
const constantTimeEqual = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  const aUint8Array = new TextEncoder().encode(a);
  const bUint8Array = new TextEncoder().encode(b);
  let c = 0;
  for (let i = 0; i < a.length; i++) {
    c |= aUint8Array[i] ^ bUint8Array[i];
  }
  return c === 0;
};
const convertUint8ArrayToHex = (arr) => {
  return [...arr].map((x) => x.toString(16).padStart(2, "0")).join("");
};
class LuciaError extends Error {
  constructor(errorMsg, detail) {
    super(errorMsg);
    this.message = errorMsg;
    this.detail = detail ?? "";
  }
  detail;
  message;
}
const isWithinExpiration = (millisecond) => {
  if (millisecond === null)
    return false;
  const currentTime = Date.now();
  if (currentTime > millisecond)
    return false;
  return true;
};
const validateDatabaseSessionData = (databaseSession) => {
  if (databaseSession.idle_expires !== null && !isWithinExpiration(databaseSession.idle_expires)) {
    return null;
  }
  const isActive = isWithinExpiration(databaseSession.active_expires);
  return {
    sessionId: databaseSession.id,
    userId: databaseSession.user_id,
    activePeriodExpires: new Date(Number(databaseSession.active_expires)),
    idlePeriodExpires: new Date(Number(databaseSession.idle_expires)),
    state: isActive ? "active" : "idle",
    isFresh: false
  };
};
const transformDatabaseKey = (databaseKey) => {
  const [providerId, ...providerUserIdSegments] = databaseKey.id.split(":");
  const isPersistent = databaseKey.expires === null;
  const providerUserId = providerUserIdSegments.join(":");
  const userId = databaseKey.user_id;
  const isPasswordDefined = !!databaseKey.hashed_password;
  if (isPersistent) {
    return {
      type: "persistent",
      isPrimary: databaseKey.primary,
      providerId,
      providerUserId,
      userId,
      isPasswordDefined
    };
  }
  return {
    type: "single_use",
    providerId,
    providerUserId,
    userId,
    expires: new Date(databaseKey.expires),
    isExpired: () => !isWithinExpiration(databaseKey.expires),
    isPasswordDefined
  };
};
const getOneTimeKeyExpiration = (duration) => {
  if (typeof duration !== "number")
    return null;
  return new Date(duration * 1e3 + (/* @__PURE__ */ new Date()).getTime());
};
const lucia = (config) => {
  return new Auth(config);
};
const validateConfiguration = (config) => {
  const isAdapterProvided = config.adapter;
  if (!isAdapterProvided) {
    logError('Adapter is not defined in configuration ("config.adapter")');
    process.exit(1);
  }
};
class Auth {
  adapter;
  generateUserId;
  sessionCookie;
  sessionTimeout;
  ENV;
  hash;
  autoDatabaseCleanup;
  transformUserData;
  csrfProtection;
  constructor(config) {
    validateConfiguration(config);
    const defaultSessionCookieOption = {
      sameSite: "lax",
      path: "/"
    };
    if ("user" in config.adapter) {
      let userAdapter = config.adapter.user(LuciaError);
      let sessionAdapter = config.adapter.session(LuciaError);
      if ("getSessionAndUserBySessionId" in userAdapter) {
        const { getSessionAndUserBySessionId: _, ...extractedUserAdapter } = userAdapter;
        userAdapter = extractedUserAdapter;
      }
      if ("getSessionAndUserBySessionId" in sessionAdapter) {
        const { getSessionAndUserBySessionId: _, ...extractedSessionAdapter } = sessionAdapter;
        sessionAdapter = extractedSessionAdapter;
      }
      this.adapter = {
        ...userAdapter,
        ...sessionAdapter
      };
    } else {
      this.adapter = config.adapter(LuciaError);
    }
    this.generateUserId = config.generateCustomUserId ?? (() => generateRandomString(15));
    this.ENV = config.env;
    this.csrfProtection = config.csrfProtection ?? true;
    this.sessionTimeout = {
      activePeriod: config.sessionTimeout?.activePeriod ?? 1e3 * 60 * 60 * 24,
      idlePeriod: config.sessionTimeout?.idlePeriod ?? 1e3 * 60 * 60 * 24 * 14
    };
    this.autoDatabaseCleanup = config.autoDatabaseCleanup ?? true;
    this.transformUserData = ({ id, hashed_password, provider_id, ...attributes }) => {
      const defaultTransform = ({ id: id2 }) => {
        return {
          userId: id2
        };
      };
      const transform = config.transformUserData ?? defaultTransform;
      return transform({ id, ...attributes });
    };
    this.sessionCookie = config.sessionCookie ?? [defaultSessionCookieOption];
    this.hash = {
      generate: config.hash?.generate ?? generateHashWithScrypt,
      validate: config.hash?.validate ?? validateScryptHash
    };
  }
  getUser = async (userId) => {
    const databaseUser = await this.adapter.getUser(userId);
    if (!databaseUser)
      throw new LuciaError("AUTH_INVALID_USER_ID");
    const user = this.transformUserData(databaseUser);
    return user;
  };
  getSessionUser = async (sessionId) => {
    if (sessionId.length !== 40)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    let userData;
    let sessionData;
    if (this.adapter.getSessionAndUserBySessionId !== void 0) {
      const databaseUserSession = await this.adapter.getSessionAndUserBySessionId(sessionId);
      if (!databaseUserSession)
        throw new LuciaError("AUTH_INVALID_SESSION_ID");
      userData = databaseUserSession.user;
      sessionData = databaseUserSession.session;
    } else {
      sessionData = await this.adapter.getSession(sessionId);
      userData = sessionData ? await this.adapter.getUser(sessionData.user_id) : null;
    }
    if (!sessionData)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    const session = validateDatabaseSessionData(sessionData);
    if (!session) {
      if (this.autoDatabaseCleanup) {
        await this.adapter.deleteSession(sessionId);
      }
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    }
    if (!userData)
      throw new LuciaError("AUTH_INVALID_USER_ID");
    return {
      user: this.transformUserData(userData),
      session
    };
  };
  createUser = async (data) => {
    const userId = await this.generateUserId();
    const userAttributes = data.attributes ?? {};
    if (data.primaryKey === null) {
      const userData2 = await this.adapter.setUser(userId, userAttributes, null);
      const user2 = this.transformUserData(userData2);
      return user2;
    }
    const keyId = `${data.primaryKey.providerId}:${data.primaryKey.providerUserId}`;
    const password = data.primaryKey.password;
    const hashedPassword = password ? await this.hash.generate(password) : null;
    const userData = await this.adapter.setUser(userId, userAttributes, {
      id: keyId,
      user_id: userId,
      hashed_password: hashedPassword,
      primary: true,
      expires: null
    });
    const user = this.transformUserData(userData);
    return user;
  };
  updateUserAttributes = async (userId, attributes) => {
    const [userData] = await Promise.all([
      this.adapter.updateUserAttributes(userId, attributes),
      this.autoDatabaseCleanup ? await this.deleteDeadUserSessions(userId) : null
    ]);
    const user = this.transformUserData(userData);
    return user;
  };
  deleteUser = async (userId) => {
    await this.adapter.deleteSessionsByUserId(userId);
    await this.adapter.deleteKeysByUserId(userId);
    await this.adapter.deleteUser(userId);
  };
  useKey = async (providerId, providerUserId, password) => {
    const keyId = `${providerId}:${providerUserId}`;
    const shouldDataBeDeleted = async (data) => {
      const isPersistent = data.expires === null;
      if (isPersistent)
        return false;
      if (data.hashed_password === null)
        return true;
      if (password === null)
        return false;
      return await this.hash.validate(password, data.hashed_password);
    };
    const databaseKeyData = await this.adapter.getKey(keyId, shouldDataBeDeleted);
    if (!databaseKeyData)
      throw new LuciaError("AUTH_INVALID_KEY_ID");
    const isSingleUse = databaseKeyData.expires;
    if (isSingleUse) {
      const isValid = isWithinExpiration(databaseKeyData.expires);
      if (!isValid)
        throw new LuciaError("AUTH_EXPIRED_KEY");
    }
    const hashedPassword = databaseKeyData.hashed_password;
    if (hashedPassword) {
      if (!password)
        throw new LuciaError("AUTH_INVALID_PASSWORD");
      if (!hashedPassword)
        throw new LuciaError("AUTH_INVALID_PASSWORD");
      if (hashedPassword.startsWith("$2a"))
        throw new LuciaError("AUTH_OUTDATED_PASSWORD");
      const isValidPassword = await this.hash.validate(password, hashedPassword);
      if (!isValidPassword)
        throw new LuciaError("AUTH_INVALID_PASSWORD");
    }
    const key = transformDatabaseKey(databaseKeyData);
    return key;
  };
  getSession = async (sessionId) => {
    if (sessionId.length !== 40)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    const databaseSession = await this.adapter.getSession(sessionId);
    if (!databaseSession)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    const session = validateDatabaseSessionData(databaseSession);
    if (!session) {
      if (this.autoDatabaseCleanup) {
        await this.adapter.deleteSession(sessionId);
      }
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    }
    return session;
  };
  getAllUserSessions = async (userId) => {
    await this.getUser(userId);
    const databaseData = await this.adapter.getSessionsByUserId(userId);
    const storedUserSessions = databaseData.map((val) => {
      const session = validateDatabaseSessionData(val);
      if (session) {
        return {
          isValid: true,
          session
        };
      }
      return {
        isValid: false,
        sessionId: val.id
      };
    });
    if (storedUserSessions.some((val) => val.isValid === false)) {
      await Promise.all(storedUserSessions.filter((val) => val.isValid === false).map((val) => val));
    }
    const validUserSessions = storedUserSessions.map((val) => {
      return val.isValid ? val.session : null;
    }).filter((val) => val !== null);
    return validUserSessions;
  };
  validateSession = async (sessionId) => {
    const session = await this.getSession(sessionId);
    if (session.state === "active")
      return session;
    const renewedSession = await this.renewSession(sessionId);
    return renewedSession;
  };
  validateSessionUser = async (sessionId) => {
    const { session, user } = await this.getSessionUser(sessionId);
    if (session.state === "active")
      return { session, user };
    const renewedSession = await this.renewSession(sessionId);
    return {
      session: renewedSession,
      user
    };
  };
  generateSessionId = () => {
    const sessionId = generateRandomString(40);
    const activePeriodExpires = new Date((/* @__PURE__ */ new Date()).getTime() + this.sessionTimeout.activePeriod);
    const idlePeriodExpires = new Date(activePeriodExpires.getTime() + this.sessionTimeout.idlePeriod);
    return [sessionId, activePeriodExpires, idlePeriodExpires];
  };
  createSession = async (userId) => {
    const [sessionId, activePeriodExpires, idlePeriodExpires] = this.generateSessionId();
    await Promise.all([
      this.adapter.setSession({
        id: sessionId,
        user_id: userId,
        active_expires: activePeriodExpires.getTime(),
        idle_expires: idlePeriodExpires.getTime()
      }),
      this.autoDatabaseCleanup ? await this.deleteDeadUserSessions(userId) : null
    ]);
    return {
      userId,
      activePeriodExpires,
      sessionId,
      idlePeriodExpires,
      state: "active",
      isFresh: true
    };
  };
  renewSession = async (sessionId) => {
    if (sessionId.length !== 40)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    const sessionData = await this.adapter.getSession(sessionId);
    if (!sessionData)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    const session = validateDatabaseSessionData(sessionData);
    if (!session) {
      if (this.autoDatabaseCleanup) {
        await this.adapter.deleteSession(sessionId);
      }
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    }
    const [renewedSession] = await Promise.all([
      await this.createSession(session.userId),
      this.autoDatabaseCleanup ? await this.deleteDeadUserSessions(session.userId) : null
    ]);
    return renewedSession;
  };
  invalidateSession = async (sessionId) => {
    await this.adapter.deleteSession(sessionId);
  };
  invalidateAllUserSessions = async (userId) => {
    await this.adapter.deleteSessionsByUserId(userId);
  };
  deleteDeadUserSessions = async (userId) => {
    const sessions = await this.adapter.getSessionsByUserId(userId);
    const currentTime = (/* @__PURE__ */ new Date()).getTime();
    const deadSessionIds = sessions.filter((val) => val.idle_expires < currentTime).map((val) => val.id);
    if (deadSessionIds.length === 0)
      return;
    await this.adapter.deleteSession(...deadSessionIds);
  };
  validateRequestHeaders = (request) => {
    const cookies = parseCookie(request.headers.get("cookie") ?? "");
    const sessionId = cookies.auth_session ?? "";
    const checkForCsrf = request.method !== "GET" && request.method !== "HEAD";
    if (checkForCsrf && this.csrfProtection) {
      const origin = request.headers.get("Origin");
      if (!origin)
        throw new LuciaError("AUTH_INVALID_REQUEST");
      const url = new URL(request.url);
      if (url.origin !== origin)
        throw new LuciaError("AUTH_INVALID_REQUEST");
    }
    return sessionId;
  };
  createSessionCookies = (session) => {
    return this.sessionCookie.map((options) => createSessionCookie(session, this.ENV, options));
  };
  createKey = async (userId, keyData) => {
    const keyId = `${keyData.providerId}:${keyData.providerUserId}`;
    const hashedPassword = keyData.password ? await this.hash.generate(keyData.password) : null;
    if (keyData.type === "persistent") {
      await this.adapter.setKey({
        id: keyId,
        user_id: userId,
        hashed_password: hashedPassword,
        primary: false,
        expires: null
      });
      return {
        type: "persistent",
        providerId: keyData.providerId,
        providerUserId: keyData.providerUserId,
        isPrimary: false,
        isPasswordDefined: !!keyData.password,
        userId
      };
    }
    const oneTimeExpires = getOneTimeKeyExpiration(keyData.timeout);
    await this.adapter.setKey({
      id: keyId,
      user_id: userId,
      hashed_password: null,
      primary: false,
      expires: oneTimeExpires?.getTime() ?? null
    });
    return {
      type: "single_use",
      providerId: keyData.providerId,
      providerUserId: keyData.providerUserId,
      userId,
      expires: oneTimeExpires ?? null,
      isExpired: () => isWithinExpiration(keyData.timeout),
      isPasswordDefined: !!keyData.password
    };
  };
  deleteKey = async (providerId, providerUserId) => {
    const keyId = `${providerId}:${providerUserId}`;
    await this.adapter.deleteNonPrimaryKey(keyId);
  };
  getKey = async (providerId, providerUserId) => {
    const keyId = `${providerId}:${providerUserId}`;
    const shouldDataBeDeleted = async () => false;
    const keyData = await this.adapter.getKey(keyId, shouldDataBeDeleted);
    if (!keyData)
      throw new LuciaError("AUTH_INVALID_KEY_ID");
    const key = transformDatabaseKey(keyData);
    return key;
  };
  getAllUserKeys = async (userId) => {
    await this.getUser(userId);
    const databaseData = await this.adapter.getKeysByUserId(userId);
    return databaseData.map((val) => transformDatabaseKey(val));
  };
  updateKeyPassword = async (providerId, providerUserId, password) => {
    const keyId = `${providerId}:${providerUserId}`;
    if (password === null) {
      return await this.adapter.updateKeyPassword(keyId, null);
    }
    const hashedPassword = await this.hash.generate(password);
    await this.adapter.updateKeyPassword(keyId, hashedPassword);
  };
}
const auth = lucia({
  adapter: prisma(db),
  env: "PROD",
  transformUserData: (userData) => {
    return {
      userId: userData.id,
      username: userData.username
    };
  }
});
export {
  SESSION_COOKIE_NAME as S,
  auth as a
};
