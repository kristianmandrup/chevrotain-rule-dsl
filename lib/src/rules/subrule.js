"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const gast_1 = require("../gast");
class Subrule extends base_1.BaseRule {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    resolve(value) {
        let fun = 'SUBRULE';
        this.log('subrule', value);
        let ruleRef = this.resolveRuleRef(value);
        if (!ruleRef) {
            throw new Error(`ruleRef could not be resolved for: ${value}`);
        }
        let name = (typeof value === 'string') ? ruleRef : ruleRef.toString();
        this.log('subrule', { ruleRef, name });
        let repeatCount = 0;
        // auto-detect reuse of subrule!
        if (this.usedRules[fun]) {
            this.log('repeat rule');
            fun = 'SUBRULE2';
            repeatCount++;
        }
        this.usedRules[fun] = true;
        let code = `$.${fun}(` + name + ')';
        let rule = () => this.$[fun](ruleRef);
        let type = gast_1.ProdType.REF;
        let node = {
            type,
            name,
            repeatCount
        };
        return { rule, code, node };
    }
}
exports.Subrule = Subrule;
//# sourceMappingURL=subrule.js.map