import event from './event'
import Watcher from '../observer/watcher'
import { isEmpty, looseEqual } from '../util/util'
import { mergeOptions } from '../util/options'
import initState from './initState'
import { callHook } from './lifecycle'
import initEvent from './initEvent'

let id = 0
@event
export default class DD {
  id: number
  active: boolean
  $options?: any
  $parent: any
  $root: any
  $children?: Array<DD>
  _watchers?: Array<Watcher>
  [key: string]: any
  static cid: number
  static options: any
  static use: any
  static extend: any
  static mixin: any

  constructor(options: any) {
    this.id = id++
    this._init(options)
    this.active = true
  }

  _init(options: any) {
    let dd: DD = this
    dd.$children = []
    dd._watchers = []
    // 合并 构造函数的配置项 和 输入的配置项
    var sub: any = dd.constructor
    dd.$options = mergeOptions(sub.options, options)

    // 触发 beforeCreate 事件
    callHook(dd, 'beforeCreate')
    initState(dd)
    // 触发 created 事件
    callHook(dd, 'created')
    initEvent(dd)
  }

  $addChild(dd: DD) {
    dd.$parent = this
    this.$children.push(dd)
  }

  // 处理传入的 props ，当传入的组件的 props 有更新时
  // 需要调用该方法触发子组件状态更新
  $initProp(props: any) {
    if (isEmpty(props)) return
    // TODO 有效性验证
    let dd: DD = this
    for (let key in dd.$options.props) {
      let value = props[key]
      if (!value) value = dd.$options.props[key].default
      if (!looseEqual(dd[key], value)) dd[key] = value
    }
  }

  // 暴露创建监听的方法
  // 创建一个观察者，观察者会观察在 getter 中对属性的 get 的操作
  // 当对应属性发生 set 动作时，会触发 callback
  // 新生成的观察者对象会保存在实例的 _watchers 属性下
  $watch(getter: string | Function, callback: Function) {
    let dd: DD = this
    let watch = new Watcher(dd, getter, callback)
    dd._watchers.push(watch)
    return watch
  }

  // 用于取消特定的属性监听
  // 比如表单元素的 value 值，发生变化时是不需要引发视图变化的
  $cancelWatch(watch?: Watcher) {
    if (watch) {
      let i = watch.dep.length
      while (i--) {
        const dep = watch.dep[i]
        if (!watch.newDepId.has(dep.id)) {
          dep.removeWatcher(watch)
        }
      }
    } else {
      // 取消所有的监听
      while (this._watchers.length) {
        this._watchers.shift().teardown()
      }
    }
  }

  // 暴露销毁当前实例的方法
  $destroy() {
    if (this.active) {
      let dd = this
      callHook(dd, 'beforeDestroy')

      // 移除父子关系
      let parent = dd.$parent
      parent.$children.splice(parent.$children.indexOf(dd), 1)
      dd.$parent = null

      // 注销 watch
      while (dd._watchers.length) {
        dd._watchers.shift().teardown()
      }

      // 注销 computed
      while (dd._computed.length) {
        dd._computed.shift().teardown()
      }

      // 清空事件
      dd.$off()

      // 清空子组件
      while (dd.$children.length !== 0) {
        let child = dd.$children.pop()
        child.$destroy()
      }

      callHook(dd, 'destroyed')
      this.active = false
    }
  }
}
