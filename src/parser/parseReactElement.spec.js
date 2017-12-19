import React from 'react';
import parseReactElement from './parseReactElement';

const options = {
  isValidElement: React.isValidElement,
  Children: React.Children,
};

function Nested() {
  return <span />;
}

describe('parseReactElement', () => {
  it('should parse a react element with a string as children', () => {
    expect(parseReactElement(<h1>Hello world</h1>, options)).toEqual({
      type: 'ReactElement',
      displayName: 'h1',
      defaultProps: {},
      props: {},
      children: [
        {
          type: 'string',
          value: 'Hello world',
        },
      ],
    });
  });

  it('should filter empty children', () => {
    expect(
      parseReactElement(
        <h1>
          Hello
          {null}
          {true}
          {false}
          {''}
          world
        </h1>,
        options
      )
    ).toEqual({
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
          type: 'string',
          value: 'world',
        },
      ],
    });
  });

  it('should parse a single depth react element', () => {
    expect(parseReactElement(<aaa foo="41" />, options)).toEqual({
      type: 'ReactElement',
      displayName: 'aaa',
      props: {
        foo: '41',
      },
      defaultProps: {},
      children: [],
    });
  });

  it('should parse a react element with an object as props', () => {
    expect(
      parseReactElement(<div a={{ aa: '1', bb: { cc: '3' } }} />, options)
    ).toEqual({
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {
        a: { aa: '1', bb: { cc: '3' } },
      },
      children: [],
    });
  });

  it('should parse a react element with another react element as props', () => {
    expect(parseReactElement(<div a={<span b="42" />} />, options)).toEqual({
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {
        a: <span b="42" />,
      },
      children: [],
    });
  });

  it('should parse the react element defaultProps', () => {
    const Foo = () => {};
    Foo.defaultProps = {
      bar: 'Hello Bar!',
      baz: 'Hello Baz!',
    };

    expect(
      parseReactElement(<Foo foo="Hello Foo!" bar="Hello world!" />, options)
    ).toEqual({
      type: 'ReactElement',
      displayName: 'Foo',
      defaultProps: {
        bar: 'Hello Bar!',
        baz: 'Hello Baz!',
      },
      props: {
        bar: 'Hello world!',
        baz: 'Hello Baz!',
        foo: 'Hello Foo!',
      },
      children: [],
    });
  });

  it('should extract the component key', () => {
    expect(parseReactElement(<div key="foo-1" />, options)).toEqual({
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {
        key: 'foo-1',
      },
      children: [],
    });
  });

  it('should extract the component ref', () => {
    const refFn = () => 'foo';

    expect(parseReactElement(<div ref={refFn} />, options)).toEqual({
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {
        ref: refFn,
      },
      children: [],
    });

    // eslint-disable-next-line react/no-string-refs
    expect(parseReactElement(<div ref="foo" />, options)).toEqual({
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {
        ref: 'foo',
      },
      children: [],
    });
  });

  it.skip('should process nested components in props', () => {
    const jsx = parseReactElement(
      <div foo={{ bar: 1, baz: <Nested /> }}>
        <Nested />
      </div>,
      options
    );

    expect(jsx).toEqual({
      type: 'ReactElement',
      displayName: 'div',
      defaultProps: {},
      props: {
        foo: {
          bar: 1,
          baz: {
            type: 'ReactElement',
            displayName: 'Nested',
            defaultProps: {},
            props: {},
            children: [],
          },
        },
      },
      children: [
        {
          type: 'ReactElement',
          displayName: 'Nested',
          defaultProps: {},
          props: {},
          children: [],
        },
      ],
    });
  });
});
