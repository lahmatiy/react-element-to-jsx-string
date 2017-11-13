module.exports = function sortObject(obj, comparator) {
  function processValue(value) {
    // return non-object value as is
    if (value === null || typeof value !== 'object') {
      return value;
    }

    // return date and regexp values as is
    if (value instanceof Date || value instanceof RegExp) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(processValue);
    }

    return Object.keys(value)
      .sort(comparator)
      .reduce((result, key) => {
        // eslint-disable-next-line no-param-reassign
        result[key] = processValue(value[key]);
        return result;
      }, {});
  }

  return processValue(obj);
};
