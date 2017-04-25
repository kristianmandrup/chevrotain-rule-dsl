"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const gast_1 = require("../gast");
class Option extends base_1.BaseRule {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    resolve() {
        let value = this.value;
        this.log('option', value);
        let _rule = (typeof value === 'string') ? this.findRule[value] : value;
        let parsed = this.parser.parse(_rule);
        if (typeof parsed.rule !== 'function') {
            throw new Error(`option must be function, was ${typeof parsed.rule}`);
        }
        let rule = () => this.$.OPTION(parsed.rule);
        let code = parsed.code;
        let type = gast_1.ProdType.OPTION;
        let nested = parsed.node;
        let children = Array.isArray(nested) ? nested : [nested];
        let node = {
            type,
            children
        };
        return { rule, code, node };
    }
}
exports.Option = Option;
//# sourceMappingURL=option.js.map