function toCamel(str: string) {
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

export function keysToCamel<T>(data: any): T {
  if (Array.isArray(data)) {
    return data.map(v => keysToCamel(v)) as T;
  }

  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [toCamel(key), keysToCamel(value)])
    ) as T;
  }

  return data;
}
