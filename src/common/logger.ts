export interface ILogging {
  logging?: boolean
  logRule?: boolean
  logMap?: object  
}

export class Logger implements ILogging {
  logging: boolean
  logMap: {}

  constructor(options) {
    this.configureLog(options)
  }

  protected configureLog(options:ILogging = {}) {
    this.logMap = options.logMap || this.logMap || {}
    this.logging = (options.logging || Object.keys(this.logMap).length > 0 || this.logging) === true
  }

  get islogging() {
    return this.logging === true
  }

  isMapped(rule) {
    if (!this.logMap) return true
    return this.logMap && this.logMap[rule]
  }

  log(rule, ...args) {
    if (this.islogging) {
      if (this.isMapped(rule)) {
      console.log(rule, ...args)
    }
    } 
  }
}
