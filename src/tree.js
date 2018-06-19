export const createStringTreeNode = value => ({
  type: 'string',
  value,
});

export const createNumberTreeNode = value => ({
  type: 'number',
  value,
});

export const createReactElementTreeNode = (
  displayName,
  props,
  defaultProps,
  children
) => ({
  type: 'ReactElement',
  displayName,
  props,
  defaultProps,
  children,
});

export const createReactFragmentTreeNode = (key, children) => ({
  type: 'ReactFragment',
  key,
  children,
});
