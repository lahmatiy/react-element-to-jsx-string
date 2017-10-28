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
  childrens
) => ({
  type: 'ReactElement',
  displayName,
  props,
  defaultProps,
  childrens,
});
