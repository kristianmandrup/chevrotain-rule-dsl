"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
class Select extends chevrotain_1.Token {
}
Select.PATTERN = /SELECT/;
exports.Select = Select;
class From extends chevrotain_1.Token {
}
From.PATTERN = /FROM/;
exports.From = From;
class Where extends chevrotain_1.Token {
}
Where.PATTERN = /WHERE/;
exports.Where = Where;
class Comma extends chevrotain_1.Token {
}
Comma.PATTERN = /,/;
exports.Comma = Comma;
class Identifier extends chevrotain_1.Token {
}
Identifier.PATTERN = /\w+/;
exports.Identifier = Identifier;
class Integer extends chevrotain_1.Token {
}
Integer.PATTERN = /0|[1-9]\d+/;
exports.Integer = Integer;
class GreaterThan extends chevrotain_1.Token {
}
GreaterThan.PATTERN = /</;
exports.GreaterThan = GreaterThan;
class LessThan extends chevrotain_1.Token {
}
LessThan.PATTERN = />/;
exports.LessThan = LessThan;
class WhiteSpace extends chevrotain_1.Token {
}
WhiteSpace.PATTERN = /\s+/;
WhiteSpace.GROUP = chevrotain_1.Lexer.SKIPPED;
exports.WhiteSpace = WhiteSpace;
exports.allTokens = [WhiteSpace, Select, From, Where, Comma, Identifier, Integer, GreaterThan, LessThan];
exports.SelectLexer = new chevrotain_1.Lexer(exports.allTokens);
// let inputText = "SELECT column1 FROM table2"
// let lexingResult = SelectLexer.tokenize(inputText)
//# sourceMappingURL=lexer.js.map