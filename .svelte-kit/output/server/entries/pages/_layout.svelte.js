import { s as setContext, g as get_store_value, o as onDestroy, a as getContext, c as create_ssr_component, b as subscribe, e as escape, d as add_attribute, v as validate_component } from "../../chunks/index3.js";
import { p as page } from "../../chunks/stores.js";
import { d as derived } from "../../chunks/index2.js";
import "devalue";
import { m as modeCurrent, s as setInitialClassState } from "../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
const getUser = () => {
  const luciaContext = getContext("__lucia__");
  if (!luciaContext)
    throw new UndefinedError("__lucia__");
  return luciaContext;
};
const generateId = () => {
  const generateRandomNumber = () => {
    const randomNumber = Math.random();
    if (randomNumber !== 0)
      return randomNumber;
    return generateRandomNumber();
  };
  return generateRandomNumber().toString(36).slice(2, 7);
};
class UndefinedError extends Error {
  constructor(type) {
    const errorMsg = {
      "pageData._lucia": "page data property _lucia is undefined  - Make sure handleServerSession(auth) is set up inside the root +layout.server.ts",
      __lucia__: "context __lucia__ does not exist in your app - Make sure handleSession() is set inside the root +layout.svelte file"
    };
    super(errorMsg[type]);
  }
}
const handleSession = (pageStore, onSessionUpdate = () => {
}) => {
  const luciaStore = derived(pageStore, (val) => {
    const luciaPageData = val.data._lucia;
    if (luciaPageData === void 0)
      throw new UndefinedError("pageData._lucia");
    return luciaPageData;
  });
  const userStore = derived(luciaStore, (val) => val.user);
  setContext("__lucia__", userStore);
  if (typeof document === "undefined")
    return;
  const broadcastChannel = new BroadcastChannel("__lucia__");
  const tabId = generateId();
  let initialLuciaStoreSubscription = true;
  const luciaStoreUnsubscribe = luciaStore.subscribe((newVal) => {
    if (initialLuciaStoreSubscription)
      return initialLuciaStoreSubscription = false;
    broadcastChannel.postMessage({
      tabId,
      sessionChecksum: newVal.sessionChecksum
    });
  });
  broadcastChannel.addEventListener("message", ({ data }) => {
    const messageData = data;
    if (messageData.tabId === tabId)
      return;
    const currentLuciaContext = get_store_value(luciaStore);
    if (messageData.sessionChecksum === currentLuciaContext.sessionChecksum)
      return;
    onSessionUpdate(!!messageData.sessionChecksum);
  });
  onDestroy(() => {
    broadcastChannel.close();
    luciaStoreUnsubscribe();
  });
};
const cTrack = "cursor-pointer";
const cThumb = "aspect-square scale-[0.8] flex justify-center items-center";
const cIcon = "w-[70%] aspect-square";
const LightSwitch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let trackBg;
  let thumbBg;
  let thumbPosition;
  let iconFill;
  let classesTrack;
  let classesThumb;
  let classesIcon;
  let $modeCurrent, $$unsubscribe_modeCurrent;
  $$unsubscribe_modeCurrent = subscribe(modeCurrent, (value) => $modeCurrent = value);
  let { bgLight = "bg-surface-50" } = $$props;
  let { bgDark = "bg-surface-900" } = $$props;
  let { fillLight = "fill-surface-50" } = $$props;
  let { fillDark = "fill-surface-900" } = $$props;
  let { width = "w-12" } = $$props;
  let { height = "h-6" } = $$props;
  let { ring = "ring-[1px] ring-surface-500/30" } = $$props;
  let { rounded = "rounded-token" } = $$props;
  const cTransition = `transition-all duration-[200ms]`;
  const svgPath = {
    sun: "M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM352 256c0 53-43 96-96 96s-96-43-96-96s43-96 96-96s96 43 96 96zm32 0c0-70.7-57.3-128-128-128s-128 57.3-128 128s57.3 128 128 128s128-57.3 128-128z",
    moon: "M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"
  };
  if ($$props.bgLight === void 0 && $$bindings.bgLight && bgLight !== void 0)
    $$bindings.bgLight(bgLight);
  if ($$props.bgDark === void 0 && $$bindings.bgDark && bgDark !== void 0)
    $$bindings.bgDark(bgDark);
  if ($$props.fillLight === void 0 && $$bindings.fillLight && fillLight !== void 0)
    $$bindings.fillLight(fillLight);
  if ($$props.fillDark === void 0 && $$bindings.fillDark && fillDark !== void 0)
    $$bindings.fillDark(fillDark);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.ring === void 0 && $$bindings.ring && ring !== void 0)
    $$bindings.ring(ring);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  trackBg = $modeCurrent === true ? bgLight : bgDark;
  thumbBg = $modeCurrent === true ? bgDark : bgLight;
  thumbPosition = $modeCurrent === true ? "translate-x-[100%]" : "";
  iconFill = $modeCurrent === true ? fillLight : fillDark;
  classesTrack = `${cTrack} ${cTransition} ${width} ${height} ${ring} ${rounded} ${trackBg} ${$$props.class ?? ""}`;
  classesThumb = `${cThumb} ${cTransition} ${height} ${rounded} ${thumbBg} ${thumbPosition}`;
  classesIcon = `${cIcon} ${iconFill}`;
  $$unsubscribe_modeCurrent();
  return `${$$result.head += `<!-- HEAD_svelte-gewkj4_START --><!-- HTML_TAG_START -->${`<script nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();<\/script>`}<!-- HTML_TAG_END --><!-- HEAD_svelte-gewkj4_END -->`, ""}

<div class="${"lightswitch-track " + escape(classesTrack, true)}" role="switch" aria-label="Light Switch"${add_attribute("aria-checked", $modeCurrent, 0)} title="${"Toggle " + escape($modeCurrent === true ? "Dark" : "Light", true) + " Mode"}" tabindex="0">
	<div class="${"lightswitch-thumb " + escape(classesThumb, true)}">
		<svg class="${"lightswitch-icon " + escape(classesIcon, true)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path${add_attribute("d", $modeCurrent ? svgPath.sun : svgPath.moon, 0)}></path></svg></div></div>`;
});
const Heading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  const user = getUser();
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_user();
  return `<nav class="container mt-8 flex justify-between"><a class="unstyled text-xl" href="/"><h1>🍗 Southern Fried Zen</h1></a>

	<div class="flex items-center gap-4"><ol class="flex space-x-4"><li><a class="unstyled muted" href="/blog">Blog</a></li>
			<li><a class="unstyled muted" href="/dashboard">Dashboard</a></li>
			<li><a class="unstyled muted" href="/about">About</a></li>

			${$user ? `<li><form method="POST" action="/logout"><button class="muted" type="submit">Log out</button></form></li>` : ``}</ol>

		${validate_component(LightSwitch, "LightSwitch").$$render($$result, {}, {}, {})}</div></nav>`;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="container mt-32"><hr>

	<footer class="py-8"><nav class="flex space-x-32"><ol class="space-y-4"><li><a class="unstyled muted" href="/">Home</a></li>
				<li><a class="unstyled muted" href="/about">About</a></li>
				<li><a class="unstyled muted" href="/newsletter">Newsletter</a></li>
				<li><a class="unstyled muted" href="/rss.xml">RSS</a></li></ol>

			<ol class="space-y-4"><li><a class="unstyled muted" href="https://twitter.com/joyofcodedev">Twitter
					</a></li>
				<li><a class="unstyled muted" href="https://www.youtube.com/@joyofcodedev">YouTube
					</a></li>
				<li><a class="unstyled muted" href="https://github.com/mattcroat">GitHub
					</a></li></ol></nav></footer></div>`;
});
const themeCrimson = "";
const all = "";
const app = "";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  handleSession(page);
  return `${$$result.head += `<!-- HEAD_svelte-gu92bk_START -->${$$result.title = `<title>Blog</title>`, ""}<link rel="icon" href="https://fav.farm/🔥"><!-- HEAD_svelte-gu92bk_END -->`, ""}

${validate_component(Heading, "Heading").$$render($$result, {}, {}, {})}
${slots.default ? slots.default({}) : ``}
${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
export {
  Layout as default
};
