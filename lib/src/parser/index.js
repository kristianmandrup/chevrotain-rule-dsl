"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic_1 = require("../common/basic");
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
    string: string_1.StringParser,
    word: word_1.WordParser
};
class RulesParser extends basic_1.Basic {
    constructor(parser, options) {
        super(parser, options);
        // this.configure()
    }
    configure() {
        let keys = Object.keys(parserRegistry);
        console.log('configure parsers', keys);
        keys.map(key => {
            console.log('add parser', key);
            this[key] = this.resolverFor(key);
        });
        return this;
    }
    resolverFor(name) {
        let inst = new parserRegistry[name](this.$, this.options);
        inst.config({ parser: this });
        return inst.resolve.bind(inst);
    }
}
exports.RulesParser = RulesParser;
function create(parser, options) {
    return new RulesParser(parser, options);
}
exports.create = create;
//# sourceMappingURL=index.js.map