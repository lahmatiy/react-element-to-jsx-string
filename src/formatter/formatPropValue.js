import isPlainObject from 'is-plain-object';
import { isValidElement } from 'react';
import formatComplexDataStructure from './formatComplexDataStructure';
import formatTreeNode from './formatTreeNode';
import parseReactElement from '../parser/parseReactElement';

const noRefCheck = () => {};
const escape = s => s.replace(/"/g, '&quot;');

const defaultFunctionValue = fn => fn;

const formatPropValue = (propValue, inline, lvl, options) => {
  if (typeof propValue === 'number') {
    return `{${String(propValue)}}`;
  }

  if (typeof propValue === 'string') {
    return `"${escape(propValue)}"`;
  }

  if (typeof propValue === 'symbol') {
    const symbolDescription = propValue
      .valueOf()
      .toString()
      .replace(/Symbol\((.*)\)/, '$1');

    if (!symbolDescription) {
      return `{Symbol()}`;
    }

    return `{Symbol('${symbolDescription}')}`;
  }

  if (typeof propValue === 'function') {
    const { functionValue = defaultFunctionValue, showFunctions } = options;
    if (!showFunctions && functionValue === defaultFunctionValue) {
      return `{${functionValue(noRefCheck)}}`;
    }

    return `{${functionValue(propValue)}}`;
  }

  if (isValidElement(propValue)) {
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

export default formatPropValue;
