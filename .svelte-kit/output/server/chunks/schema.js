import "./index.js";
import { parse } from "devalue";
import { ZodString, ZodNumber, ZodBoolean, ZodArray, ZodObject, ZodBigInt, ZodSymbol, ZodNullable, ZodDefault, ZodOptional, ZodEffects, ZodDate, ZodLiteral, ZodUnion, ZodEnum, ZodAny, ZodNativeEnum, z } from "zod";
function hashCode(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  if (hash < 0)
    hash = hash >>> 0;
  return hash.toString(36);
}
function entityHash(meta2) {
  return hashCode(JSON.stringify(meta2.types));
}
function entityData(schema) {
  const cached = getCached(schema);
  if (cached)
    return cached;
  const typeInfos = typeInfo(schema);
  const defaultEnt = defaultEntity(schema);
  const metaData = meta(schema);
  const entity = {
    typeInfo: typeInfos,
    defaultEntity: defaultEnt,
    constraints: constraints(schema, typeInfos),
    meta: metaData,
    hash: entityHash(metaData),
    keys: Object.keys(schema.keyof().Values)
  };
  setCached(schema, entity);
  return entity;
}
function setCached(schema, entity) {
  entityCache.set(schema, entity);
}
function getCached(schema) {
  return entityCache.get(schema);
}
const entityCache = /* @__PURE__ */ new WeakMap();
function zodTypeInfo(zodType) {
  let _wrapped = true;
  let isNullable = false;
  let isOptional = false;
  let hasDefault = false;
  let defaultValue = void 0;
  while (_wrapped) {
    if (zodType instanceof ZodNullable) {
      isNullable = true;
      zodType = zodType.unwrap();
    } else if (zodType instanceof ZodDefault) {
      hasDefault = true;
      defaultValue = zodType._def.defaultValue();
      zodType = zodType._def.innerType;
    } else if (zodType instanceof ZodOptional) {
      isOptional = true;
      zodType = zodType.unwrap();
    } else if (zodType instanceof ZodEffects) {
      zodType = zodType._def.schema;
    } else {
      _wrapped = false;
    }
  }
  return {
    zodType,
    isNullable,
    isOptional,
    hasDefault,
    defaultValue
  };
}
function typeInfo(schema) {
  return _mapSchema(schema, (obj) => zodTypeInfo(obj));
}
function checkMissingFields(schema, data) {
  const entity = entityData(schema);
  const missingFields = Object.keys(entity.constraints).filter((field) => {
    if (!entity.constraints[field]?.required)
      return false;
    if (entity.typeInfo[field].hasDefault || entity.defaultEntity[field] !== void 0) {
      return false;
    }
    return !data || data[field] === void 0 || data[field] === null;
  });
  if (missingFields.length) {
    const errors = missingFields.map((field) => `"${String(field)}" (${entity.typeInfo[field].zodType.constructor.name})`);
    throw new Error(`Unsupported default value for schema field(s): ${errors.join(", ")}. Add default, optional or nullable to those fields in the schema.`);
  }
}
function valueOrDefault(value, strict, implicitDefaults, schemaInfo) {
  if (value)
    return value;
  const { zodType, isNullable, isOptional, hasDefault, defaultValue } = schemaInfo;
  if (strict && value !== void 0)
    return value;
  if (hasDefault)
    return defaultValue;
  if (isNullable)
    return null;
  if (isOptional)
    return void 0;
  if (implicitDefaults) {
    if (zodType instanceof ZodString)
      return "";
    if (zodType instanceof ZodNumber)
      return 0;
    if (zodType instanceof ZodBoolean)
      return false;
    if (zodType instanceof ZodArray)
      return [];
    if (zodType instanceof ZodObject)
      return defaultEntity(zodType);
    if (zodType instanceof ZodBigInt)
      return BigInt(0);
    if (zodType instanceof ZodSymbol)
      return Symbol();
  }
  return void 0;
}
function defaultEntity(schema) {
  const fields = Object.keys(schema.keyof().Values);
  let output = {};
  const schemaTypeInfo = typeInfo(schema);
  output = Object.fromEntries(fields.map((field) => {
    const typeInfo2 = schemaTypeInfo[field];
    const newValue = valueOrDefault(void 0, true, true, typeInfo2);
    return [field, newValue];
  }));
  return output;
}
function constraints(schema, typeInfo2) {
  function constraint(key, info) {
    const zodType = info.zodType;
    const output = {};
    if (zodType instanceof ZodString) {
      const patterns = zodType._def.checks.filter((f) => f.kind == "regex");
      if (patterns.length > 1) {
        throw new Error(`Error on field "${key}": Only one regex is allowed per field.`);
      }
      const pattern = patterns.length == 1 && patterns[0].kind == "regex" ? patterns[0].regex.source : void 0;
      if (pattern)
        output.pattern = pattern;
      if (zodType.minLength !== null)
        output.minlength = zodType.minLength;
      if (zodType.maxLength !== null)
        output.maxlength = zodType.maxLength;
    } else if (zodType instanceof ZodNumber) {
      const steps = zodType._def.checks.filter((f) => f.kind == "multipleOf");
      if (steps.length > 1) {
        throw new Error(`Error on field "${key}": Only one multipleOf is allowed per field.`);
      }
      const step = steps.length == 1 && steps[0].kind == "multipleOf" ? steps[0].value : null;
      if (zodType.minValue !== null)
        output.min = zodType.minValue;
      if (zodType.maxValue !== null)
        output.max = zodType.maxValue;
      if (step !== null)
        output.step = step;
    } else if (zodType instanceof ZodDate) {
      if (zodType.minDate)
        output.min = zodType.minDate.toISOString();
      if (zodType.maxDate)
        output.max = zodType.maxDate.toISOString();
    }
    if (!info.isNullable && !info.isOptional) {
      output.required = true;
    }
    return Object.keys(output).length > 0 ? output : void 0;
  }
  return _mapSchema(schema, (_, key) => {
    return constraint(key, typeInfo2[key]);
  }, (constraint2) => !!constraint2);
}
function meta(schema) {
  return {
    types: _mapSchema(schema, (obj) => {
      let type = zodTypeInfo(obj).zodType;
      let name = "";
      let depth = 0;
      while (type instanceof ZodArray) {
        name += "ZodArray<";
        depth++;
        type = type._def.type;
      }
      return name + type.constructor.name + ">".repeat(depth);
    })
  };
}
function _mapSchema(schema, factory, filter) {
  const keys = schema.keyof().Values;
  return Object.fromEntries(Object.keys(keys).map((key) => [key, factory(schema.shape[key], key)]).filter((entry) => filter ? filter(entry[1]) : true));
}
function formDataToValidation(schema, fields, data) {
  const output = {};
  const entityInfo = entityData(schema);
  function parseSingleEntry(key, entry) {
    if (entry && typeof entry !== "string") {
      return void 0;
    } else {
      return parseEntry(key, entry, entityInfo.typeInfo[key]);
    }
  }
  for (const key of fields) {
    const typeInfo2 = entityInfo.typeInfo[key];
    const entries = data.getAll(key);
    if (!(typeInfo2.zodType instanceof ZodArray)) {
      output[key] = parseSingleEntry(key, entries[0]);
    } else {
      output[key] = entries.map((e) => parseSingleEntry(key, e));
    }
  }
  function parseEntry(field, value, typeInfo2) {
    const newValue = valueOrDefault(value, false, true, typeInfo2);
    if (!value)
      return newValue;
    const zodType = typeInfo2.zodType;
    if (zodType instanceof ZodString) {
      return value;
    } else if (zodType instanceof ZodNumber) {
      return zodType.isInt ? parseInt(value ?? "", 10) : parseFloat(value ?? "");
    } else if (zodType instanceof ZodBoolean) {
      return Boolean(value).valueOf();
    } else if (zodType instanceof ZodDate) {
      return new Date(value ?? "");
    } else if (zodType instanceof ZodArray) {
      const arrayType = zodTypeInfo(zodType._def.type);
      return parseEntry(field, value, arrayType);
    } else if (zodType instanceof ZodBigInt) {
      try {
        return BigInt(value ?? ".");
      } catch {
        return NaN;
      }
    } else if (zodType instanceof ZodLiteral) {
      const literalType = typeof zodType.value;
      if (literalType === "string")
        return value;
      else if (literalType === "number")
        return parseFloat(value ?? "");
      else if (literalType === "boolean")
        return Boolean(value).valueOf();
      else {
        throw new Error("Unsupported ZodLiteral type: " + literalType);
      }
    } else if (zodType instanceof ZodUnion || zodType instanceof ZodEnum || zodType instanceof ZodAny) {
      return value;
    } else if (zodType instanceof ZodNativeEnum) {
      if (value in zodType.enum) {
        const enumValue = zodType.enum[value];
        if (typeof enumValue === "number")
          return enumValue;
        else if (enumValue in zodType.enum)
          return zodType.enum[enumValue];
      }
      return void 0;
    } else if (zodType instanceof ZodSymbol) {
      return Symbol(value);
    }
    throw new Error("Unsupported Zod default type: " + zodType.constructor.name);
  }
  return output;
}
function setValidationDefaults(data, fields) {
  for (const stringField of Object.keys(fields)) {
    const field = stringField;
    const currentData = data[field];
    if (typeof fields[field] === "function") {
      const func = fields[field];
      data[field] = func(currentData, data);
    } else if (!currentData) {
      data[field] = fields[field];
    }
  }
}
async function superValidate(data, schema, options = {}) {
  options = {
    checkMissingEntityFields: true,
    noErrors: false,
    includeMeta: false,
    ...options
  };
  const entityInfo = entityData(schema);
  const schemaKeys = entityInfo.keys;
  function parseFormData(data2) {
    function tryParseSuperJson(data3) {
      if (data3.has("__superform_json")) {
        try {
          const output2 = parse(data3.get("__superform_json")?.toString() ?? "");
          if (typeof output2 === "object") {
            return output2;
          }
        } catch {
        }
      }
      return null;
    }
    const superJson = tryParseSuperJson(data2);
    return superJson ? superJson : formDataToValidation(schema, schemaKeys, data2);
  }
  async function tryParseFormData(request) {
    let formData = void 0;
    try {
      formData = await request.formData();
    } catch {
      return null;
    }
    return parseFormData(formData);
  }
  let checkMissing = true;
  if (data instanceof FormData) {
    data = parseFormData(data);
    checkMissing = false;
  } else if (data instanceof Request) {
    data = await tryParseFormData(data);
    checkMissing = !data;
  } else if (data && data.request instanceof Request) {
    data = await tryParseFormData(data.request);
    checkMissing = !data;
  } else if (data) {
    data = { ...data };
  }
  if (checkMissing && options.checkMissingEntityFields) {
    checkMissingFields(schema, data);
  }
  let output;
  if (!data) {
    output = {
      valid: false,
      errors: {},
      // Copy the default entity so it's not modified
      data: { ...entityInfo.defaultEntity },
      empty: true,
      message: null,
      constraints: entityInfo.constraints
    };
    if (options.defaults) {
      setValidationDefaults(output.data, options.defaults);
    }
  } else {
    const partialData = data;
    if (options.defaults) {
      setValidationDefaults(partialData, options.defaults);
    }
    const status = schema.safeParse(partialData);
    if (!status.success) {
      const errors = options.noErrors ? {} : status.error.flatten().fieldErrors;
      output = {
        valid: false,
        errors,
        data: Object.fromEntries(schemaKeys.map((key) => [
          key,
          partialData[key] === void 0 ? entityInfo.defaultEntity[key] : partialData[key]
        ])),
        empty: false,
        message: null,
        constraints: entityInfo.constraints
      };
    } else {
      output = {
        valid: true,
        errors: {},
        data: status.data,
        empty: false,
        message: null,
        constraints: entityInfo.constraints
      };
    }
  }
  if (options.includeMeta) {
    output.meta = entityInfo.meta;
  }
  if (options.id !== void 0) {
    output.id = options.id === true ? entityInfo.hash : options.id;
  }
  return output;
}
const authSchema = z.object({
  username: z.string(),
  password: z.string()
});
const postSchema = z.object({
  title: z.string().nonempty({ message: "Missing title" }),
  slug: z.string().nonempty({ message: "Missing slug" }),
  description: z.string().nonempty({ message: "Missing descripton" }),
  markdown: z.string().nonempty({ message: "Missing Markdown" }),
  published: z.boolean()
});
export {
  authSchema as a,
  postSchema as p,
  superValidate as s
};
