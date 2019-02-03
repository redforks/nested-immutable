"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builder_1 = require("./builder");
it('value', function () {
    var f = builder_1.value(3);
    expect(f()).toStrictEqual({ value: 3 });
    expect(f()).not.toBe(f());
});
var fooFactory = builder_1.object({
    name: builder_1.value(''),
    count: builder_1.value(0),
});
var barFactory = builder_1.object({
    foo: fooFactory,
    flag: builder_1.value(true),
});
it('object', function () {
    var v = fooFactory();
    expect(v).toStrictEqual({
        value: { name: '', count: 0 },
        children: {
            name: { value: '', parent: v },
            count: { value: 0, parent: v },
        },
    });
});
it('Nested object', function () {
    var v = barFactory();
    expect(v.value).toStrictEqual({
        foo: { name: '', count: 0 },
        flag: true,
    });
    expect(v.children).toStrictEqual({
        flag: { value: true, parent: v },
        foo: {
            value: { name: '', count: 0 },
            parent: v,
            children: {
                name: { value: '', parent: v.children.foo },
                count: { value: 0, parent: v.children.foo },
            },
        },
    });
});
it('array', function () {
    var f = builder_1.array(fooFactory);
    expect(f()).toStrictEqual({
        value: [],
        children: [],
        itemFactory: fooFactory,
    });
});
