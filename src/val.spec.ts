import { ImmutableArray, ImmutableValue, setValue } from './val';

it('no children, no parent', () => {
  const v = { value: 3 };
  setValue(v, 4);
  expect(v.value).toBe(4);
});

it('update children', () => {
  const value = { foo: 1, bar: 2 };
  const v: ImmutableValue<typeof value> = {
    value,
  } as any;
  v.children = {
    foo: { value: value.foo, parent: v },
    bar: { value: value.bar, parent: v },
  };

  setValue(v, { foo: 2, bar: 3 });
  expect(v.value).toStrictEqual({ foo: 2, bar: 3 });
  expect(v.children.foo.value).toBe(2);
  expect(v.children.bar.value).toBe(3);
});

it('update children array', () => {
  const v: ImmutableArray<number> = {
    value: [3, 4, 5],
    children: [{ value: 3 }, { value: 4 }, { value: 5 }],
    itemFactory: () => ({ value: 0 }),
  };
  v.children.forEach(x => { x.parent = v as any; });

  setValue(v, [3, 8, 9]);
  expect(v.value).toStrictEqual([3, 8, 9]);
  expect(v.children).toStrictEqual([
    { value: 3, parent: v },
    { value: 8, parent: v },
    { value: 9, parent: v },
  ]);

  setValue(v, [1]);
  expect(v.value).toStrictEqual([1]);
  expect(v.children).toStrictEqual([{ value: 1, parent: v }]);

  setValue(v, [1, 2]);
  expect(v.value).toStrictEqual([1, 2]);
  expect(v.children).toStrictEqual([
    { value: 1, parent: v },
    { value: 2, parent: v },
  ]);
});

it('update parent object', () => {
  const value = { foo: 1, bar: 2 };
  const v: ImmutableValue<typeof value> = {
    value,
  } as any;
  const { foo } = v.children = {
    foo: { value: value.foo, parent: v },
    bar: { value: value.bar, parent: v },
  };

  setValue(foo, 5);
  expect(v.value).toStrictEqual({ foo: 5, bar: 2 });
  expect(foo.value).toBe(5);
  expect(v.value).not.toBe(value);
});

it('update parent array', () => {
  const v: ImmutableArray<number> = {
    value: [3, 4, 5],
    children: [{ value: 3 }, { value: 4 }, { value: 5 }],
    itemFactory: () => ({ value: 0 }),
  };
  v.children.forEach(x => { x.parent = v as any; });

  const item1 = v.children[1];
  setValue(item1, 10);
  expect(item1.value).toBe(10);
  expect(v.value).toEqual([3, 10, 5]);
});
