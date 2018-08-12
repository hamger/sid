import Dep from './dep'
import { arrayMethods } from './array'
import { def } from '../util/util'

/*
确保在调用时，先调用到自定义的方法。有两种方式可以实现：
- 数组对象上直接有该方法，这样就不会去找对象上的原型链
- 覆盖对象的 __proto__ ，这样寻找原型链时，就会先找到我们的方法
*/
// 如果能使用 __proto__ 则将数组的处理方法进行替换
function protoAugment(target: any, src: any) {
  target.__proto__ = src
}
// 如果不能使用 __proto__ 则直接将该方法定义在当前对象下
function copyAugment(target: any, src: any, keys: Array<string>) {
  for (let i = 0; i < keys.length; i++) {
    def(target, keys[i], src[keys[i]])
  }
}

/**
 * 将对象下的某个属性变成可监听结构（响应化数据）
 */
function defineReactive(object: Object, key: string, value: any) {
  // 每一个属性中都存在一个 dep，用于管理依赖于属性的 watcher
  let dep = new Dep()
  let childOb = observe(value)
  Object.defineProperty(object, key, {
    configurable: true,
    enumerable: true,
    get: function() {
      if (Dep.target) {
        // 添加 watcher 到 dep.subs，添加 dep 到 watcher.deps
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function(newValue) {
      if (newValue !== value) {
        value = newValue
        dep.notify()
      }
    }
  })
}

class Observer {
  value: any
  dep: Dep
  vmCount: number
  constructor(value: any) {
    this.value = value
    this.dep = new Dep() // 支持 Observer 实例调用 dep 的方法
    def(value, '__ob__', this)
    // 和对象处理不同的是，数组长度不能确定，一开始定义索引的 get/set 没有意义，所以这里并没有对索引使用 defineReactive
    if (Array.isArray(value)) {
      // 兼容某些浏览器不支持 Object.prototype.__proto__ 的情况
      const augment = '__proto__' in {} ? protoAugment : copyAugment
      // 改变数组原生方法，使得调用改变数据的方法时（例如 arr.push）得以响应数据
      augment(value, arrayMethods, Object.keys(arrayMethods))
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(obj: any) {
    // Object.keys() 对数组也有作用，输出["0", "1", ...]
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  /**
   * 观察数组的每一项
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

export default function observe(value: any): Observer | void {
  // 非对象无需进行 defineReactive
  if (typeof value !== 'object') return
  let ob
  // 如果对象下有 Observer 则不需要再次生成 Observer（不同的引用名指向同一个地址的情况）
  if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (Object.isExtensible(value)) {
    ob = new Observer(value)
  }
  return ob
}

/**
 * 在变更数组元素时收集对数组元素的依赖关系，因为
 * 我们不能利用属性 getter 来拦截对数组元素的访问
 */
function dependArray(value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
