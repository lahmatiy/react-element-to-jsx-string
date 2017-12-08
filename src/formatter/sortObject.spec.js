import sortObject from './sortObject';

describe('formatComplexDataStructure', () => {
  it('should sort keys in objects', () => {
    const fixture = {
      c: 2,
      b: { x: 1, c: 'ccc' },
      a: [{ foo: 1, bar: 2 }],
    };

    expect(JSON.stringify(sortObject(fixture))).toEqual(
      JSON.stringify({
        a: [{ bar: 2, foo: 1 }],
        b: { c: 'ccc', x: 1 },
        c: 2,
      })
    );
  });

  it('should not break special values', () => {
    const date = new Date();
    const regexp = /test/g;
    const fixture = {
      a: [date, regexp],
      b: regexp,
      c: date,
    };

    expect(sortObject(fixture)).toEqual({
      a: [date, regexp],
      b: regexp,
      c: date,
    });
  });
});
