import { Logger } from './logger'

export class Basic extends Logger {
    options: object
    $: any

    constructor(parser, options = {}) {
        super(options)
        this.validate(parser)
        this.$ = parser
        this.options = options        
    }

    protected validate(parser) {
        if (!(parser && parser.RULE)) {
            console.error('parser', parser)
            throw new Error('RuleParser must be created with a Parser instance that has a public RULE method')
        }
    }
}