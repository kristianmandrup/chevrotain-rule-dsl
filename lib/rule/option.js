"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
class Options extends base_1.Base {
    constructor(parser, options, value) {
        super(parser, options, value);
    }
    parse(value, options) {
        return undefined;
    }
    resolve() {
        let value = this.value;
        this.log('option', value);
        let _rule = (typeof value === 'string') ? this.findRule[value] : value;
        let parsed = this.parse(_rule);
        if (typeof parsed.rule !== 'function') {
            throw new Error(`option must be function, was ${typeof parsed.rule}`);
        }
        let rule = () => this.$.OPTION(parsed.rule);
        let code = parsed.code;
        return { rule, code };
    }
}
exports.Options = Options;
//# sourceMappingURL=option.js.map