import DD from '../data-dirver'
import { h } from '../virtual-dom'

export default function getVTmpNode (parent, tag, properties, ...children) {
  // 如果 tag 是自定义的标签，例如 <Title></Title>, 返回该虚拟节点
  if (typeof tag === 'function' || typeof tag === 'object') {
    let node = new h()
    node.tagName = `component-${tag.cid}`
    node.properties = properties
    node.children = children
    // 记录父组件
    node.parent = parent
    node.isComponent = true
    if (typeof tag === 'function') {
      node.componentClass = tag
    } else {
      node.componentClass = DD.extend(tag)
    }
    return node
  } else {
    return h(tag, properties, children)
  }
}
