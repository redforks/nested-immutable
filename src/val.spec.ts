import { Mutable } from 'funts';
import { identity } from 'ramda';
import { ImmutableArray, ImmutableRecord, ImmutableValue, setValue } from './val';

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

it('update record children', () => {
  const rec1 = { foo: 1, bar: 2 };
  const rec2 = { foo: 2, bar: 3 };
  const rec3 = { foo: 3, bar: 4 };
  const v: ImmutableRecord<typeof rec1> = {
    $itemFactory: () => ({
      foo: { $value: 0 },
      bar: { $value: 0 },
    }),
  } as any;

  setValue(v, { a: rec1, b: rec2 });
  expect(v.$value).toStrictEqual({ a: rec1, b: rec2 });
  expect(v.a.$parent).toStrictEqual(v);
  expect(v.a.$value).toBe(rec1);
  expect(v.a.foo.$value).toBe(1);

  setValue(v, { b: rec2, c: rec3, d: undefined as any });
  expect(v.$value).toStrictEqual({ b: rec2, c: rec3, d: undefined });
  expect(v).not.toHaveProperty('a');
  expect(v.b.$value).toBe(rec2);
  expect(v.c.$value).toBe(rec3);
  expect(v.d.$value).toBeUndefined();
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

it('update parent record', () => {
  const rec1 = { foo: 1, bar: 2 };
  const rec2 = { foo: 2, bar: 3 };
  const rec3 = { foo: 3, bar: 4 };
  const v: ImmutableRecord<typeof rec1> = {
    $itemFactory: () => {
      const r: any = {};
      const foo = { $value: 0, $parent: r };
      const bar = { $value: 0, $parent: r };
      r.foo = foo;
      r.bar = bar;
      return r;
    },
  } as any;
  setValue(v, { a: rec1, b: rec2 });

  setValue(v.a, rec3);
  expect(v.a.$value).toBe(rec3);
  expect(v.$value).toStrictEqual({ a: rec3, b: rec2 });

  setValue(v.b.foo, 10);
  expect(v.b.foo.$value).toBe(10);
  expect(v.b.$value).toStrictEqual({ foo: 10, bar: 3 });
  expect(v.$value).toStrictEqual({ a: rec3, b: { foo: 10, bar: 3 } });

});
