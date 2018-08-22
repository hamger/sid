export default function install (DD, router) {
  // const isDef = v => v !== undefined

  // const registerInstance = (vm, callVal) => {
  //   let i = vm.$options._parentVnode
  //   if (
  //     isDef(i) &&
  //     isDef((i = i.data)) &&
  //     isDef((i = i.registerRouteInstance))
  //   ) {
  //     i(vm, callVal)
  //   }
  // }
  // DD.options.router = router
  DD.mixin({
    beforeCreate () {
      // if (isDef(this.$options.router)) {
      //   this._routerRoot = this
      //   this._router = this.$options.router
      //   this._router.init(this)
      //   // DD.util.defineReactive(this, '_route', this._router.history.current)
      // } else {
      //   this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      // }
      // // registerInstance(this, this)
    },
    // destroyed () {
    //   registerInstance(this)
    // }
  })

  Object.defineProperty(DD.prototype, '$router', {
    get () {
      return router.history
    }
  })

  Object.defineProperty(DD.prototype, '$route', {
    get () {
      return router.history.current
    }
  })
}
