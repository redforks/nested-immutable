import { Mutable } from 'funts';
import { identity } from 'ramda';
import { ImmutableArray, ImmutableValue, setValue } from './val';

it('no children, no parent', () => {
  const v: ImmutableValue<number> = { $value: 3 } as any;
  setValue(v, 4);
  expect(v.$value).toBe(4);
});

it('update children', () => {
  const value = { foo: 1, bar: 2 };
  const v: ImmutableValue<typeof value> = {
    $value: value,
  } as any;
  v.foo = { $value: value.foo, $parent: v } as any;
  v.bar = { $value: value.bar, $parent: v } as any;

  setValue(v, { foo: 2, bar: 3 });
  expect(v.$value).toStrictEqual({ foo: 2, bar: 3 });
  expect(v.foo.$value).toBe(2);
  expect(v.bar.$value).toBe(3);
});

it('update children array', () => {
  const vals = [3, 4, 5];
  const v: ImmutableArray<number> = [] as any;
  (v as Mutable<typeof v>).$value = vals;
  v.$itemFactory = () => ({ $value: 0 } as any);
  vals.forEach(x => v.push({ $parent: v, $value: x } as any));

  setValue(v, [3, 8, 9]);
  expect(v.$value).toStrictEqual([3, 8, 9]);
  expect(v.map(identity)).toStrictEqual([
    { $value: 3, $parent: v },
    { $value: 8, $parent: v },
    { $value: 9, $parent: v },
  ]);

  setValue(v, [1]);
  expect(v.$value).toStrictEqual([1]);
  expect(v.map(identity)).toStrictEqual([{ $value: 1, $parent: v }]);

  setValue(v, [1, 2]);
  expect(v.$value).toStrictEqual([1, 2]);
  expect(v.map(identity)).toStrictEqual([
    { $value: 1, $parent: v },
    { $value: 2, $parent: v },
  ]);
});

it('update parent object', () => {
  const value = { foo: 1, bar: 2 };
  const v: ImmutableValue<typeof value> = {
    $value: value,
  } as any;
  const foo = v.foo = { $value: value.foo, $parent: v } as any;
  v.bar = { $value: value.bar, $parent: v } as any;

  setValue(foo, 5);
  expect(v.$value).toStrictEqual({ foo: 5, bar: 2 });
  expect(foo.$value).toBe(5);
  expect(v.$value).not.toBe(value);
});

it('update parent array', () => {
  const vals = [3, 4, 5];
  const v: ImmutableArray<number> = [] as any;
  (v as Mutable<typeof v>).$value = vals;
  v.$itemFactory = () => ({ $value: 0 } as any);
  vals.forEach(x => v.push({ $parent: v, $value: x } as any));

  const item1 = v[1];
  setValue(item1, 10);
  expect(item1.$value).toBe(10);
  expect(v.$value).toEqual([3, 10, 5]);
});
