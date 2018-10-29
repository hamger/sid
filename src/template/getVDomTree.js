import { h } from '../virtual-dom'

function createTree (template) {
  let tree = Object.assign(new h(), template)
  // 当然组件的最外层便签必须是 html 标签且唯一
  if (template.children && template.children.length) {
    // 将子节点从虚拟模板节点转化为虚拟dom节点
    tree.children = template.children.map(vTmpNode => {
      let vDomNode = vTmpNode
      if (vTmpNode._constructor) {
        // 传入父组件给子组件的属性 node.properties
        vTmpNode.component = vTmpNode.parent.$addChild(
          vTmpNode._constructor,
          vTmpNode.properties
        )
        // 得到组件的虚拟模板树，保存在 vTmpNode.component.$vTmpTree，在执行 $initDOMBind 时需要用到
        vTmpNode.component.$vTmpTree = vTmpNode.component.$getVTmpTree(
          vTmpNode.properties
        )
        // 得到组件的虚拟模板树
        vDomNode = vTmpNode.component.$vTmpTree
        // 保存组件实例在 vDomNode.component
        vDomNode.component = vTmpNode.component
      }
      // 如果节点存在子节点，递归将子节点从虚拟模板节点转化为虚拟dom节点
      if (vDomNode.children && vDomNode.children.length) {
        vDomNode = createTree(vDomNode)
      }
      return vDomNode
    })
  }
  return tree
}

// 复刻一份虚拟 dom 树
function deepClone (node) {
  // 如果是文本节点则直接返回
  if (typeof node === 'string') return node
  let cloneNode = null
  let children = []
  if (node.children && node.children.length !== 0) {
    children = node.children.map(n => deepClone(n))
  }
  cloneNode = h(node.tagName, node.properties, children)
  return cloneNode
}

export default function getVDomTree (newVTmpTree) {
  let tree = createTree(newVTmpTree)
  // 返回虚拟 dom 树的复刻，避免引用类型赋值的影响
  return deepClone(tree)
}
