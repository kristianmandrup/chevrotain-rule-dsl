"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
const gast_1 = require("../gast");
class Alt extends base_1.Base {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    resolve(value, options) {
        this.log('alt', value);
        let parsedRule = this.parser.parse(value);
        let code = '{ALT: () => {\n ' + parsedRule.code + '\n}}';
        let rule = { ALT: parsedRule.rule };
        let type = gast_1.ProdType.FLAT;
        let node = {
            type,
            definition: parsedRule.rule
        };
        return { rule, code, node };
    }
}
exports.Alt = Alt;
//# sourceMappingURL=alt.js.map