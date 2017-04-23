"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_1 = require("../common/abstract");
const alt_1 = require("./alt");
const consume_1 = require("./consume");
const or_1 = require("./or");
const option_1 = require("./option");
const repeat_1 = require("./repeat");
const subrule_1 = require("./subrule");
const ruleRegistry = {
    alt: alt_1.Alt,
    consume: consume_1.Consume,
    or: or_1.Or,
    option: option_1.Option,
    repeat: repeat_1.Repeat,
    subrule: subrule_1.Subrule
};
class Rules extends abstract_1.Abstract {
    constructor(parser, options) {
        super(parser, options);
        this.configure();
    }
    configure() {
        Object.keys(ruleRegistry).map(key => this.createFun(key));
    }
    createFun(name) {
        return (value, options) => {
            let inst = new ruleRegistry[name](this.$, this.options);
            return inst.resolve(value, options);
        };
    }
}
exports.Rules = Rules;
function create(parser, options) {
    return new Rules(parser, options);
}
exports.create = create;
//# sourceMappingURL=index.js.map