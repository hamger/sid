import { def } from '../util/util'

const arrayProto = Array.prototype as any
// Object.create 返回一个具有数组原型的新对象
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * 拦截突变方法并发出事件
 */
methodsToPatch.forEach(function (method: string): void {
  const original = arrayProto[method] // 劫持数组的原生方法

  const mutator = function (...args: any[]) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 如果新增了元素，对该元素进行观察
    if (inserted) ob.observeArray(inserted)
    ob.dep.notify()
    return result
  }

  def(arrayMethods, method, mutator)
})

// 当根据索引给数组赋值时（array[1] = 10），手动调用该函数，监听数组并触发回调
arrayMethods.$apply = function () {
  this.__ob__.observeArray(this)
  this.__ob__.dep.notify()
}
