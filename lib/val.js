"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ramda_1 = require("ramda");
var ramda_adjunct_1 = require("ramda-adjunct");
var rcheck_ts_1 = require("rcheck-ts");
function setValue(v, val) {
    _setValue(v, val, 0);
}
exports.setValue = setValue;
function _setValue(v, val, flags) {
    if (ramda_1.equals(val, v.value)) {
        return;
    }
    v.value = val;
    var children = v.children;
    if ((flags & 1) === 0 && children !== undefined) {
        if (isArrayChild(children)) {
            var arr = v;
            var minLen = Math.min(arr.children.length, val.length);
            for (var i = 0; i < minLen; i++) {
                _setValue(children[i], val[i], 2);
            }
            if (arr.children.length > val.length) {
                arr.children.length = val.length;
            }
            else if (arr.children.length < val.length) {
                for (var i = minLen; i < val.length; i++) {
                    var child = rcheck_ts_1.notNull(arr.itemFactory)();
                    child.parent = v;
                    _setValue(child, val[i], 2);
                    arr.children.push(child);
                }
            }
        }
        else {
            for (var key in children) {
                var elem = children[key];
                _setValue(elem, val[key], 2);
            }
        }
    }
    if ((flags & 2) === 0 && v.parent) {
        onChildChange(v.parent, v);
    }
}
function onChildChange(v, child) {
    var _a;
    if (!isArrayChild(v.children)) {
        for (var key in v.children) {
            var c = v.children[key];
            if (c === child) {
                var val = tslib_1.__assign({}, v.value, (_a = {}, _a[key] = child.value, _a));
                _setValue(v, val, 1);
                break;
            }
        }
    }
    else {
        var idx = v.children.indexOf(child);
        var val = ramda_1.update(idx, child.value, v.value);
        _setValue(v, val, 1);
    }
}
function isArrayChild(v) {
    return ramda_adjunct_1.isArray(v);
}
