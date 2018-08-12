import DD from '.'
/**
 * 将子组件的事件触发可以通知到父组件，实现子父组件间的通信
 * @param dd
 */

export default function initEvent(dd: DD) {
  if (!dd.$parent) return // 如果是根实例，不需要重写 $emit
  // 重写子组件的 $emit 方法，实现可以触发父组件监听的方法
  dd.$innerEmit = dd.$emit
  dd.$emit = function(eventName: string, ...args: any[]) {
    dd.$parent && dd.$parent.$emit(eventName, ...args)
    dd.$innerEmit(dd, eventName, ...args)
  }
}
