import { initExtend } from './extend'
import { initUse } from './use'
import DDClass from '../instance'

export function initClassApi (DD: typeof DDClass) {
  // 设置初始 options
  DD.options = {
    components: {},
    _base: DD
  }

  // 子类生成方法
  initExtend(DD)

  // 扩展
  initUse(DD)
}
