"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
class BaseParser extends base_1.Base {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    config(conf = {}) {
        this.parser = this.parser || conf.parser;
        this.rules = this.rules || conf.rules;
        return this;
    }
}
exports.BaseParser = BaseParser;
//# sourceMappingURL=base.js.map