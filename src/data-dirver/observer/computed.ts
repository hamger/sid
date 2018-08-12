import Watcher from './watcher'
import { noop } from '../util/util'
import DD from '../instance'

let computedId = 0

interface ComputedOptions {
  get?(): any
  set?(v: any): void
}

export default class Computed {
  computedId: number
  dd: DD
  key: string
  option: ComputedOptions
  active: boolean
  watch: Watcher
  value: any

  constructor(dd: DD, key: string, option: ComputedOptions) {
    this.computedId = computedId++
    this.key = key
    this.option = option
    this.dd = dd
    this.active = true
    this.watch = null
    this.value = null
    this._init()
  }

  _init() {
    this.watch = new Watcher(this.dd, this.option.get || noop, (newValue: any) => {
      this.dd[this.key] = newValue
    })
    this.value = this.watch.value
  }

  // 销毁实例计算属性
  teardown() {
    if (this.active) {
      this.watch.teardown()
    }
  }
}
