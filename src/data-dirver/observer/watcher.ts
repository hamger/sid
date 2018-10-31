import Dep, { pushTarget, popTarget } from './dep'

// 解析链式引用，parsePath(a.b.c) 返回一个函数: obj => obj.a.b.c
const bailRE = /[^\w.$]/
function parsePath(path: string) {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function(obj?: any) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}

// 判断某项是否在数组中
function isHas (arr: Array<any>, item: any) {
  if (arr.some((element) => {
    if (item.id === element.id) return true
  })) {
    return true
  } else {
    return false
  }
}

let id = 0

export default class Watcher {
  id: number
  obj: Object
  callback: Function
  deps: Array<Dep>
  newDeps: Array<Dep>
  getter: Function
  value: any

  constructor(obj: Object, expOrFn: string | Function, callback: Function) {
    this.id = id++
    this.obj = obj
    this.callback = callback
    // 每次数据变化都会重新执行 this.getter() ，并再次触发数据的 getters，所以数据的依赖会被重新收集
    // 在重新收集的过程中，可能会存在一些可以复用的 dep ，所以分别用两个数组来保存所有的 dep 
    // 复用的目的是减少 dep.addWatcher(this) 和 dep.removeWatcher(this) 的多次操作
    this.deps = [] // 表示上一次添加的 Dep 实例数组，以下简称：旧 deps
    this.newDeps = [] // 表示新添加的 Dep 实例数组，以下简称：新 deps

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) this.getter = function() {}
    }
    this.value = this.get()
  }

  // 添加监听，并取值
  get() {
    pushTarget(this)
    const value = this.getter.call(this.obj, this.obj)
    popTarget()
    this.cleanupDeps()
    return value
  }

  // 更新值，并触发监听
  update() {
    const value = this.get()
    if (value !== this.value) {
      const oldValue = this.value
      this.value = value
      this.callback.call(this.obj, value, oldValue)
    }
  }

  // 添加一个依赖（保证同一数据不会被添加多次）
  addDep(dep: Dep) {
    if (!isHas(this.newDeps, dep)) {
      // 如果新 deps 中不存在该 dep ，将其添加新 deps
      this.newDeps.push(dep)
      // 如果旧 deps 中不存在该 dep ，将其添加旧 deps
      // 如果已经有了就不需要添加，此时就实现了 dep 的复用
      if (!isHas(this.deps, dep)) dep.addWatcher(this)
    }
  }

  /**
   * 依赖管理（把多余的 watcher 移除）
   */
  cleanupDeps() {
    this.deps.forEach(dep => {
      // 如果旧 deps 中存在新 deps 中不存在的 dep，需要将其移除
      if (!isHas(this.newDeps, dep)) dep.removeWatcher(this)
    })
    // 将旧 deps 和新 deps 交换，最后清空旧 deps（长江后浪推前浪，前浪死在沙滩上）
    /**
     * 这里不能写为
     * this.deps = this.newDeps
     * this.newDeps.length = 0
     * 因为引用类型赋值导致 this.deps 和 this.newDeps 指向统一地址
     * 当清空 this.newDeps 同时也意味着 this.deps 被清空
     * 所以需要引入一个中间变量 tmp
     */
    let tmp = this.deps // 开辟一个新指针 tmp，指向旧 deps
    this.deps = this.newDeps // 将 this.deps 指针指向新添加的 Dep 实例数组
    this.newDeps = tmp // 将 this.newDeps 指针指向旧 deps
    this.newDeps.length = 0 // 清空旧 deps
  }

  // watcher 拆卸自己：通知所有的 dep 移除自己（调用 dep.removeWatcher(watcher) 移除 wather）
  teardown() {
    let i = this.deps.length
    while (i--) this.deps[i].removeWatcher(this)
    this.deps = []
  }
}
