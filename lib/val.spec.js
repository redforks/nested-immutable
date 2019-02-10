"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var val_1 = require("./val");
it('no children, no parent', function () {
    var v = { $value: 3 };
    val_1.setValue(v, 4);
    expect(v.$value).toBe(4);
});
it('update children', function () {
    var value = { foo: 1, bar: 2 };
    var v = {
        $value: value,
    };
    v.foo = { $value: value.foo, $parent: v };
    v.bar = { $value: value.bar, $parent: v };
    val_1.setValue(v, { foo: 2, bar: 3 });
    expect(v.$value).toStrictEqual({ foo: 2, bar: 3 });
    expect(v.foo.$value).toBe(2);
    expect(v.bar.$value).toBe(3);
});
it('update children array', function () {
    var vals = [3, 4, 5];
    var v = [];
    v.$value = vals;
    v.$itemFactory = function () { return ({ $value: 0 }); };
    vals.forEach(function (x) { return v.push({ $parent: v, $value: x }); });
    val_1.setValue(v, [3, 8, 9]);
    expect(v.$value).toStrictEqual([3, 8, 9]);
    expect(v.map(ramda_1.identity)).toStrictEqual([
        { $value: 3, $parent: v },
        { $value: 8, $parent: v },
        { $value: 9, $parent: v },
    ]);
    val_1.setValue(v, [1]);
    expect(v.$value).toStrictEqual([1]);
    expect(v.map(ramda_1.identity)).toStrictEqual([{ $value: 1, $parent: v }]);
    val_1.setValue(v, [1, 2]);
    expect(v.$value).toStrictEqual([1, 2]);
    expect(v.map(ramda_1.identity)).toStrictEqual([
        { $value: 1, $parent: v },
        { $value: 2, $parent: v },
    ]);
});
it('update record children', function () {
    var rec1 = { foo: 1, bar: 2 };
    var rec2 = { foo: 2, bar: 3 };
    var rec3 = { foo: 3, bar: 4 };
    var v = {
        $itemFactory: function () { return ({
            foo: { $value: 0 },
            bar: { $value: 0 },
        }); },
    };
    val_1.setValue(v, { a: rec1, b: rec2 });
    expect(v.$value).toStrictEqual({ a: rec1, b: rec2 });
    expect(v.a.$parent).toStrictEqual(v);
    expect(v.a.$value).toBe(rec1);
    expect(v.a.foo.$value).toBe(1);
    val_1.setValue(v, { b: rec2, c: rec3, d: undefined });
    expect(v.$value).toStrictEqual({ b: rec2, c: rec3, d: undefined });
    expect(v).not.toHaveProperty('a');
    expect(v.b.$value).toBe(rec2);
    expect(v.c.$value).toBe(rec3);
    expect(v.d.$value).toBeUndefined();
});
it('update parent object', function () {
    var value = { foo: 1, bar: 2 };
    var v = {
        $value: value,
    };
    var foo = v.foo = { $value: value.foo, $parent: v };
    v.bar = { $value: value.bar, $parent: v };
    val_1.setValue(foo, 5);
    expect(v.$value).toStrictEqual({ foo: 5, bar: 2 });
    expect(foo.$value).toBe(5);
    expect(v.$value).not.toBe(value);
});
it('update parent array', function () {
    var vals = [3, 4, 5];
    var v = [];
    v.$value = vals;
    v.$itemFactory = function () { return ({ $value: 0 }); };
    vals.forEach(function (x) { return v.push({ $parent: v, $value: x }); });
    var item1 = v[1];
    val_1.setValue(item1, 10);
    expect(item1.$value).toBe(10);
    expect(v.$value).toEqual([3, 10, 5]);
});
it('update parent record', function () {
    var rec1 = { foo: 1, bar: 2 };
    var rec2 = { foo: 2, bar: 3 };
    var rec3 = { foo: 3, bar: 4 };
    var v = {
        $itemFactory: function () {
            var r = {};
            var foo = { $value: 0, $parent: r };
            var bar = { $value: 0, $parent: r };
            r.foo = foo;
            r.bar = bar;
            return r;
        },
    };
    val_1.setValue(v, { a: rec1, b: rec2 });
    val_1.setValue(v.a, rec3);
    expect(v.a.$value).toBe(rec3);
    expect(v.$value).toStrictEqual({ a: rec3, b: rec2 });
    val_1.setValue(v.b.foo, 10);
    expect(v.b.foo.$value).toBe(10);
    expect(v.b.$value).toStrictEqual({ foo: 10, bar: 3 });
    expect(v.$value).toStrictEqual({ a: rec3, b: { foo: 10, bar: 3 } });
});
