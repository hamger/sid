import DDClass from '../instance'

export function initMixin(DD: typeof DDClass) {
  DD.mixin = function (mixin: any) {
    this.options = Object.assign({}, this.options, mixin)
    return this
  }
}
