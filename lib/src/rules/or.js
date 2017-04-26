"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const gast_1 = require("../gast");
class Or extends base_1.BaseRule {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    resolve(alternatives, options) {
        this.log('or', alternatives);
        let parsed = this.funs.parse(alternatives, { parent: 'or' });
        let code = '$.OR([' + parsed.code + '])';
        let children = alternatives;
        let type = gast_1.ProdType.OR;
        let node = {
            type,
            children
        };
        let rule = () => this.$.OR(parsed.rule);
        return { rule, code, node };
    }
}
exports.Or = Or;
//# sourceMappingURL=or.js.map