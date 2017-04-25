"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const gast_1 = require("../gast");
class Alt extends base_1.BaseRule {
    constructor(parser, options, value) {
        super(parser, options, value);
        this.parserKeys = [
            'parse'
        ];
    }
    resolve(value, options) {
        this.log('alt', value);
        console.log('parsers', this.parsers.funs);
        let parsedRule = this.funs.parse(value);
        console.log('parsedRule', parsedRule);
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