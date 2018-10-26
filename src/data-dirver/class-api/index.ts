import DDClass from '../instance'
import { initExtend } from './extend'
import { initUse } from './use'
import { initMixin } from './mixin'

export function initClassApi (DD: typeof DDClass) {
  // 设置初始 options
  DD.options = {}

  // 子类生成方法
  initExtend(DD)

  // 全局混入
  initMixin(DD)

  // 插件扩展
  initUse(DD)
}
