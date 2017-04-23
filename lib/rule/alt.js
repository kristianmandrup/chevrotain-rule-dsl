"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
class Alt extends base_1.Base {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    parse(value, options) {
        return undefined;
    }
    alt(value, options) {
        this.log('alt', value);
        let parsedRule = this.parse(value);
        let code = '{ALT: () => {\n ' + parsedRule.code + '\n}}';
        let rule = { ALT: parsedRule.rule };
        return { rule, code };
    }
}
exports.Alt = Alt;
//# sourceMappingURL=alt.js.map