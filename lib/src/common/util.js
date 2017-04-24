"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function codeOf(value) {
    return typeof value === 'function' ? value.name : new String(value);
}
exports.codeOf = codeOf;
function isAlt(value) {
    return value && value.parent === 'or';
}
exports.isAlt = isAlt;
function isRepeat(value) {
    return value.repeat || value.sep || value.min || value.def;
}
exports.isRepeat = isRepeat;
function toTokenMap(value) {
    if (Array.isArray(value)) {
        return value.reduce((acc, item) => {
            let name = typeof item === 'function' ? item.name : new String(item);
            acc[name] = item;
        }, {});
    }
    if (typeof value === 'object')
        return value;
    throw new Error(`Invalid tokenMap ${value}`);
}
exports.toTokenMap = toTokenMap;
//# sourceMappingURL=util.js.map