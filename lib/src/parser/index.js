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
class Parsers extends basic_1.Basic {
    constructor(parser, options) {
        super(parser, options);
        this.configured = false;
    }
    config(ctx) {
        console.log('Parser config', this.parserKeys);
        this.parserKeys.map(key => {
            this[key].config(ctx);
        });
    }
    configure() {
        if (this.configured)
            return;
        this.parserKeys = Object.keys(parserRegistry);
        console.log('Parser configure', this.parserKeys);
        this.parserKeys.map(key => {
            console.log('add parser', key);
            this[key] = this[key] || this.resolverFor(key);
        });
        this.configured = true;
        return this;
    }
    resolverFor(name) {
        return new parserRegistry[name](this.$, this.options);
    }
}
exports.Parsers = Parsers;
function create(parser, options) {
    return new Parsers(parser, options);
}
exports.create = create;
//# sourceMappingURL=index.js.map