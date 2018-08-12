import DD from '.'
/**
 * 初始化类下的一些必要属性以及确定实例的父子关系
 * @param dd
 */
export default function initProps (dd: DD): void {
  let parent = dd.$options.parent
  if (parent) parent.$children.push(dd)
  dd.$parent = parent
  dd.$root = parent ? parent.$root : dd
  dd.$children = []
  dd._watch = []
}
