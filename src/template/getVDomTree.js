import { h } from '../virtual-dom'

function createTree (template) {
  let tree = Object.assign(new h(), template)
  // 当然组件的最外层便签必须是 html 标签且唯一
  if (template && template.children) {
    // 将子代从虚拟模板树转化为虚拟dom树
    tree.children = template.children.map(vTmpNode => {
      let tmp = vTmpNode
      if (vTmpNode.isComponent) {
        // 保存组件的内容（seed实例）在 component 属性
        vTmpNode.component = new vTmpNode.componentClass({
          parent: vTmpNode.parent,
          propData: vTmpNode.properties
        })
        // 传入父组件中的属性（node.properties）
        // 得到组件的虚拟模板树，保存在 vTmpNode.component.$vTmpTree
        tmp = vTmpNode.component.$vTmpTree = vTmpNode.component.$getVTmpTree(
          vTmpNode.properties
        )
        // 保存组件信息在 tmp 中，递归时需要用到
        tmp.component = vTmpNode.component
      }
      // 如果组件存在子元素，递归将子模板转换为虚拟dom树
      if (tmp.children && tmp.children.length > 0) tmp = createTree(tmp)

      if (vTmpNode.isComponent) {
        // 保存老的虚拟dom树，调用 diff 函数时需要用到
        vTmpNode.component.$vDomTree = tmp
      }
      return tmp
    })
  }
  return tree
}

function getOldComponent (list = [], cid) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (
      !list[i].used &&
      list[i].isComponent &&
      list[i].componentClass.cid === cid
    ) {
      list[i].used = true
      return list[i].component
    }
  }
}

function changeTree (newVTmpTree, oldVTmpTree) {
  let tree = Object.assign(new h(), newVTmpTree)
  if (newVTmpTree && newVTmpTree.children) {
    tree.children = newVTmpTree.children.map((vTmpNode, index) => {
      let treeNode = vTmpNode
      let isNewComponent = false

      // 该节点是一个组件
      if (treeNode.isComponent) {
        // 查找依然存在的组件
        vTmpNode.component = getOldComponent(
          oldVTmpTree.children,
          treeNode.componentClass.cid
        )
        if (!vTmpNode.component) {
          // 如果没有旧组件，获取新组件
          vTmpNode.component = new vTmpNode.componentClass({
            parent: vTmpNode.parent,
            propData: vTmpNode.properties
          })
          // 保存新的虚拟模板树
          treeNode = vTmpNode.component.$vTmpTree = vTmpNode.component.$getVTmpTree(vTmpNode.properties)
          // treeNode = vTmpNode.component.$vTmpTree
          treeNode.component = vTmpNode.component
          // 标记为新的组件
          isNewComponent = true
        } else {
          // 如果是依然存在的组件，更新节点 porps
          vTmpNode.component.$initProp(vTmpNode.properties)
          // 直接引用旧组件的虚拟 dom 树
          treeNode = vTmpNode.component.$vDomTree
          // 保存组件的实例
          treeNode.component = vTmpNode.component
        }
      }

      // 该节点存在子节点
      if (treeNode.children && treeNode.children.length !== 0) {
        if (isNewComponent) {
          treeNode = createTree(treeNode)
        } else {
          if (oldVTmpTree && oldVTmpTree.children) {
            treeNode = changeTree(treeNode, oldVTmpTree.children[index])
          } else {
            treeNode = createTree(treeNode)
          }
        }
      }
      if (isNewComponent) {
        // 保存新组件的虚拟 dom 树
        vTmpNode.component.$vDomTree = treeNode
      }

      return treeNode
    })
    // 注销在老模板中没有被复用的组件，释放内存
    if (oldVTmpTree && oldVTmpTree.children.length !== 0) {
      for (let i = 0, len = oldVTmpTree.children.length; i < len; i++) {
        if (
          oldVTmpTree.children[i].isComponent &&
          !oldVTmpTree.children[i].used
        ) {
          oldVTmpTree.children[i].component.$destroy()
        }
      }
    }
  }
  return tree
}

// 创建虚拟 dom 树
function deepClone (node) {
  // 如果是文本节点则直接返回
  if (typeof node === 'string') return node
  let cloneNode = null
  // 如果是组件，则使用 node.component 中的内容创建虚拟节点
  if (node.isComponent) {
    let comNode = node.component
    let children = []
    if (comNode.children && comNode.children.length !== 0) {
      children = comNode.children.map(n => deepClone(n))
    }
    // 此时 node.component 中的 tanName 为正常的 HTML 标签，可以使用 h 函数了
    cloneNode = h(comNode.tagName, comNode.properties, children)

    cloneNode.component = node.component
  } else {
    let children = []
    if (node.children && node.children.length !== 0) {
      children = node.children.map(n => deepClone(n))
    }
    cloneNode = h(node.tagName, node.properties, children)
  }
  return cloneNode
}

export default function getVDomTree (newVTmpTree, oldVTmpTree) {
  let tree = null
  if (!oldVTmpTree) tree = createTree(newVTmpTree)
  else tree = changeTree(newVTmpTree, oldVTmpTree)
  return deepClone(tree)
}
