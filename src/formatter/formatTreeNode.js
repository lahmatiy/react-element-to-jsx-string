import formatReactElementNode from './formatReactElementNode';
import formatReactFragmentNode from './formatReactFragmentNode';

const escape = s => (/[<>{}]/.test(s) ? `{\`${s}\`}` : s);
const preserveTrailingSpace = s => s.replace(/^(\s+)|(\s+)$/g, "{'$1$2'}");

export default (node, inline, lvl, options) => {
  switch (node.type) {
    case 'number':
      return String(node.value);

    case 'string':
      return node.value
        ? preserveTrailingSpace(escape(String(node.value)))
        : '';

    case 'ReactElement':
      return formatReactElementNode(node, inline, lvl, options);

    case 'ReactFragment':
      return formatReactFragmentNode(node, inline, lvl, options);

    default:
      throw new TypeError(`Unknown format type "${node.type}"`);
  }
};
