import { supportsPushState } from './push-state'
import { HashHistory } from './HashHistory'
import { HTML5History } from './Html5History'
import observe from '../src/data-dirver/observer/observer'
import Watcher from '../src/data-dirver/observer/watcher'

class Router {
  constructor (options) {
    this.base = options.base
    this.routes = options.routes
    this.container = options.id
    this.mode = options.mode || 'hash'

    // 在 IE9 中自动降级为 hash 模式
    this.fallback =
      this.mode === 'history' &&
      !supportsPushState &&
      options.fallback !== false

    if (this.fallback) {
      this.mode = 'hash'
    }

    this.history =
      this.mode === 'history' ? new HTML5History(this) : new HashHistory(this)

    Object.defineProperty(this, 'route', {
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

  renderRouter () {
    document.getElementById(this.container).innerHTML = this.history.current.route.component
  }

  init () {
    const history = this.history
    observe.call(this, this.history.current)
    // 通过改变 route 来渲染页面
    new Watcher(this.history.current, 'route', this.renderRouter.bind(this))
    // 路由转化到当前路径
    history.transitionTo(history.getCurrentLocation())
  }
}

export default Router
