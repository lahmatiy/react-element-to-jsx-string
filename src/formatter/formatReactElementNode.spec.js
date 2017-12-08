import React from 'react';
import formatReactElementNode from './formatReactElementNode';

const defaultOptions = {
  filterProps: [],
  showDefaultProps: true,
  showFunctions: false,
  tabStop: 2,
  useBooleanShorthandSyntax: true,
  sortProps: true,
  isValidElement: React.isValidElement,
};

describe('formatReactElementNode', () => {
  it('should format a react element with a string a children', () => {
    const tree = {
      type: 'ReactElement',
      displayName: 'h1',
      defaultProps: {},
      props: {},
      children: [
        {
          value: 'Hello world',
          type: 'string',
        },
      ],
    };

    expect(formatReactElementNode(tree, false, 0, defaultOptions)).toEqual(
      `<h1>
  Hello world
</h1>`
    );
  });

  it('should format a single depth react element', () => {
    const tree = {
      type: 'ReactElement',
      displayName: 'aaa',
      props: {
        foo: '41',
      },
      defaultProps: {
        foo: '41',
      },
      children: [],
    };

    expect(formatReactElementNode(tree, false, 0, defaultOptions)).toEqual(
      '<aaa foo="41" />'
    );
  });

  it('should format a react element with an object as props', () => {
    const tree = {
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {
        a: { aa: '1', bb: { cc: '3' } },
      },
      props: {
        a: { aa: '1', bb: { cc: '3' } },
      },
      children: [],
    };

    expect(formatReactElementNode(tree, false, 0, defaultOptions)).toEqual(
      `<div
  a={{
    aa: '1',
    bb: {
      cc: '3'
    }
  }}
 />`
    );
  });

  it('should format a react element with another react element as props', () => {
    const tree = {
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {
        a: <span b="42" />,
      },
      props: {
        a: <span b="42" />,
      },
      children: [],
    };

    expect(formatReactElementNode(tree, false, 0, defaultOptions)).toEqual(
      '<div a={<span b="42" />} />'
    );
  });

  it('should format a react element with multiline children', () => {
    const tree = {
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {},
      children: [
        {
          type: 'string',
          value: 'first line\nsecond line\nthird line',
        },
      ],
    };

    expect(formatReactElementNode(tree, false, 0, defaultOptions)).toEqual(
      `<div>
  first line
  second line
  third line
</div>`
    );

    expect(formatReactElementNode(tree, false, 2, defaultOptions)).toEqual(
      `<div>
      first line
      second line
      third line
    </div>`
    );
  });

  describe('preferInline', () => {
    it('should try inline when option is passed', () => {
      const options = { ...defaultOptions, preferInline: true };
      const tree = {
        type: 'ReactElement',
        displayName: 'h1',
        defaultProps: {},
        props: {},
        children: [
          {
            value: 'Hello world',
            type: 'string',
          },
        ],
      };

      expect(formatReactElementNode(tree, false, 0, options)).toEqual(
        `<h1>Hello world</h1>`
      );
    });

    it('should not inline any child is an element', () => {
      const options = { ...defaultOptions, preferInline: true };
      const tree = {
        type: 'ReactElement',
        displayName: 'h1',
        defaultProps: {},
        props: {},
        children: [
          {
            type: 'string',
            value: 'Hello',
          },
          {
            type: 'ReactElement',
            displayName: 'br',
            defaultProps: {},
            props: {},
            children: [],
          },
          {
            type: 'string',
            value: 'world',
          },
        ],
      };

      expect(formatReactElementNode(tree, false, 0, options)).toEqual(
        `<h1>
  Hello
  <br />
  world
</h1>`
      );
    });

    it('should not inline when element contains a single empty element child', () => {
      const options = { ...defaultOptions, preferInline: true };
      const tree = {
        type: 'ReactElement',
        displayName: 'h1',
        defaultProps: {},
        props: {},
        children: [
          {
            type: 'ReactElement',
            displayName: 'input',
            defaultProps: {},
            props: {},
            children: [],
          },
        ],
      };

      expect(formatReactElementNode(tree, false, 0, options)).toEqual(
        `<h1>
  <input />
</h1>`
      );
    });

    it('should not root when preferInline: exceptRoot', () => {
      const options = { ...defaultOptions, preferInline: 'exceptRoot' };
      const tree = {
        type: 'ReactElement',
        displayName: 'h1',
        defaultProps: {},
        props: {},
        children: [
          {
            type: 'string',
            value: "shouldn't be inlined",
          },
        ],
      };

      expect(formatReactElementNode(tree, false, 0, options)).toEqual(
        `<h1>
  shouldn't be inlined
</h1>`
      );
    });

    it('should inline non-root elements when preferInline: exceptRoot', () => {
      const options = { ...defaultOptions, preferInline: 'exceptRoot' };
      const tree = {
        type: 'ReactElement',
        displayName: 'h1',
        defaultProps: {},
        props: {},
        children: [
          {
            type: 'ReactElement',
            displayName: 'div',
            defaultProps: {},
            props: {},
            children: [
              {
                type: 'string',
                value: 'should be inlined',
              },
            ],
          },
        ],
      };

      expect(formatReactElementNode(tree, false, 0, options)).toEqual(
        `<h1>
  <div>should be inlined</div>
</h1>`
      );
    });
  });
});
