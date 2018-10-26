import { h } from '../virtual-dom'

export default function getVDomTree (template) {
  let tree = Object.assign(new h(), template)
  // 当然组件的最外层便签必须是 html 标签且唯一
  if (template.children && template.children.length) {
    // 将子节点从虚拟模板节点转化为虚拟dom节点
    tree.children = template.children.map(vTmpNode => {
      let vDomNode = vTmpNode
      if (vTmpNode.isComponent) {
        // 保存组件的内容（seed实例）在 component 属性
        vTmpNode.component = new vTmpNode._constructor({
          parent: vTmpNode.parent,
          propData: vTmpNode.properties
        })
        // 传入父组件中的属性（node.properties）
        // 得到组件的虚拟模板树，保存在 vTmpNode.component.$vTmpTree
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
        vDomNode = getVDomTree(vDomNode)
      }

      if (vTmpNode.isComponent) {
        // 保存老的虚拟dom树，调用 diff 函数时需要用到
        vTmpNode.component.$vDomTree = vDomNode
      }
      return vDomNode
    })
  }
  return tree
}
