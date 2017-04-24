"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
const gast_1 = require("../gast");
const parser_1 = require("../parser");
class Alt extends base_1.Base {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    config() {
        this.parser = new parser_1.RulesParser(this.$, this.options).configure();
        return this;
    }
    resolve(value, options) {
        this.log('alt', value);
        let parsedRule = this.parser.parse(value);
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