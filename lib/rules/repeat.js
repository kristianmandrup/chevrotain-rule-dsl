"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
class Repeat extends base_1.Base {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    resolve() {
        let value = this.value;
        this.log('repeat', value);
        let rep = {
            SEP: '',
            DEF: () => { }
        };
        let prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY';
        let postfix = value.sep ? 'SEP' : null;
        let fun = postfix ? [prefix, postfix].join('_') : prefix;
        this.log('type', fun);
        rep.SEP = value.sep;
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
        return { rule, code };
    }
}
exports.Repeat = Repeat;
//# sourceMappingURL=repeat.js.map