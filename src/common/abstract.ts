import { Logger } from './logger'

export class Abstract extends Logger {
    options: object
    $: any

    constructor(parser, options = {}) {
        super(options)
        this.$ = parser
        this.options = options        
    }
}