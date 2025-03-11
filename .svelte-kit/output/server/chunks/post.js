import { c as create_ssr_component, k as compute_rest_props, l as createEventDispatcher, d as add_attribute, e as escape, h as spread, i as escape_attribute_value, j as escape_object, n as compute_slots, b as subscribe, v as validate_component } from "./index3.js";
import { s as superForm } from "./index4.js";
import "./ProgressBar.svelte_svelte_type_style_lang.js";
import "@toast-ui/editor";
const cBase = "inline-block";
const cLabel = "unstyled flex items-center";
const cTrack = "flex transition-all duration-[200ms] cursor-pointer";
const cThumb = "w-[50%] h-full scale-[0.8] transition-all duration-[200ms] shadow";
const SlideToggle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cTrackActive;
  let cThumbBackground;
  let cThumbPos;
  let classesDisabled;
  let classesBase;
  let classesLabel;
  let classesTrack;
  let classesThumb;
  let $$restProps = compute_rest_props($$props, ["name", "checked", "size", "background", "active", "border", "rounded", "label"]);
  let $$slots = compute_slots(slots);
  createEventDispatcher();
  let { name } = $$props;
  let { checked = false } = $$props;
  let { size = "md" } = $$props;
  let { background = "bg-surface-400 dark:bg-surface-700" } = $$props;
  let { active = "bg-surface-900 dark:bg-surface-300" } = $$props;
  let { border = "" } = $$props;
  let { rounded = "rounded-full" } = $$props;
  let { label = "" } = $$props;
  let trackSize;
  switch (size) {
    case "sm":
      trackSize = "w-12 h-6";
      break;
    case "lg":
      trackSize = "w-20 h-10";
      break;
    default:
      trackSize = "w-16 h-8";
  }
  function prunedRestProps() {
    delete $$restProps.class;
    return $$restProps;
  }
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.background === void 0 && $$bindings.background && background !== void 0)
    $$bindings.background(background);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  cTrackActive = checked ? active : `${background} cursor-pointer`;
  cThumbBackground = checked ? "bg-white/75" : "bg-white";
  cThumbPos = checked ? "translate-x-full" : "";
  classesDisabled = $$props.disabled === true ? "opacity-50" : "hover:brightness-[105%] dark:hover:brightness-110 cursor-pointer";
  classesBase = `${cBase} ${rounded} ${classesDisabled} ${$$props.class ?? ""}`;
  classesLabel = `${cLabel}`;
  classesTrack = `${cTrack} ${border} ${rounded} ${trackSize} ${cTrackActive}`;
  classesThumb = `${cThumb} ${rounded} ${cThumbBackground} ${cThumbPos}`;
  return `<div${add_attribute("id", label, 0)} class="${"slide-toggle " + escape(classesBase, true)}" data-testid="slide-toggle" role="switch"${add_attribute("aria-label", label, 0)}${add_attribute("aria-checked", checked, 0)} tabindex="0"><label class="${"slide-toggle-label " + escape(classesLabel, true)}">
		<input${spread(
    [
      { type: "checkbox" },
      { class: "slide-toggle-input hidden" },
      { name: escape_attribute_value(name) },
      escape_object(prunedRestProps()),
      { disabled: $$props.disabled || null }
    ],
    {}
  )}${add_attribute("checked", checked, 1)}>
		
		<div class="${[
    "slide-toggle-track " + escape(classesTrack, true),
    $$props.disabled ? "cursor-not-allowed" : ""
  ].join(" ").trim()}"><div class="${[
    "slide-toggle-thumb " + escape(classesThumb, true),
    $$props.disabled ? "cursor-not-allowed" : ""
  ].join(" ").trim()}"></div></div>
		
		${$$slots.default ? `<div class="slide-toggle-text ml-3">${slots.default ? slots.default({}) : ``}</div>` : ``}</label></div>`;
});
const toastuiEditor = "";
const editor_svelte_svelte_type_style_lang = "";
const css = {
  code: "#editor.svelte-1gjzyeq{overflow:hidden;border-radius:1rem;--tw-bg-opacity:1;background-color:rgb(248 250 252 / var(--tw-bg-opacity, 1))\n}",
  map: null
};
const Editor_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { markdown } = $$props;
  if ($$props.markdown === void 0 && $$bindings.markdown && markdown !== void 0)
    $$bindings.markdown(markdown);
  $$result.css.add(css);
  return `${``}

<div><div id="editor" class="svelte-1gjzyeq"></div>
	<textarea name="markdown" hidden>${escape(markdown || "")}</textarea>
</div>`;
});
const Post = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $form, $$unsubscribe_form;
  let $errors, $$unsubscribe_errors;
  let $constraints, $$unsubscribe_constraints;
  let { data } = $$props;
  const { form, errors, constraints, enhance } = superForm(data);
  $$unsubscribe_form = subscribe(form, (value) => $form = value);
  $$unsubscribe_errors = subscribe(errors, (value) => $errors = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  let isDraft = $form.published;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="card mt-8 p-8"><form method="POST" class="space-y-6"><label class="label" for="title"><span class="block">Title</span>
			<input${spread(
      [
        { class: "input" },
        { type: "text" },
        { name: "title" },
        { id: "title" },
        {
          "data-invalid": escape_attribute_value($errors.title)
        },
        escape_object($constraints.slug)
      ],
      {
        classes: $errors.title ? "input-error" : ""
      }
    )}${add_attribute("value", $form.title, 0)}></label>
		${$errors.title ? `<span class="text-red-400">${escape($errors.title)}</span>` : ``}

		<label class="label" for="slug"><span>Slug</span>
			<input${spread(
      [
        { class: "input" },
        { type: "text" },
        { name: "slug" },
        { id: "slug" },
        {
          "data-invalid": escape_attribute_value($errors.slug)
        },
        escape_object($constraints.slug)
      ],
      {
        classes: $errors.slug ? "input-error" : ""
      }
    )}${add_attribute("value", $form.slug, 0)}></label>
		${$errors.slug ? `<span class="text-red-400">${escape($errors.slug)}</span>` : ``}

		<label class="label" for="description"><span>Description</span>
			<input${spread(
      [
        { class: "input mt-2" },
        { type: "text" },
        { name: "description" },
        { id: "description" },
        {
          "data-invalid": escape_attribute_value($errors.description)
        },
        escape_object($constraints.description)
      ],
      {
        classes: $errors.description ? "input-error" : ""
      }
    )}${add_attribute("value", $form.description, 0)}></label>
		${$errors.description ? `<span class="text-red-400">${escape($errors.description)}</span>` : ``}

		<div class="space-y-2"><p>Markdown</p>
			${validate_component(Editor_1, "Editor").$$render($$result, { markdown: $form.markdown }, {}, {})}</div>

		<div>${validate_component(SlideToggle, "SlideToggle").$$render(
      $$result,
      { name: "published", checked: isDraft },
      {
        checked: ($$value) => {
          isDraft = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Published
			`;
        }
      }
    )}</div>

		<button class="btn variant-filled" type="submit">Submit</button></form></div>`;
  } while (!$$settled);
  $$unsubscribe_form();
  $$unsubscribe_errors();
  $$unsubscribe_constraints();
  return $$rendered;
});
export {
  Post as P
};
