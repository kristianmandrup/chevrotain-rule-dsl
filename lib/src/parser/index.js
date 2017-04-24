"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_1 = require("../common/abstract");
const obj_1 = require("./obj");
const list_1 = require("./list");
const parse_1 = require("./parse");
const option_1 = require("./option");
const repeat_1 = require("./repeat");
const spaced_1 = require("./spaced");
const string_1 = require("./string");
const word_1 = require("./word");
exports.allParsers = {
    ObjParser: obj_1.ObjParser,
    ListParser: list_1.ListParser,
    ValueParser: parse_1.ValueParser,
    OptionParser: option_1.OptionParser,
    RepeatParser: repeat_1.RepeatParser,
    SpacedParser: spaced_1.SpacedParser,
    StringParser: string_1.StringParser,
    WordParser: word_1.WordParser
};
const parserRegistry = {
    obj: obj_1.ObjParser,
    list: list_1.ListParser,
    option: option_1.OptionParser,
    parse: parse_1.ValueParser,
    repeat: repeat_1.RepeatParser,
    spaced: spaced_1.SpacedParser,
    word: word_1.WordParser
};
class RulesParser extends abstract_1.Abstract {
    constructor(parser, options) {
        super(parser, options);
        this.configure();
    }
    configure() {
        let keys = Object.keys(parserRegistry);
        console.log('configure parsers', keys);
        keys.map(key => {
            console.log('add parser', key);
            this[key] = this.createFun(key);
        });
    }
    createFun(name) {
        return (value, options) => {
            let inst = new parserRegistry[name](this.$, this.options);
            return inst.resolve(value, options);
        };
    }
}
exports.RulesParser = RulesParser;
function create(parser, options) {
    return new RulesParser(parser, options);
}
exports.create = create;
//# sourceMappingURL=index.js.map