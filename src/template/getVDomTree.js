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
        vTmpNode.component.$vTmpTree = vTmpNode.component.$getVTmpTree()
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

function getOldComponent (list = [], cid) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (
      !list[i].used &&
      list[i]._constructor &&
      list[i]._constructor.cid === cid
    ) {
      list[i].used = true
      return list[i].component
    }
  }
}

// 复用不变的一级子组件，不会递归遍历子组件，更细致的比较交给 diff 函数
function changeTree (newTemplate, oldTemplate) {
  let tree = Object.assign(new h(), newTemplate)
  if (newTemplate.children.length) {
    tree.children = newTemplate.children.map(vTmpNode => {
      let vDomNode = vTmpNode
      let isNewComponent = false
      if (vTmpNode._constructor) {
        vTmpNode.component = getOldComponent(
          oldTemplate.children,
          vTmpNode._constructor.cid
        )
        if (vTmpNode.component) {
          // 复用旧模板，则通知子元素更新属性
          vTmpNode.component.$updateProps(vTmpNode.properties)
          // 得到组件的虚拟模板树
          vDomNode = vTmpNode.component.$vTmpTree
          // 保存组件实例在 vDomNode.component
          vDomNode.component = vTmpNode.component
        } else {
          vTmpNode.component = vTmpNode.parent.$addChild(
            vTmpNode._constructor,
            vTmpNode.properties
          )
          vTmpNode.component.$vTmpTree = vTmpNode.component.$getVTmpTree()
          vDomNode = vTmpNode.component.$vTmpTree
          vDomNode.component = vTmpNode.component
          isNewComponent = true
        }
      }
      if (vDomNode.children && vDomNode.children.length) {
        vDomNode = createTree(vDomNode)
      }
      if (isNewComponent) vTmpNode.component.$vTmpTree = vDomNode

      return vDomNode
    })
    if (oldTemplate.children && oldTemplate.children.length) {
      for (let i = 0, len = oldTemplate.children.length; i < len; i++) {
        if (
          oldTemplate.children[i]._constructor &&
          !oldTemplate.children[i].used
        ) {
          // 销毁组件，触发生命周期
          oldTemplate.children[i].component.$destroy()
        }
      }
    }
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

export default function getVDomTree (newVTmpTree, oldVTmpTree) {
  let tree = null
  if (!oldVTmpTree) tree = createTree(newVTmpTree)
  else tree = changeTree(newVTmpTree, oldVTmpTree)
  // tree = createTree(newVTmpTree)
  // 返回虚拟 dom 树的复刻，避免引用类型赋值的影响
  return deepClone(tree)
}
