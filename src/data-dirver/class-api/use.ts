import DDClass from '../instance'

export function initUse (DD: typeof DDClass) {
  DD.use = function (plugin: any, ...args: any[]) {
    /* 防止重复注册插件 */
    if (plugin.installed) return

    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, [DD, ...args])
    } else {
      plugin.apply(null, [DD, ...args])
    }

    plugin.installed = true
    return this
  }
}
