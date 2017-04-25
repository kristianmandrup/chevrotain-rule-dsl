"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const util = require("../common/util");
const gast_1 = require("../gast");
class Consume extends base_1.BaseRule {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    // must be a Token
    resolve(value, options) {
        this.log('consume', value);
        let token = this.resolveToken(value);
        let code = '$.CONSUME(' + util.codeOf(token) + ')';
        let $ = this.$;
        let rule = () => $.CONSUME(token).bind($);
        let type = gast_1.ProdType.TERMINAL;
        let name = (typeof value === 'string') ? value : value.toString();
        let node = {
            type,
            name
        };
        return { rule, code, node };
    }
}
exports.Consume = Consume;
//# sourceMappingURL=consume.js.map