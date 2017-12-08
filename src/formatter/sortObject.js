function findInStack(stack, value) {
  for (let i = 0; i < stack.length; i++) {
    const entry = stack[i];
    if (entry.value === value) {
      return entry.result;
    }
  }

  return false;
}

function sortObject(value, stack) {
  // return non-object value as is
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // return date and regexp values as is
  if (value instanceof Date || value instanceof RegExp) {
    return value;
  }

  const stackResult = findInStack(stack, value);

  if (stackResult) {
    return stackResult;
  }

  const isArray = Array.isArray(value);
  const result = isArray ? new Array(value.length) : {};
  const extendedStack = stack.concat({ value, result });

  if (isArray) {
    // make a copy of array with each item passed through sortObject()
    value.forEach((item, index) => {
      result[index] = sortObject(item, extendedStack);
    });
  } else {
    // make a copy of object with key sorted
    Object.keys(value)
      .sort()
      .forEach(key => {
        result[key] = sortObject(value[key], extendedStack);
      });
  }

  return result;
}

export default value => sortObject(value, []);
