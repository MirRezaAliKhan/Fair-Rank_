export function safeJsonParse(value: any) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function stringifyJsonValue(value: any) {
  if (value === undefined || value === null) return value;
  return typeof value === 'string' ? value : JSON.stringify(value);
}

export function parseJsonFields(item: any, fields: string[]) {
  if (!item) return item;

  const parsed = { ...item } as Record<string, any>;

  fields.forEach((field) => {
    if (field in parsed) {
      parsed[field] = safeJsonParse(parsed[field]);
    }
  });

  return parsed;
}

export function stringifyJsonFields(item: any, fields: string[]) {
  if (!item) return item;

  const serialized = { ...item } as Record<string, any>;

  fields.forEach((field) => {
    if (field in serialized) {
      serialized[field] = stringifyJsonValue(serialized[field]);
    }
  });

  return serialized;
}
