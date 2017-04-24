"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./common/base");
const util = require("./common/util");
class RuleParser extends base_1.Base {
    constructor(parser, options = { logging: false, logMap: {}, registry: null, tokenMap: {} }) {
        super(parser, options);
    }
    parse(rule, options = {}) {
        this.log('parse', rule, options);
        if (Array.isArray(rule)) {
            return this.parseList(rule, options);
        }
        if (this.findToken(rule)) {
            this.log('consume since rule is token', rule);
            return this.consume(rule, options);
        }
        if (typeof rule === 'object') {
            return this.parseObj(rule, options);
        }
        // if string, always assume subrule
        if (typeof rule === 'string') {
            return this.parseString(rule, options);
        }
        if (typeof rule === 'function') {
            return { rule, code: rule.name };
        }
        throw new Error(`Invalid rule(s) ${typeof rule}`);
    }
    parseRepeat(rule, options) {
        // repeat
        const regExp = /\(([^)]+)\)([+\*])/;
        let matches = regExp.exec(rule);
        if (matches && matches.length > 0) {
            let words = matches[1].split(/\s+/);
            let lastWord = words.splice(-1, 1);
            let sep = lastWord;
            let min = matches[2] == '+' ? 1 : 0;
            return this.repeat({
                sep,
                min,
                def: words.join(' ')
            });
        }
    }
    parseOption(rule, options) {
        const regExp = /\(([^)]+)\)(\?)/;
        let matches = regExp.exec(rule);
        if (matches && matches.length > 0) {
            return this.option(matches[1]);
        }
    }
    parseSpaced(rule, options) {
        // two or more word with spaces between?
        if (/\S+\s+\S+/.test(rule)) {
            this.log('parse space separation', rule);
            // or rule
            let orExp = /\sor\s/;
            let pipeExp = /\|/;
            let or = orExp.test(rule);
            let orPipe = pipeExp.test(rule);
            // if separator is either 'or' OR '|'
            if (or || orPipe) {
                let splitExp = or ? orExp : pipeExp;
                this.log('or rule: split', splitExp);
                let alternatives = rule.split(splitExp).map(alt => alt.trim());
                return this.or(alternatives);
            }
            else {
                this.log('split rules by space', options);
                let list = rule.split(/\s+/).map(item => item.trim());
                return this.parseList(list, options);
            }
        }
    }
    // TODO: extract to separate class
    parseString(rule, options) {
        this.log('parseString', rule);
        return this.parseRepeat(rule, options) ||
            this.parseOption(rule, options) ||
            this.parseSpaced(rule, options) ||
            this.parseWord(rule, options);
    }
    parseWord(rule, options) {
        return this.findToken(rule) ? this.consume(rule, options) : this.subrule(rule, options);
    }
    parseList(rules, options) {
        var flat = (r, a) => Array.isArray(a) ? a.reduce(flat, r) : r.concat(a);
        this.log('parseList', rules, options);
        let alt = util.isAlt(options);
        let codeJoin = alt ? ',' : '\n';
        let parser = alt ? 'alt' : 'parse';
        // reset options if parent is 'or'
        if (alt) {
            options = {};
        }
        this.log('item parser', parser, options);
        rules = rules.reduce(flat, []);
        let parsedRules = rules.map(rule => this[parser](rule, options));
        let codeStmts = parsedRules.map(pr => pr.code).join(codeJoin);
        this.log('parsedRules', parsedRules);
        this.log('codeStmts', codeStmts);
        let rule = () => {
            parsedRules.map(pr => pr.rule());
        };
        this.log('rule', rule);
        let code = alt ? codeStmts : '() => {\n' + codeStmts + '\n}\n';
        let result = {
            rule,
            code
        };
        this.log('parsedList', result);
        return result;
    }
    parseObj(rule, options) {
        this.log('parseObj', rule, options);
        if (util.isAlt(options)) {
            return this.alt(rule);
        }
        if (util.isRepeat(rule)) {
            return this.repeat(rule);
        }
        let key = Object.keys(rule)[0];
        let value = rule[key];
        switch (key) {
            case 'rule':
                return this.subrule(value);
            case 'rule2':
                return this.subrule(value, 'SUBRULE2');
            case 'option':
                return this.option(value);
            case 'consume':
                return this.consume(value);
            case 'repeat':
                return this.repeat(value);
            case 'alt':
                return this.alt(value);
            case 'or':
                return this.or(value);
            default:
                throw new Error(`Unknown key in rule object: ${key}`);
        }
    }
    subrule(value, options) {
        let fun = 'SUBRULE';
        this.log('subrule', value);
        let _rule = (typeof value === 'string') ? this.findRule(value) : value;
        // auto-detect reuse of subrule!
        if (this.usedRules[fun]) {
            this.log('repeat rule');
            fun = 'SUBRULE2';
        }
        this.usedRules[fun] = true;
        let code = `$.${fun}(` + _rule + ')';
        let rule = () => this.$[fun](rule);
        return { rule, code };
    }
    // must be a Token
    consume(value, options) {
        this.log('consume', value);
        let token = this.resolveToken(value);
        let code = '$.CONSUME(' + util.codeOf(token) + ')';
        let $ = this.$;
        let rule = () => $.CONSUME(token).bind($);
        let result = { rule, code };
        this.log('consumed', result);
        return result;
    }
    alt(value, options) {
        this.log('alt', value);
        let parsedRule = this.parse(value);
        let code = '{ALT: () => {\n ' + parsedRule.code + '\n}}';
        let rule = { ALT: parsedRule.rule };
        return { rule, code };
    }
    repeat(value, options) {
        this.log('repeat', value);
        let rep = {
            SEP: '',
            DEF: () => { }
        };
        let prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY';
        let postfix = value.sep ? 'SEP' : null;
        let fun = postfix ? [prefix, postfix].join('_') : prefix;
        this.log('type', fun);
        rep.SEP = value.sep || value.separator;
        this.log('separator', rep.SEP);
        let def = value.rule || value.def;
        this.log('def:', def);
        let definition = this.parse(def);
        this.log('definition', definition);
        rep.DEF = () => definition.rule;
        let codeRep = {
            SEP: rep.SEP,
            DEF: definition.code
        };
        this.log('repeat rule:', fun, rep);
        let rule = this.$[fun](rep);
        let code = (`$.${fun}(` + codeRep + ')');
        return { rule, code };
    }
    or(alternatives, options) {
        this.log('or', alternatives);
        let parsed = this.parse(alternatives, { parent: 'or' });
        let code = '$.OR([' + parsed.code + '])';
        let rule = () => this.$.OR(parsed.rule);
        return { rule, code };
    }
    option(value, options) {
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
    rule(name, rule, config) {
        this.log('rule', name, rule);
        if (typeof name !== 'string') {
            throw new Error(`rule name must be a valid name (string), was ${name}`);
        }
        let $ = this.$;
        let parserRule = () => $.RULE(name, rule, config).bind($);
        return parserRule;
    }
    createRule(name, rules, options) {
        options = options || {};
        this.configureLog(options);
        let parsed = this.parse(rules, options);
        this.log('createRule', 'parsed.rule', parsed.rule);
        options.code = options.code || parsed.code;
        this.codeStr = parsed.code;
        this.log('createRule', 'parsed.code', parsed.code);
        let parsedRule = this.rule(name, parsed.rule, options);
        this.log('createRule', 'parsedRule', parsedRule);
        this.register(name, parsedRule);
        return parsedRule;
    }
}
exports.RuleParser = RuleParser;
function rule(parser, name, rules, options) {
    return new RuleParser(parser, options).createRule(name, rules, options);
}
exports.rule = rule;
//# sourceMappingURL=legacy.js.map