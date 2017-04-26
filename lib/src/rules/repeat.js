"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const gast_1 = require("../gast");
function calcType(value) {
    if (value.min > 0) {
        return value.sep ? gast_1.ProdType.AT_LEAST_ONE : gast_1.ProdType.AT_LEAST_ONE_SEP;
    }
    return value.sep ? gast_1.ProdType.MANY : gast_1.ProdType.MANY_SEP;
}
class Repeat extends base_1.BaseRule {
    constructor(parser, options, value) {
        super(parser, options, value);
        this.parseKeys = [
            'parse'
        ];
    }
    resolve(value, options) {
        const log = this.logger('repeat');
        log({ value, options });
        if (typeof value !== 'object') {
            this.error(`Repeat rule must take an object, was: ${value}`);
        }
        let sep = value.sep;
        let rep = {};
        if (sep) {
            rep['SEP'] = sep;
        }
        log('rep', rep);
        let prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY';
        let type = calcType(value);
        let postfix = value.sep ? 'SEP' : false;
        let fun = postfix ? [prefix, postfix].join('_') : prefix;
        log('type', fun);
        let def = value.rule || value.def;
        log('def', def);
        let definition = this.funs.parse(def);
        log('definition', definition);
        rep['DEF'] = () => definition.rule;
        let defCode = definition.code;
        let codeDEF = `() => {\n${defCode}\n}`;
        let codeRep = {
            DEF: codeDEF
        };
        if (sep) {
            codeRep['SEP'] = sep;
        }
        log('rule:', fun, rep, codeRep);
        let ruleFun = this.$[fun];
        let rule = ruleFun(rep);
        let code = `$.${fun}(${codeRep})`;
        let node = {
            type,
            definition
        };
        if (sep) {
            node['sepName'] = sep;
        }
        log({ node });
        return { rule, code, node };
    }
}
exports.Repeat = Repeat;
//# sourceMappingURL=repeat.js.map