"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
class Or extends base_1.Base {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    parse(value, options) {
        return undefined;
    }
    resolve(alternatives, options) {
        this.log('or', alternatives);
        let parsed = this.parse(alternatives, { parent: 'or' });
        let code = '$.OR([' + parsed.code + '])';
        let rule = () => this.$.OR(parsed.rule);
        return { rule, code };
    }
}
exports.Or = Or;
//# sourceMappingURL=or.js.map