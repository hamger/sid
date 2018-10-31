import { empty, noop } from './util'
import { LIFECYCLE_HOOK } from '../instance/lifecycle'

// 规范并合并配置项
export function mergeOptions(parent: any = {}, child: any = {}) {
  
  // 规范部分特殊属性
  normalizeComputed(parent)
  normalizeComputed(child)
  normalizeProp(child)

  // 直接合并 parent 和 child ，避免
  // 除 data/methods/watch/computed/LIFECYCLE_HOOK 之外的属性丢失
  let options = Object.assign({}, parent, child)

  LIFECYCLE_HOOK.forEach(name => {
    normalizeLifecycle(child, name)
    normalizeLifecycle(parent, name)
    options[name] = parent[name].concat(child[name])
  })

  // 合并 data ，一个函数
  options.data = mergeData(parent.data, child.data)

  // 合并 methods 同名覆盖
  options.methods = Object.assign(parent.methods || {}, child.methods || {})

  // 合并 watcher 同名合并成一个数组
  options.watch = mergeWatch(parent.watch, child.watch)

  // 合并 computed 同名覆盖
  options.computed = Object.assign(parent.computed || {}, child.computed || {})
  
  return options
}

function mergeData(parentVal: any = empty, childVal: any = empty) {
  return function() {
    // parentVal / childVal 是函数
    return Object.assign(parentVal.call(this), childVal.call(this))
  }
}

/**
 * 规范 computed 结构
 * @param option
 * return {
 *   key: fn(val, oldVal)
 * }
 */
function mergeWatch(parentVal: any = {}, childVal: any = {}) {
  let ret = Object.assign({}, parentVal)
  for (let key in childVal) {
    let parent = ret[key]
    let child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child)
        ? child
        : [child]
  }
  return ret
}

/**
 * 规范 computed 结构
 * @param option
 * return {
 *   key: {
 *     get: Function,
 *     set: Function
 *   }
 * }
 */
export function normalizeComputed(option: any) {
  let computed = option.computed
  for (let key in computed) {
    // 支持 option.computed[key] 为函数
    if (typeof computed[key] === 'function') {
      option.computed[key] = {
        get: computed[key],
        set: noop
      }
    }
  }
}

/**
 * 规范 prop 结构
 * @param option
 * return {
 *   key: {
 *     type: String|Number|...,
 *     ...
 *   }
 * }
 */
export function normalizeProp(option: any) {
  if (!option.props) return

  let props = option.props
  let normalProps: any = {}
  // 支持 props 为数组
  if (Array.isArray(props)) {
    props.forEach(item => {
      normalProps[item] = {
        type: null
      }
    })
  } else {
    for (let key in props) {
      normalProps[key] = Object.assign({ type: null }, props[key])
    }
  }
  option.props = normalProps
}

/**
 * 规范 生命周期 结构
 * @param option
 * return {
 *   LIFECYCLE_HOOK_name: [fn]
 * }
 */
export function normalizeLifecycle(option: any, name: string) {
  if (option[name] === undefined) {
    option[name] = []
    return
  }
  if (!Array.isArray(option[name])) {
    option[name] = [option[name]]
  }
}
