"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const gast_1 = require("../gast");
class Option extends base_1.BaseRule {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    resolve(value, options) {
        this.log('option', value);
        let ruleRef = (typeof value === 'string') ? this.findRule(value) : value;
        if (!ruleRef) {
            // this.error(`Not a ruleRef: ${ruleRef}`)
            ruleRef = value;
        }
        let parsed = this.funs.parse(ruleRef);
        if (typeof parsed.rule !== 'function') {
            this.error(`option must be function, was ${typeof parsed.rule}`);
        }
        let rule = () => this.$.OPTION(parsed.rule);
        let code = `() => this.$.OPTION(${parsed.code})`;
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