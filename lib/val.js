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
    if (ramda_1.equals(val, v.$value)) {
        return;
    }
    v.$value = val;
    if ((flags & 1) === 0) {
        if (isArrayChild(v)) {
            var minLen = Math.min(v.length, val.length);
            for (var i = 0; i < minLen; i++) {
                _setValue(v[i], val[i], 2);
            }
            if (v.length > val.length) {
                v.length = val.length;
            }
            else if (v.length < val.length) {
                for (var i = minLen; i < val.length; i++) {
                    var child = rcheck_ts_1.notNull(v.$itemFactory)();
                    child.$parent = v;
                    _setValue(child, val[i], 2);
                    v.push(child);
                }
            }
        }
        else if (isRecordChild(v)) {
            for (var key in val) {
                var child = v[key];
                if (!child) {
                    child = v[key] = v.$itemFactory();
                    child.$parent = v;
                }
                _setValue(child, val[key], 2);
            }
            for (var key in v) {
                if (!key.startsWith('$')) {
                    if (!ramda_1.has(key, val)) {
                        v[key].$parent = undefined;
                        delete v[key];
                    }
                }
            }
        }
        else {
            for (var key in v) {
                if (!key.startsWith('$')) {
                    var elem = v[key];
                    _setValue(elem, val[key], 2);
                }
            }
        }
    }
    if ((flags & 2) === 0 && v.$parent) {
        onChildChange(v.$parent, v);
    }
}
function onChildChange(v, child) {
    var _a;
    if (!isArrayChild(v)) {
        for (var key in v) {
            if (!key.startsWith('$')) {
                var c = v[key];
                if (c === child) {
                    var val = tslib_1.__assign({}, v.$value, (_a = {}, _a[key] = child.$value, _a));
                    _setValue(v, val, 1);
                    break;
                }
            }
        }
    }
    else {
        var idx = v.indexOf(child);
        var val = ramda_1.update(idx, child.$value, v.$value);
        _setValue(v, val, 1);
    }
}
function isArrayChild(v) {
    return ramda_adjunct_1.isArray(v);
}
function isRecordChild(v) {
    return !!v.$itemFactory;
}
