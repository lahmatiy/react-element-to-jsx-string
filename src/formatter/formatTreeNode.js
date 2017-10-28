import formatReactElementNode from './formatReactElementNode';

const jsxStopChars = ['<', '>', '{', '}'];
const shouldBeEscaped = s =>
  jsxStopChars.some(jsxStopChar => s.includes(jsxStopChar));

const escape = s => {
  if (!shouldBeEscaped(s)) {
    return s;
  }

  return `{\`${s}\`}`;
};

const preserveTrailingSpace = s => {
  let result = s;
  if (result.endsWith(' ')) {
    result = result.replace(/^(\S*)(\s*)$/, "$1{'$2'}");
  }

  if (result.startsWith(' ')) {
    result = result.replace(/^(\s*)(\S*)$/, "{'$1'}$2");
  }

  return result;
};

export default (node, inline, lvl, options) => {
  if (node.type === 'number') {
    return String(node.value);
  }

  if (node.type === 'string') {
    return node.value
      ? `${preserveTrailingSpace(escape(String(node.value)))}`
      : '';
  }

  if (node.type === 'ReactElement') {
    return formatReactElementNode(node, inline, lvl, options);
  }

  throw new TypeError(`Unknow format type "${node.type}"`);
};
