"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function value(v) {
    return function () { return ({ $value: v }); };
}
exports.value = value;
function object(vals) {
    return function () {
        var val = {};
        var r = {
            $value: val,
        };
        for (var key in vals) {
            if (key.startsWith('$')) {
                continue;
            }
            var child = vals[key]();
            r[key] = child;
            child.$parent = r;
            val[key] = child.$value;
        }
        return r;
    };
}
exports.object = object;
function array(itemFactory) {
    return function () {
        var r = [];
        r.$itemFactory = itemFactory;
        r.$value = [];
        return r;
    };
}
exports.array = array;
function record(itemFactory) {
    return function () { return ({
        $itemFactory: itemFactory,
        $value: {},
    }); };
}
exports.record = record;
