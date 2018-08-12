/**
 * 为 obj.key 赋值并添加属性描述
 */
export function def (obj: any, key: string, value: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: value,
    writable: true,
    configurable: true,
    enumerable: !!enumerable
  })
}

/**
 * 代理到 target 对象
 */
export function proxy (target: any, sourceKey: string, key: string) {
  const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get () {},
    set(v: any) {}
  }
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val: any) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

/**
 * 转换为字符串
 */
export function _toString (val: any) {
  // JSON.stringify(val, null, 2) 将对象美观的打印出来，换行，缩进为2个空格
  return val == null ?
    '' :
    typeof val === 'object' ?
      JSON.stringify(val, null, 2) :
      String(val)
}

/**
 * 转换为数字
 */
export function toNumber (val: any) {
  const n = parseFloat(val)
  return n || n === 0 ? n : val
}

/**
 * 将某项从数组中移除
 */
export function remove (arr: Array<any>, item: any) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * 检验对象本身是否有该属性
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object, key: string) {
  return hasOwnProperty.call(obj, key)
}

/**
 * 检验是否为原始类型（字符串或者数字）
 */
export function isPrimitive (value: any) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * 转为一个类数组对象为一个数组
 */
export function toArray (list: any, start: number) {
  start = start || 0
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * 判断是否是一个 DOM 对象
 */
export function isDOM (value: any) {
  if (typeof HTMLElement === 'object') {
    return value instanceof HTMLElement
  } else {
    return (
      value &&
      typeof value === 'object' &&
      value.nodeType === 1 &&
      typeof value.nodeName === 'string'
    )
  }
}

/**
 * 检验是否是对象
 */
export function isObject (obj: any) {
  return obj !== null && typeof obj === 'object'
}

/**
 * 严格检验是否是对象
 */
const toString = Object.prototype.toString
export function isPlainObject (obj: any) {
  return toString.call(obj) === '[object Object]'
}

/**
 * 空函数
 */
export function noop () {}

/**
 * 返回 false 的函数
 */
export const no = () => false

/**
 * 返回 空对象 的函数
 */
export const empty = () => {
  return {}
}

/**
 * 宽送地比较两个值是否相等，对象类型通过 JSON.stringify 转换再进行比较
 */
export function looseEqual (a: any, b: any) {
  /* eslint-disable eqeqeq */
  return (
    a == b ||
    (isObject(a) && isObject(b) ?
      JSON.stringify(a) === JSON.stringify(b) :
      false)
  )
  /* eslint-enable eqeqeq */
}

/**
 * 宽送地比较是否为空值
 */
export function isEmpty (a: any) {
  /* eslint-disable eqeqeq */
  if (a == null ||
    JSON.stringify(a) === '{}' ||
    JSON.stringify(a) === '[]'
  ) return true
  else return false
  /* eslint-enable eqeqeq */
}

/**
 * 宽送地定位某个值的在数组中的位置
 */
export function looseIndexOf (arr: Array<any>, val: any) {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}

/**
 * warn of Amus
 */
export function warn (msg: any) {
  console.error(`[Amus warn]: ${msg}`)
}
