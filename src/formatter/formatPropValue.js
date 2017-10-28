import isPlainObject from 'is-plain-object';
import formatComplexDataStructure from './formatComplexDataStructure';
import formatTreeNode from './formatTreeNode';
import parseReactElement from '../parser/parseReactElement';

const noRefCheck = () => {};
const escape = s => s.replace(/"/g, '&quot;');
const defaultFunctionValue = fn => fn;

export default (propValue, inline, lvl, options) => {
  switch (typeof propValue) {
    case 'number':
      return `{${String(propValue)}}`;

    case 'string':
      return `"${escape(propValue)}"`;

    case 'symbol':
      return String(propValue).replace(
        /^Symbol\((.*)\)$/,
        (m, ref) => (ref ? `{Symbol('${ref}')}` : `{Symbol()}`)
      );

    case 'function': {
      const { functionValue = defaultFunctionValue, showFunctions } = options;

      return showFunctions || functionValue !== defaultFunctionValue
        ? `{${functionValue(propValue)}}`
        : `{${noRefCheck}}`;
    }

    default:
  }

  if (options.isValidElement(propValue)) {
    return `{${formatTreeNode(
      parseReactElement(propValue, options),
      true,
      lvl,
      options
    )}}`;
  }

  if (propValue instanceof Date) {
    return `{new Date("${propValue.toISOString()}")}`;
  }

  if (isPlainObject(propValue) || Array.isArray(propValue)) {
    return `{${formatComplexDataStructure(propValue, inline, lvl, options)}}`;
  }

  return `{${String(propValue)}}`;
};
