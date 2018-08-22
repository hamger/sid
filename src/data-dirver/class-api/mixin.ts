import DDClass from '../instance'
import { mergeOptions } from '../util/options'

export function initMixin(DD: typeof DDClass) {
  DD.mixin = function (mixin: any) {
    // this.options = mergeOptions(this.options, mixin)
    DD.options = mergeOptions(DD.options, mixin)
    return DD
  }
}
