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
 * 将某项从数组中移除
 */
export function remove (arr: Array<any>, item: any) {
  arr.some((element, index) => {
    if (item.id === element.id) {
      arr.splice(index, 1)
      return true
    }
  })
}

/**
 * 空函数
 */
export function noop () {}

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
  return (
    a === b ||
    (isObject(a) && isObject(b) ?
      JSON.stringify(a) === JSON.stringify(b) :
      false)
  )
}

/**
 * 检验是否是对象
 */
export function isObject (obj: any) {
  return obj !== null && typeof obj === 'object'
}

/**
 * 宽送地比较是否为空值
 */
export function isEmpty (a: any) {
  if (a == null ||
    JSON.stringify(a) === '{}' ||
    JSON.stringify(a) === '[]'
  ) return true
  else return false
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
