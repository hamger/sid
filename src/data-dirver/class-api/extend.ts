import { mergeOptions } from '../util/options'
import DDClass from '../instance'

export function initExtend (DD: typeof DDClass) {
  DD.cid = 0
  let cid = 1

  /**
   * 返回一个子实例的构造器
   * @param {子实例配置项} extendOptions
   */
  DD.extend = function (extendOptions: Object = {}): Function {
    // this 指向 DD
    const Super = this
    class Sub extends Super {
      constructor (options: any) {
        super(options)
      }
    }

    // 记录子构造器 id
    Sub.cid = cid++

    // 合并父实例和自身的配置项
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
