import Dep, { pushTarget, popTarget } from './dep'
import { remove } from '../util/util'

// 解析链式引用，parsePath(a.b.c) 返回一个函数 obj => obj.a.b.c
const bailRE = /[^\w.$]/
export function parsePath(path: string) {
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

let id = 0

export default class Watcher {
  id: number
  dd: Object
  callback: Function
  dep: Array<Dep>
  depId: Set<number>
  newDep: Array<Dep>
  newDepId: Set<number>
  getter: Function
  value: any

  constructor(dd: Object, expOrFn: string | Function, callback: Function) {
    this.id = id++
    this.dd = dd
    this.callback = callback
    this.dep = []
    this.depId = new Set()
    this.newDep = []
    this.newDepId = new Set()

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function() {}
      }
    }
    this.value = this.get()
  }

  // 添加监听，并取值
  get() {
    pushTarget(this)
    const value = this.getter.call(this.dd, this.dd)
    popTarget()
    this.cleanupDep()
    return value
  }

  // 更新值，并触发监听
  update() {
    // const value = this.getter.call(this.dd, this.dd)
    const value = this.get()
    if (value !== this.value) {
      const oldValue = this.value
      this.value = value
      this.callback.call(this.dd, value, oldValue)
    }
  }

  // 添加一个依赖
  addDep(dep: Dep) {
    const id = dep.id
    if (!this.newDepId.has(id)) {
      this.newDep.push(dep)
      this.newDepId.add(id)
      // 如果没 dep 有添加该 watcher 则添加之，防止重复添加
      if (!this.depId.has(id)) dep.addWatcher(this)
    }
    // this.dep.push(dep)
    // dep.addWatcher(this)
  }

  /**
   * 清除 newDepIds 和 newDep 上记录的对 dep 的订阅信息
   */
  cleanupDep() {
    let i = this.dep.length
    while (i--) {
      const dep = this.dep[i]
      if (!this.newDepId.has(dep.id)) {
        dep.removeWatcher(this)
      }
    }
    // 缓存将要被移除的 newDepId 和 newDep，减少之后的重复添加
    // 使用 depId 存放 newDepId，然后清空 newDepId
    let tmp: any = this.depId
    this.depId = this.newDepId
    this.newDepId = tmp
    this.newDepId.clear()
    // 使用 dep 存放 newDep，然后清空 newDep
    tmp = this.dep
    this.dep = this.newDep
    this.newDep = tmp
    this.newDep.length = 0
  }

  // watcher 拆卸自己：通知 dep 移除我，dep 调用 dep.removeWatcher(watcher) 移除之
  teardown() {
    let i = this.dep.length
    while (i--) this.dep[i].removeWatcher(this)
    this.dep = []
  }
}
