import { Base, match } from './base'

export class HashHistory extends Base {
  constructor (router) {
    super(router)
    this.ensureSlash()
    // 当 hash 改变的时候，改变当前路由信息
    window.addEventListener('hashchange', () => {
      this.transitionTo(this.getCurrentLocation())
    })
  }

  ensureSlash () {
    const path = this.getCurrentLocation()
    if (path.charAt(0) === '/') return true
    // 如果 path 不是以 / 开头的，表示 hash 不存在，加上 hash
    changeUrl(path)
    return false
  }

  push (location) {
    const targetRoute = match(location, this.router.routes)
    this.transitionTo(targetRoute, () => {
      changeUrl(this.current.fullPath.substring(1))
    })
  }

  replaceState (location) {
    const targetRoute = match(location, this.router.routes)
    this.transitionTo(targetRoute, () => {
      changeUrl(this.current.fullPath.substring(1), true)
    })
  }

  // 获取 # 号后边的字符串
  getCurrentLocation () {
    const href = window.location.href
    const index = href.indexOf('#')
    return index === -1 ? '' : href.slice(index + 1)
  }
}

// 改变 url 的哈希值
function changeUrl (path, replace) {
  const href = window.location.href
  const i = href.indexOf('#')
  const base = i >= 0 ? href.slice(0, i) : href
  if (replace) {
    window.history.replaceState({}, '', `${base}#/${path}`)
  } else {
    window.history.pushState({}, '', `${base}#/${path}`)
  }
}
