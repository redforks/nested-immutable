"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builder_1 = require("./builder");
it('value', function () {
    var f = builder_1.value(3);
    expect(f()).toStrictEqual({ $value: 3 });
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
        $value: { name: '', count: 0 },
        name: { $value: '', $parent: v },
        count: { $value: 0, $parent: v },
    });
});
it('Nested object', function () {
    var v = barFactory();
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
it('array', function () {
    var f = builder_1.array(fooFactory);
    expect(f().$value).toStrictEqual([]);
    expect(f().$itemFactory).toStrictEqual(fooFactory);
    expect(f()).toHaveLength(0);
});
it('record', function () {
    var f = builder_1.record(fooFactory);
    var rec = f();
    expect(rec.$value).toStrictEqual({});
    expect(rec.$itemFactory).toStrictEqual(fooFactory);
});
