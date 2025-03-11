import * as devalue from "devalue";
import { stringify } from "devalue";
import { p as page } from "./stores.js";
import { w as writable, d as derived } from "./index2.js";
import { g as get_store_value, t as tick } from "./index3.js";
import { D as DEV } from "./false.js";
const browser = DEV;
function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate" || key === "on_navigate") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
const invalidateAll = /* @__PURE__ */ client_method("invalidate_all");
function applyAction(result) {
  {
    throw new Error("Cannot call applyAction(...) on the server");
  }
}
function deserialize(result) {
  const parsed = JSON.parse(result);
  if (parsed.data) {
    parsed.data = devalue.parse(parsed.data);
  }
  return parsed;
}
function clone(element) {
  return (
    /** @type {T} */
    HTMLElement.prototype.cloneNode.call(element)
  );
}
function enhance(form_element, submit = () => {
}) {
  const fallback_callback = async ({
    action,
    result,
    reset = true,
    invalidateAll: shouldInvalidateAll = true
  }) => {
    if (result.type === "success") {
      if (reset) {
        HTMLFormElement.prototype.reset.call(form_element);
      }
      if (shouldInvalidateAll) {
        await invalidateAll();
      }
    }
    if (location.origin + location.pathname === action.origin + action.pathname || result.type === "redirect" || result.type === "error") {
      applyAction();
    }
  };
  async function handle_submit(event) {
    const method = event.submitter?.hasAttribute("formmethod") ? (
      /** @type {HTMLButtonElement | HTMLInputElement} */
      event.submitter.formMethod
    ) : clone(form_element).method;
    if (method !== "post")
      return;
    event.preventDefault();
    const action = new URL(
      // We can't do submitter.formAction directly because that property is always set
      event.submitter?.hasAttribute("formaction") ? (
        /** @type {HTMLButtonElement | HTMLInputElement} */
        event.submitter.formAction
      ) : clone(form_element).action
    );
    const form_data = new FormData(form_element);
    const submitter_name = event.submitter?.getAttribute("name");
    if (submitter_name) {
      form_data.append(submitter_name, event.submitter?.getAttribute("value") ?? "");
    }
    const controller = new AbortController();
    let cancelled = false;
    const cancel = () => cancelled = true;
    const callback = await submit({
      action,
      cancel,
      controller,
      get data() {
        return form_data;
      },
      formData: form_data,
      get form() {
        return form_element;
      },
      formElement: form_element,
      submitter: event.submitter
    }) ?? fallback_callback;
    if (cancelled)
      return;
    let result;
    try {
      const response = await fetch(action, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-sveltekit-action": "true"
        },
        cache: "no-store",
        body: form_data,
        signal: controller.signal
      });
      result = deserialize(await response.text());
      if (result.type === "error")
        result.status = response.status;
    } catch (error) {
      if (
        /** @type {any} */
        error?.name === "AbortError"
      )
        return;
      result = { type: "error", error };
    }
    callback({
      action,
      get data() {
        return form_data;
      },
      formData: form_data,
      get form() {
        return form_element;
      },
      formElement: form_element,
      update: (opts) => fallback_callback({
        action,
        result,
        reset: opts?.reset,
        invalidateAll: opts?.invalidateAll
      }),
      // @ts-expect-error generic constraints stuff we don't care about
      result
    });
  }
  HTMLFormElement.prototype.addEventListener.call(form_element, "submit", handle_submit);
  return {
    destroy() {
      HTMLFormElement.prototype.removeEventListener.call(form_element, "submit", handle_submit);
    }
  };
}
const isElementInViewport = (el, topOffset = 0) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= topOffset && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
};
const scrollToAndCenter = (el, offset = 1.125, behavior = "smooth") => {
  const elementRect = el.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const top = absoluteElementTop - window.innerHeight / (2 * offset);
  window.scrollTo({ left: 0, top, behavior });
};
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  } else if (obj1 === null || obj2 === null) {
    return false;
  } else if (typeof obj1 === "object" && typeof obj2 === "object") {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (const prop in obj1) {
      if (!deepEqual(obj1[prop], obj2[prop])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
var FetchStatus;
(function(FetchStatus2) {
  FetchStatus2[FetchStatus2["Idle"] = 0] = "Idle";
  FetchStatus2[FetchStatus2["Submitting"] = 1] = "Submitting";
  FetchStatus2[FetchStatus2["Delayed"] = 2] = "Delayed";
  FetchStatus2[FetchStatus2["Timeout"] = 3] = "Timeout";
})(FetchStatus || (FetchStatus = {}));
const defaultFormOptions = {
  applyAction: true,
  invalidateAll: true,
  resetForm: false,
  autoFocusOnError: "detect",
  scrollToError: "smooth",
  errorSelector: "[data-invalid]",
  stickyNavbar: void 0,
  taintedMessage: "Do you want to leave this page? Changes you made may not be saved.",
  onSubmit: void 0,
  onResult: void 0,
  onUpdate: void 0,
  onUpdated: void 0,
  onError: "set-message",
  dataType: "form",
  validators: void 0,
  defaultValidator: "clear",
  clearOnSubmit: "errors-and-message",
  delayMs: 500,
  timeoutMs: 8e3,
  multipleSubmits: "prevent"
};
function superForm(form, options = {}) {
  options = { ...defaultFormOptions, ...options };
  function emptyForm() {
    return {
      valid: false,
      errors: {},
      data: {},
      empty: true,
      message: null,
      constraints: {}
    };
  }
  function findForms(data) {
    return Object.values(data).filter((v) => isValidationObject(v) !== false);
  }
  function isValidationObject(object) {
    if (!object || typeof object !== "object")
      return false;
    if (!("valid" in object && "empty" in object && typeof object.valid === "boolean")) {
      return false;
    }
    return "id" in object && typeof object.id === "string" ? object.id : void 0;
  }
  if (typeof form === "string" && typeof options.id === "string") {
    throw new Error("You cannot specify an id in the first superForm argument and in the options.");
  }
  const formId = typeof form === "string" ? form : options.id ?? form?.id;
  const actionForm = get_store_value(page).form;
  if (options.applyAction && actionForm) {
    const postedFormId = isValidationObject(actionForm.form);
    if (postedFormId === false) {
      throw new Error("ActionData didn't return a Validation object. Make sure you return { form } in the form actions.");
    }
    if (postedFormId === formId)
      form = actionForm.form;
  }
  if (!form || typeof form === "string") {
    form = emptyForm();
  }
  const initialForm = {
    ...form,
    data: { ...form.data },
    errors: { ...form.errors },
    constraints: { ...form.constraints }
  };
  const Valid = writable(form.valid);
  const Empty = writable(form.empty);
  const Message = writable(form.message);
  const Errors = writable({ ...form.errors });
  const Data = writable({ ...form.data });
  const Constraints = writable({ ...form.constraints });
  const Submitting = writable(false);
  const Delayed = writable(false);
  const Timeout = writable(false);
  const AllErrors = derived(Errors, ($errors) => {
    if (!$errors)
      return [];
    return Object.entries($errors).flatMap(([key, errors]) => errors?.map((value) => ({ key, value })) ?? []);
  });
  const FirstError = derived(AllErrors, ($allErrors) => $allErrors[0] ?? null);
  const Tainted = derived(Data, ($d) => savedForm ? isTainted($d) : false);
  if (typeof initialForm.valid !== "boolean") {
    throw new Error("A non-validation object was passed to superForm. Check what's passed to its first parameter (null is allowed).");
  }
  let savedForm;
  const _taintedMessage = options.taintedMessage;
  options.taintedMessage = void 0;
  function enableTaintedMessage() {
    options.taintedMessage = _taintedMessage;
    savedForm = { ...get_store_value(Data) };
  }
  function isTainted(data) {
    return !deepEqual(data, savedForm);
  }
  function rebind(form2, untaint, message) {
    if (untaint) {
      savedForm = { ...form2.data };
    }
    Data.set(form2.data);
    Message.set(message ?? form2.message);
    Empty.set(form2.empty);
    Valid.set(form2.valid);
    Errors.set(form2.errors);
  }
  async function _update(form2, untaint) {
    if (options.onUpdate) {
      let cancelled = false;
      await options.onUpdate({
        form: form2,
        cancel: () => cancelled = true
      });
      if (cancelled) {
        cancelFlash();
        return;
      }
    }
    if (form2.valid && options.resetForm) {
      _resetForm(form2.message);
    } else {
      rebind(form2, untaint, null);
    }
    if (options.onUpdated) {
      options.onUpdated({ form: form2 });
    }
  }
  function _resetForm(message) {
    rebind(initialForm, true, message);
  }
  const Data_update = async (result, untaint) => {
    if (result.type == "error") {
      throw new Error(`ActionResult of type "${result.type}" cannot be passed to update function.`);
    }
    if (result.type == "redirect") {
      if (options.resetForm)
        _resetForm(null);
      return;
    }
    if (typeof result.data !== "object") {
      throw new Error("Non-object validation data returned from ActionResult.");
    }
    const forms = findForms(result.data);
    if (!forms.length) {
      throw new Error("No form data returned from ActionResult. Make sure you return { form } in the form actions.");
    }
    for (const newForm of forms) {
      if (newForm.id !== formId)
        continue;
      await _update(newForm, untaint ?? (result.status >= 200 && result.status < 300));
    }
  };
  function cancelFlash() {
    if (options.flashMessage && browser)
      document.cookie = `flash=; Max-Age=0; Path=/;`;
  }
  return {
    form: Data,
    errors: Errors,
    message: Message,
    constraints: Constraints,
    fields: derived([Data, Errors, Constraints], ([$D, $E, $C]) => {
      return Object.keys($D).map((key) => ({
        name: key,
        value: $D[key],
        errors: $E[key],
        constraints: $C[key],
        type: initialForm.meta ? initialForm.meta.types[key] : void 0
      }));
    }),
    tainted: derived(Tainted, ($t) => $t),
    valid: derived(Valid, ($s) => $s),
    empty: derived(Empty, ($e) => $e),
    submitting: derived(Submitting, ($s) => $s),
    delayed: derived(Delayed, ($d) => $d),
    timeout: derived(Timeout, ($t) => $t),
    enhance: (el) => formEnhance(el, Submitting, Delayed, Timeout, Errors, Data_update, options, Data, Message, enableTaintedMessage, cancelFlash),
    firstError: FirstError,
    allErrors: AllErrors,
    update: Data_update,
    reset: (options2) => _resetForm(options2?.keepMessage ? get_store_value(Message) : null)
  };
}
function formEnhance(formEl, submitting, delayed, timeout, errors, Data_update, options, data, message, enableTaintedForm, cancelFlash) {
  enableTaintedForm();
  function Form(formEl2) {
    function rebind() {
      Form2 = formEl2;
    }
    let Form2;
    function Form_shouldAutoFocus(userAgent) {
      if (typeof options.autoFocusOnError === "boolean")
        return options.autoFocusOnError;
      else
        return !/iPhone|iPad|iPod|Android/i.test(userAgent);
    }
    const Form_scrollToFirstError = async () => {
      if (options.scrollToError == "off")
        return;
      const selector = options.errorSelector;
      if (!selector)
        return;
      await tick();
      let el;
      el = Form2.querySelector(selector);
      if (!el)
        return;
      el = el.querySelector(selector) ?? el;
      const nav = options.stickyNavbar ? document.querySelector(options.stickyNavbar) : null;
      if (!isElementInViewport(el, nav?.offsetHeight ?? 0)) {
        scrollToAndCenter(el, void 0, options.scrollToError);
      }
      if (!Form_shouldAutoFocus(navigator.userAgent))
        return;
      let focusEl;
      focusEl = el;
      if (!["INPUT", "SELECT", "BUTTON", "TEXTAREA"].includes(focusEl.tagName)) {
        focusEl = focusEl.querySelector('input:not([type="hidden"]):not(.flatpickr-input), select, textarea');
      }
      try {
        focusEl?.focus({ preventScroll: true });
      } catch (err) {
      }
    };
    {
      let state = FetchStatus.Idle;
      let delayedTimeout, timeoutTimeout;
      const setState = (s) => {
        state = s;
        submitting.set(state >= FetchStatus.Submitting);
        delayed.set(state >= FetchStatus.Delayed);
        timeout.set(state >= FetchStatus.Timeout);
      };
      return {
        submitting: () => {
          rebind();
          setState(state != FetchStatus.Delayed ? FetchStatus.Submitting : FetchStatus.Delayed);
          if (delayedTimeout)
            clearTimeout(delayedTimeout);
          if (timeoutTimeout)
            clearTimeout(timeoutTimeout);
          delayedTimeout = window.setTimeout(() => {
            if (state == FetchStatus.Submitting)
              setState(FetchStatus.Delayed);
          }, options.delayMs);
          timeoutTimeout = window.setTimeout(() => {
            if (state == FetchStatus.Delayed)
              setState(FetchStatus.Timeout);
          }, options.timeoutMs);
        },
        completed: (cancelled) => {
          if (delayedTimeout)
            clearTimeout(delayedTimeout);
          if (timeoutTimeout)
            clearTimeout(timeoutTimeout);
          delayedTimeout = timeoutTimeout = 0;
          setState(FetchStatus.Idle);
          if (!cancelled)
            Form_scrollToFirstError();
        },
        isSubmitting: () => state === FetchStatus.Submitting || state === FetchStatus.Delayed
      };
    }
  }
  const htmlForm = Form(formEl);
  let currentRequest;
  return enhance(formEl, async (submit) => {
    let cancelled = false;
    if (htmlForm.isSubmitting() && options.multipleSubmits == "prevent") {
      cancelled = true;
      submit.cancel();
    } else {
      if (htmlForm.isSubmitting() && options.multipleSubmits == "abort") {
        if (currentRequest)
          currentRequest.abort();
      }
      currentRequest = submit.controller;
      if (options.onSubmit) {
        const submit2 = {
          ...submit,
          cancel: () => {
            cancelled = true;
            return submit.cancel();
          }
        };
        options.onSubmit(submit2);
      }
    }
    if (cancelled) {
      cancelFlash();
    } else {
      switch (options.clearOnSubmit) {
        case "errors-and-message":
          errors.set({});
          message.set(null);
          break;
        case "errors":
          errors.set({});
          break;
        case "message":
          message.set(null);
          break;
      }
      if (options.flashMessage && (options.clearOnSubmit == "errors-and-message" || options.clearOnSubmit == "message")) {
        options.flashMessage.module.getFlash(page).set(void 0);
      }
      htmlForm.submitting();
      switch (options.dataType) {
        case "json":
          submit.data.set("__superform_json", stringify(get_store_value(data)));
          break;
        case "formdata":
          for (const [key, value] of Object.entries(get_store_value(data))) {
            submit.data.set(key, value instanceof Blob ? value : `${value || ""}`);
          }
          break;
      }
    }
    return async ({ result }) => {
      currentRequest = null;
      let cancelled2 = false;
      if (options.onResult) {
        await options.onResult({
          result,
          update: Data_update,
          formEl,
          cancel: () => cancelled2 = true
        });
      }
      if (!cancelled2) {
        const status = Math.floor(result.status || 500);
        let errorMessage = void 0;
        if (result.type !== "error") {
          if (result.type === "success" && options.invalidateAll) {
            await invalidateAll();
          }
          if (options.applyAction) {
            await applyAction();
          } else {
            await Data_update(result);
          }
        } else {
          if (options.applyAction) {
            if (options.onError == "apply") {
              await applyAction();
            } else {
              await applyAction();
            }
          }
          if (options.onError == "ignore")
            ;
          else if (options.onError == "set-message") {
            message.set(errorMessage = result.error.message !== void 0 ? result.error.message : `Error: ${status}`);
          } else if (typeof options.onError === "string") {
            message.set(errorMessage = options.onError);
          } else if (options.onError) {
            await options.onError(result, message);
          }
        }
        if (options.flashMessage) {
          if (result.type == "error" && options.flashMessage.onError) {
            if (errorMessage && result.error && typeof result.error === "object" && "message" in result.error) {
              result.error.message = errorMessage;
            }
            options.flashMessage.module.getFlash(page).set(options.flashMessage.onError({
              ...result,
              status: result.status ?? status
            }));
          } else if (result.type != "error") {
            options.flashMessage.module.updateFlash(page);
          }
        }
      } else {
        cancelFlash();
      }
      htmlForm.completed(cancelled2);
    };
  });
}
export {
  superForm as s
};
