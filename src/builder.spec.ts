import { array, object, value } from './builder';

// tslint:disable:no-non-null-assertion

it('value', () => {
  const f = value(3);
  expect(f()).toStrictEqual({ $value: 3 });
  expect(f()).not.toBe(f());
});

interface Foo {
  name: string;
  count: number;
}

interface Bar {
  foo: Foo;
  flag: boolean;
}

const fooFactory = object<Foo>({
  name: value(''),
  count: value(0),
});

const barFactory = object<Bar>({
  foo: fooFactory,
  flag: value(true),
});

it('object', () => {
  const v = fooFactory();
  expect(v).toStrictEqual({
    $value: { name: '', count: 0 },
    name: { $value: '', $parent: v },
    count: { $value: 0, $parent: v },
  });
});

it('Nested object', () => {
  const v = barFactory();
  expect(v.$value).toStrictEqual({
    foo: { name: '', count: 0 },
    flag: true,
  });

  expect(v).toStrictEqual({
    flag: { $value: true, $parent: v },
    foo: {
      $value: { name: '', count: 0 },
      $parent: v,
      name: { $value: '', $parent: v.foo },
      count: { $value: 0, $parent: v.foo },
    },
    $value: {
      foo: { name: '', count: 0 },
      flag: true,
    },
  });

});

it('array', () => {
  const f = array<Foo>(fooFactory);
  expect(f().$value).toStrictEqual([]);
  expect(f().$itemFactory).toStrictEqual(fooFactory);
  expect(f()).toHaveLength(0);
});
