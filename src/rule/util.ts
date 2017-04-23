export function codeOf(value) {
  return typeof value === 'function' ? value.name : new String(value)
}

export function isAlt(value) {
  return value && value.parent === 'or'
}

export function isRepeat(value) {
    return value.repeat || value.sep || value.min || value.def
}

export function toTokenMap(value) {
  if (Array.isArray(value)) {
    return value.reduce((acc, item) => {
      let name = typeof item === 'function' ? item.name : new String(item)
      acc[name] = item
    }, {})
  }
  if (typeof value === 'object') return value
  throw new Error(`Invalid tokenMap ${value}`)
}