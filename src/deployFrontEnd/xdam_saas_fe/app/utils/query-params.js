export const serialize = (value = '') => {
  const valueType = typeof value;
  if (valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean') {
    throw new Error('Serialize accepts strings, numbers, or boolean values only');
  }

  return encodeURIComponent(value);
};

export const deserialize = (string) => {
  if (typeof string !== 'string') {
    throw new Error('Deserialize accepts strings only');
  }

  return decodeURIComponent(string);
};
