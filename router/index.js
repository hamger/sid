import { supportsPushState } from './push-state'
import { HashHistory } from './HashHistory'
import { HTML5History } from './Html5History'
import observe from '../src/data-dirver/observer/observer'
// import Watcher from '../src/data-dirver/observer/watcher'
import install from './install'

class Router {
  constructor (options) {
    this.base = options.base
    this.routes = options.routes
    this.container = options.id

    // 在 IE9 中自动降级为 hash 模式
    const fallback =
      this.mode === 'history' &&
      !supportsPushState &&
      options.fallback !== false

    this.mode = fallback ? 'hash' : options.mode || 'hash'

    this.history =
      this.mode === 'history' ? new HTML5History(this) : new HashHistory(this)

    // 支持通过 this.$route 访问 this.history.current
    Object.defineProperty(this, '$route', {
      get: () => {
        return this.history.current
      }
    })

    this.init()
  }

  push (location) {
    this.history.push(location)
  }

  replace (location) {
    this.history.replace(location)
  }

  go (n) {
    this.history.go(n)
  }

  // routerRander () {
  //   document.getElementById(
  //     this.container
  //   ).innerHTML = this.history.current.route.component
  // }

  init () {
    const history = this.history
    observe.call(this, history.current)
    // 通过改变 route 来渲染页面
    // new Watcher(history.current, 'route', this.routerRander.bind(this))
    // 路由转化到当前路径
    history.transitionTo(history.getCurrentLocation())
  }
}

Router.install = install

export default Router
