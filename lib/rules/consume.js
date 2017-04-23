"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
const util = require("../common/util");
const gast_1 = require("../gast");
class Consume extends base_1.Base {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    // must be a Token
    resolve() {
        let value = this.value;
        this.log('consume', value);
        let token = this.resolveToken(value);
        let code = '$.CONSUME(' + util.codeOf(token) + ')';
        let $ = this.$;
        let rule = () => $.CONSUME(token).bind($);
        let type = gast_1.ProdType.FLAT;
        let children = []; // TODO
        let node = {
            type,
            children
        };
        return { rule, code, node };
    }
}
exports.Consume = Consume;
//# sourceMappingURL=consume.js.map