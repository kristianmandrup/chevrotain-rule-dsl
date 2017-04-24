"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
const gast_1 = require("../gast");
class Repeat extends base_1.Base {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    calcType(value) {
        if (value.min > 0) {
            return value.sep ? gast_1.ProdType.AT_LEAST_ONE : gast_1.ProdType.AT_LEAST_ONE_SEP;
        }
        return value.sep ? gast_1.ProdType.MANY : gast_1.ProdType.MANY_SEP;
    }
    resolve() {
        let value = this.value;
        this.log('repeat', value);
        let rep = {
            SEP: value.sep,
            DEF: () => { }
        };
        let prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY';
        let type = this.calcType(value);
        let postfix = value.sep ? 'SEP' : null;
        let fun = postfix ? [prefix, postfix].join('_') : prefix;
        this.log('type', fun);
        this.log('separator', rep.SEP);
        let def = value.rule || value.def;
        this.log('def:', def);
        let definition = this.parser.parse(def);
        this.log('definition', definition);
        rep.DEF = () => definition.rule;
        let codeRep = {
            SEP: rep.SEP,
            DEF: definition.code
        };
        this.log('repeat rule:', fun, rep);
        let rule = this.$[fun](rep);
        let code = (`$.${fun}(` + codeRep + ')');
        let node = {
            type,
            sepName: value.sep,
            definition
        };
        return { rule, code, node };
    }
}
exports.Repeat = Repeat;
//# sourceMappingURL=repeat.js.map