import isPlainObject from 'is-plain-object';
import formatComplexDataStructure from './formatComplexDataStructure';
import formatTreeNode from './formatTreeNode';
import parseReactElement from '../parser/parseReactElement';

const noRefCheck = () => {};
const defaultFunctionValue = fn => fn;
const escapeSingleQuotes = s => s.replace(/'/g, '&apos;');
const escapeDoubleQuotes = s => s.replace(/"/g, '&quot;');
const quotedString = (value, { singleQuotes }) =>
  singleQuotes
    ? `'${escapeSingleQuotes(value)}'`
    : `"${escapeDoubleQuotes(value)}"`;

export default (propValue, inline, lvl, options) => {
  switch (typeof propValue) {
    case 'number':
      return `{${String(propValue)}}`;

    case 'string':
      return quotedString(propValue, options);

    case 'symbol':
      return String(propValue).replace(
        /^Symbol\((.*)\)$/,
        (m, ref) =>
          ref ? `{Symbol(${quotedString(ref, options)})}` : `{Symbol()}`
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
    return `{new Date(${quotedString(propValue.toISOString(), options)})}`;
  }

  if (isPlainObject(propValue) || Array.isArray(propValue)) {
    return `{${formatComplexDataStructure(propValue, inline, lvl, options)}}`;
  }

  return `{${String(propValue)}}`;
};
