import mergeSiblingPlainStringChildrenReducer from './mergeSiblingPlainStringChildrenReducer';
import {
  createNumberTreeNode,
  createStringTreeNode,
  createReactElementTreeNode,
} from '../tree';

test('mergeSiblingPlainStringChildrenReducer should merge sibling string tree nodes', () => {
  const children = [
    createStringTreeNode('a'),
    createStringTreeNode('b'),
    createStringTreeNode('c'),
  ];

  expect(children.reduce(mergeSiblingPlainStringChildrenReducer, [])).toEqual([
    {
      type: 'string',
      value: 'abc',
    },
  ]);
});

test('mergeSiblingPlainStringChildrenReducer should consider number as string', () => {
  expect(
    [
      createStringTreeNode('a'),
      createNumberTreeNode(51),
      createStringTreeNode('c'),
    ].reduce(mergeSiblingPlainStringChildrenReducer, [])
  ).toEqual([
    {
      type: 'string',
      value: 'a51c',
    },
  ]);

  expect(
    [
      createStringTreeNode(5),
      createNumberTreeNode(1),
      createStringTreeNode('a'),
    ].reduce(mergeSiblingPlainStringChildrenReducer, [])
  ).toEqual([
    {
      type: 'string',
      value: '51a',
    },
  ]);
});

test('mergeSiblingPlainStringChildrenReducer should detect non string node', () => {
  const children = [
    createReactElementTreeNode('MyFoo', {}, {}, ['foo']),
    createStringTreeNode('a'),
    createNumberTreeNode('b'),
    createReactElementTreeNode('MyBar', {}, {}, ['bar']),
    createStringTreeNode('c'),
    createNumberTreeNode(42),
    createReactElementTreeNode('MyBaz', {}, {}, ['baz']),
  ];

  expect(children.reduce(mergeSiblingPlainStringChildrenReducer, [])).toEqual([
    {
      type: 'ReactElement',
      displayName: 'MyFoo',
      props: {},
      defaultProps: {},
      children: ['foo'],
    },
    {
      type: 'string',
      value: 'ab',
    },
    {
      type: 'ReactElement',
      displayName: 'MyBar',
      props: {},
      defaultProps: {},
      children: ['bar'],
    },
    {
      type: 'string',
      value: 'c42',
    },
    {
      type: 'ReactElement',
      displayName: 'MyBaz',
      props: {},
      defaultProps: {},
      children: ['baz'],
    },
  ]);
});

test('mergeSiblingPlainStringChildrenReducer should reduce empty array to an empty array', () => {
  expect([].reduce(mergeSiblingPlainStringChildrenReducer, [])).toEqual([]);
});
