"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var val_1 = require("./val");
it('no children, no parent', function () {
    var v = { value: 3 };
    val_1.setValue(v, 4);
    expect(v.value).toBe(4);
});
it('update children', function () {
    var value = { foo: 1, bar: 2 };
    var v = {
        value: value,
    };
    v.children = {
        foo: { value: value.foo, parent: v },
        bar: { value: value.bar, parent: v },
    };
    val_1.setValue(v, { foo: 2, bar: 3 });
    expect(v.value).toStrictEqual({ foo: 2, bar: 3 });
    expect(v.children.foo.value).toBe(2);
    expect(v.children.bar.value).toBe(3);
});
it('update children array', function () {
    var v = {
        value: [3, 4, 5],
        children: [{ value: 3 }, { value: 4 }, { value: 5 }],
        itemFactory: function () { return ({ value: 0 }); },
    };
    v.children.forEach(function (x) { x.parent = v; });
    val_1.setValue(v, [3, 8, 9]);
    expect(v.value).toStrictEqual([3, 8, 9]);
    expect(v.children).toStrictEqual([
        { value: 3, parent: v },
        { value: 8, parent: v },
        { value: 9, parent: v },
    ]);
    val_1.setValue(v, [1]);
    expect(v.value).toStrictEqual([1]);
    expect(v.children).toStrictEqual([{ value: 1, parent: v }]);
    val_1.setValue(v, [1, 2]);
    expect(v.value).toStrictEqual([1, 2]);
    expect(v.children).toStrictEqual([
        { value: 1, parent: v },
        { value: 2, parent: v },
    ]);
});
it('update parent object', function () {
    var value = { foo: 1, bar: 2 };
    var v = {
        value: value,
    };
    var foo = (v.children = {
        foo: { value: value.foo, parent: v },
        bar: { value: value.bar, parent: v },
    }).foo;
    val_1.setValue(foo, 5);
    expect(v.value).toStrictEqual({ foo: 5, bar: 2 });
    expect(foo.value).toBe(5);
    expect(v.value).not.toBe(value);
});
it('update parent array', function () {
    var v = {
        value: [3, 4, 5],
        children: [{ value: 3 }, { value: 4 }, { value: 5 }],
        itemFactory: function () { return ({ value: 0 }); },
    };
    v.children.forEach(function (x) { x.parent = v; });
    var item1 = v.children[1];
    val_1.setValue(item1, 10);
    expect(item1.value).toBe(10);
    expect(v.value).toEqual([3, 10, 5]);
});
