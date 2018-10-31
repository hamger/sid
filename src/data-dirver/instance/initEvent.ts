import DD from '.'
/**
 * 将子实例的事件触发可以通知到父实例，实现子父实例间的通信
 * @param dd
 */

export default function initEvent(dd: DD) {
  if (!dd.$parent) return // 如果是根实例，不需要重写 $emit
  // 重写子实例的 $emit 方法，实现可以触发父实例监听的方法
  // 先触发父实例的方法，再触发子实例的方法
  dd.$innerEmit = dd.$emit
  dd.$emit = function(eventName: string, ...args: any[]) {
    dd.$parent.$emit(eventName, ...args)
    dd.$innerEmit(dd, eventName, ...args)
  }
}
