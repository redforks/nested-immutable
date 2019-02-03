"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function value(v) {
    return function () { return ({ value: v }); };
}
exports.value = value;
function object(vals) {
    return function () {
        var children = {};
        var val = {};
        var r = {
            value: val,
            children: children,
        };
        for (var key in vals) {
            var child = vals[key]();
            children[key] = child;
            child.parent = r;
            val[key] = child.value;
        }
        return r;
    };
}
exports.object = object;
function array(itemFactory) {
    return function () { return ({
        value: [],
        children: [],
        itemFactory: itemFactory,
    }); };
}
exports.array = array;
