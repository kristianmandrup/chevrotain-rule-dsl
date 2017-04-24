"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class RepeatParser extends base_1.BaseParser {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    resolve(rule, options) {
        // repeat
        const regExp = /\(([^)]+)\)([+\*])/;
        let matches = regExp.exec(rule);
        if (matches && matches.length > 0) {
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
}
exports.RepeatParser = RepeatParser;
//# sourceMappingURL=repeat.js.map