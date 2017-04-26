"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const repeatExp = /\(([^)]+)\)([+\*])/;
class RepeatParser extends base_1.BaseParser {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    resolve(value, options) {
        // repeat
        this.log('repeat', value, options);
        let matches = repeatExp.exec(value);
        if (!(matches && matches.length > 0)) {
            return;
        }
        let words = matches[1].split(/\s+/);
        let lastWord = words.splice(-1, 1);
        let sep = lastWord;
        let min = matches[2] == '+' ? 1 : 0;
        return this.rules.repeat({
            sep,
            min,
            def: words.join(' ')
        });
    }
}
exports.RepeatParser = RepeatParser;
//# sourceMappingURL=repeat.js.map