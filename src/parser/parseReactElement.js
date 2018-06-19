import {
  createStringTreeNode,
  createNumberTreeNode,
  createReactElementTreeNode,
} from '../tree';

const { hasOwnProperty } = Object.prototype;
const getReactElementDisplayName = element =>
  element.type.displayName ||
  element.type.name || // function name
  (typeof element.type === 'function' // function without a name, you should provide one
    ? 'No Display Name'
    : element.type);

const onlyMeaningfulChildren = children =>
  children !== true &&
  children !== false &&
  children !== null &&
  children !== '';

const filterProps = props => {
  const filteredProps = {};

  for (const key in props) {
    if (hasOwnProperty.call(props, key) && key !== 'children') {
      filteredProps[key] = props[key];
    }
  }

  return filteredProps;
};

/* eslint-disable no-use-before-define */
export default function parse(root, options) {
  function parseReactElement(element) {
    switch (typeof element) {
      case 'string':
        return createStringTreeNode(element);

      case 'number':
        return createNumberTreeNode(element);

      default:
        if (!isValidElement(element)) {
          throw new Error(
            `react-element-to-jsx-string: Expected a React.Element, got \`${typeof element}\``
          );
        }
    }

    const name = displayName(element);
    const props = filterProps(element.props);
    const defaultProps = filterProps(element.type.defaultProps || {});

    if (typeof markElement === 'function') {
      markElement(element, name);
    }

    if (element.ref !== null) {
      props.ref = element.ref;
    }

    if (typeof element.key === 'string' && element.key[0] !== '.') {
      // React automatically add key=".X" when there are some children
      props.key = element.key;
    }

    return createReactElementTreeNode(
      name,
      props,
      defaultProps,
      Children.toArray(element.props.children)
        .filter(onlyMeaningfulChildren)
        .map(parseReactElement)
    );
  }

  const {
    displayName = getReactElementDisplayName,
    isValidElement,
    Children,
    markElement,
  } = options;

  return parseReactElement(root);
}
