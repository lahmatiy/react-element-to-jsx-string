import formatTree from './formatter/formatTree';
import parseReactElement from './parser/parseReactElement';

export default React =>
  function reactElementToJsxString(
    element,
    {
      filterProps = [],
      showDefaultProps = true,
      showFunctions = false,
      functionValue,
      tabStop = 2,
      useBooleanShorthandSyntax = true,
      useFragmentShortSyntax = true,
      sortProps = true,
      maxInlineAttributesLineLength,
      displayName,
      preferInline = false,
      singleQuotes = false,
      markElement = null,
    } = {}
  ) {
    if (!element) {
      throw new Error('react-element-to-jsx-string: Expected a ReactElement');
    }

    const options = {
      filterProps,
      showDefaultProps,
      showFunctions,
      functionValue,
      tabStop,
      useBooleanShorthandSyntax,
      useFragmentShortSyntax,
      sortProps,
      maxInlineAttributesLineLength,
      displayName,
      preferInline,
      singleQuotes,
      markElement,
      isValidElement: React.isValidElement,
      Children: React.Children,
      Fragment: React.Fragment,
    };

    return formatTree(parseReactElement(element, options), options);
  };
