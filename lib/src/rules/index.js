"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic_1 = require("../common/basic");
const alt_1 = require("./alt");
const consume_1 = require("./consume");
const or_1 = require("./or");
const option_1 = require("./option");
const repeat_1 = require("./repeat");
const subrule_1 = require("./subrule");
exports.allRules = {
    Alt: alt_1.Alt,
    Consume: consume_1.Consume,
    Or: or_1.Or,
    Option: option_1.Option,
    Repeat: repeat_1.Repeat,
    Subrule: subrule_1.Subrule
};
const ruleRegistry = {
    alt: alt_1.Alt,
    consume: consume_1.Consume,
    or: or_1.Or,
    option: option_1.Option,
    repeat: repeat_1.Repeat,
    subrule: subrule_1.Subrule
};
class Rules extends basic_1.Basic {
    constructor(parser, options) {
        super(parser, options);
        this.configured = false;
    }
    config(ctx) {
        console.log('Rules config', this.ruleKeys);
        this.ruleKeys.map(key => {
            this[key].config(ctx);
        });
    }
    configure() {
        if (this.configured)
            return;
        this.ruleKeys = Object.keys(ruleRegistry);
        console.log('Rules configure', this.ruleKeys);
        this.ruleKeys.map(key => {
            console.log('add rule', key);
            this[key] = this[key] || this.resolverFor(key);
        });
        this.configured = true;
        return this;
    }
    resolverFor(name) {
        return new ruleRegistry[name](this.$, this.options);
    }
}
exports.Rules = Rules;
function createRules(parser, options) {
    return new Rules(parser, options);
}
exports.createRules = createRules;
//# sourceMappingURL=index.js.map