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
      sortProps = true,
      maxInlineAttributesLineLength,
      displayName,
      preferInline,
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
      sortProps,
      maxInlineAttributesLineLength,
      displayName,
      preferInline,
      isValidElement: React.isValidElement,
    };

    return formatTree(parseReactElement(element, options), options);
  };
