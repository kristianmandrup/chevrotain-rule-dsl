"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
const gast_1 = require("../gast");
class Subrule extends base_1.Base {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    resolve() {
        let value = this.value;
        let fun = 'SUBRULE';
        this.log('subrule', value);
        let _rule = (typeof value === 'string') ? this.findRule(value) : value;
        let name = (typeof value === 'string') ? value : value.toString();
        let repeatCount = 0;
        // auto-detect reuse of subrule!
        if (this.usedRules[fun]) {
            this.log('repeat rule');
            fun = 'SUBRULE2';
            repeatCount++;
        }
        this.usedRules[fun] = true;
        let code = `$.${fun}(` + _rule + ')';
        let rule = () => this.$[fun](rule);
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