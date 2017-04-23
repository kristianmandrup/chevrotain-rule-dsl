"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
class Option extends base_1.Base {
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
        return { rule, code };
    }
}
exports.Option = Option;
//# sourceMappingURL=option.js.map