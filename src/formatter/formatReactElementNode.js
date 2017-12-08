import spacer from './spacer';
import formatTreeNode from './formatTreeNode';
import formatProp from './formatProp';
import mergeSiblingPlainStringChildrenReducer from './mergeSiblingPlainStringChildrenReducer';
import propNameSorter from './propNameSorter';

const compensateMultilineStringElementIndentation = (
  element,
  formattedElement,
  inline,
  lvl,
  { tabStop }
) =>
  element.type === 'string'
    ? formattedElement.replace(/\n/g, `\n${spacer(lvl, tabStop)}`)
    : formattedElement;

const formatOneChildren = (inline, lvl, options) => element =>
  compensateMultilineStringElementIndentation(
    element,
    formatTreeNode(element, inline, lvl, options),
    inline,
    lvl,
    options
  );

const isInlineAttributeTooLong = (
  attributes,
  inlineAttributeString,
  lvl,
  tabStop,
  maxInlineAttributesLineLength
) => {
  if (!maxInlineAttributesLineLength) {
    return attributes.length > 1;
  }

  return (
    spacer(lvl, tabStop).length + inlineAttributeString.length >
    maxInlineAttributesLineLength
  );
};

const shouldRenderMultilineAttr = (
  attributes,
  inlineAttributeString,
  containsMultilineAttr,
  inline,
  lvl,
  tabStop,
  maxInlineAttributesLineLength
) =>
  (isInlineAttributeTooLong(
    attributes,
    inlineAttributeString,
    lvl,
    tabStop,
    maxInlineAttributesLineLength
  ) ||
    containsMultilineAttr) &&
  !inline;

export default (node, inline, lvl, options) => {
  const {
    type,
    displayName = '',
    children,
    props = {},
    defaultProps = {},
  } = node;

  if (type !== 'ReactElement') {
    throw new Error(
      `The "formatReactElementNode" function could only format node of type "ReactElement". Given:  ${type}`
    );
  }

  const {
    filterProps,
    maxInlineAttributesLineLength,
    showDefaultProps,
    sortProps,
    tabStop,
    preferInline,
  } = options;

  let out = `<${displayName}`;

  let outInlineAttr = out;
  let outMultilineAttr = out;
  let containsMultilineAttr = false;
  let multilineAttrOutput = false;

  const propNames = Object.keys(props);
  const defaultPropNames = Object.keys(defaultProps);

  const visibleAttributeNames = propNames.filter(
    propName =>
      filterProps.includes(propName) === false &&
      defaultProps[propName] !== props[propName]
  );

  if (showDefaultProps) {
    visibleAttributeNames.push(
      ...defaultPropNames.filter(
        defaultPropName =>
          !filterProps.includes(defaultPropName) &&
          !visibleAttributeNames.includes(defaultPropName)
      )
    );
  }

  const attributes = visibleAttributeNames.sort(propNameSorter(sortProps));

  attributes.forEach(attributeName => {
    const {
      attributeFormattedInline,
      attributeFormattedMultiline,
      isMultilineAttribute,
    } = formatProp(
      attributeName,
      propNames.includes(attributeName),
      props[attributeName],
      defaultPropNames.includes(attributeName),
      defaultProps[attributeName],
      inline,
      lvl,
      options
    );

    if (isMultilineAttribute) {
      containsMultilineAttr = true;
    }

    outInlineAttr += attributeFormattedInline;
    outMultilineAttr += attributeFormattedMultiline;
  });

  outMultilineAttr += `\n${spacer(lvl, tabStop)}`;

  if (
    shouldRenderMultilineAttr(
      attributes,
      outInlineAttr,
      containsMultilineAttr,
      inline,
      lvl,
      tabStop,
      maxInlineAttributesLineLength
    )
  ) {
    multilineAttrOutput = true;
    out = outMultilineAttr;
  } else {
    out = outInlineAttr;
  }

  if (children && children.length > 0) {
    const newLvl = lvl + 1;
    const normalizedChildren = children.reduce(
      mergeSiblingPlainStringChildrenReducer,
      []
    );
    const hasElements = normalizedChildren.some(
      child => child.type === 'ReactElement'
    );
    const childrenStr = normalizedChildren
      .map(
        formatOneChildren(
          inline || (preferInline && !hasElements),
          newLvl,
          options
        )
      )
      .join(`\n${spacer(newLvl, tabStop)}`);
    const multiline =
      !preferInline ||
      (preferInline === 'exceptRoot' && newLvl === 1) ||
      hasElements ||
      multilineAttrOutput ||
      childrenStr.length > 80 ||
      childrenStr.indexOf('\n') !== -1;

    out += '>';

    if (!inline && multiline) {
      out += '\n';
      out += spacer(newLvl, tabStop);
    }

    out += childrenStr;

    if (!inline && multiline) {
      out += '\n';
      out += spacer(newLvl - 1, tabStop);
    }
    out += `</${displayName}>`;
  } else {
    if (
      !isInlineAttributeTooLong(
        attributes,
        outInlineAttr,
        lvl,
        tabStop,
        maxInlineAttributesLineLength
      )
    ) {
      out += ' ';
    }

    out += '/>';
  }

  return out;
};
