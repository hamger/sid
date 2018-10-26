import { mergeOptions } from '../util/options'
import DDClass from '../instance'

export function initExtend (DD: typeof DDClass) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  DD.cid = 0
  let cid = 1

  /**
   * 返回一个子组件的构造器
   * @param {子组件配置项} extendOptions
   */
  DD.extend = function (extendOptions: Object = {}): Function {
    // this 指向父构造器
    const Super = DD
    class Sub extends Super {
      constructor (options: any) {
        super(options)
      }
    }

    // 记录子构造器 id
    Sub.cid = cid++

    // 合并父组件和自身的配置项
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    return Sub
  }
}
