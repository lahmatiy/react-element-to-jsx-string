import formatReactElementNode from './formatReactElementNode';

export default (node, inline, lvl, options) => {
  const { type, key, children } = node;

  if (type !== 'ReactFragment') {
    throw new Error(
      `The "formatReactFragmentNode" function could only format node of type "ReactFragment". Given: ${type}`
    );
  }

  const shortSyntax =
    options.useFragmentShortSyntax && !key && children.length > 0;

  const mimicElement = {
    type: 'ReactElement',
    displayName: shortSyntax ? '' : 'React.Fragment',
    props: key ? { key } : {},
    defaultProps: {},
    children,
  };

  return formatReactElementNode(mimicElement, inline, lvl, options);
};
