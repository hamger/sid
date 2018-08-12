import { h } from '../virtual-dom'

function createTree (template) {
  let tree = Object.assign(new h(), template)
  if (template && template.children) {
    tree.children = template.children.map(node => {
      let tmp = node
      if (node.isComponent) {
        // 保存组件的内容
        node.component = new node.componentClass({
          parent: node.parent,
          propData: node.properties
        })
        // 将实例的内容存放在 tmp 中
        tmp = node.component.$template = node.component.$createVNode(
          node.properties
        )
        // 保存组件信息在 tmp 中，递归时需要用到
        tmp.component = node.component
      }
      // 如果组件存在子元素，递归将子模板转换为虚拟dom树
      if (tmp.children && tmp.children.length > 0) tmp = createTree(tmp)

      if (node.isComponent) {
        // 保存老的虚拟dom树，调用 diff 函数时需要用到
        node.component.$vDomTree = tmp
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

function changeTree (newTemplate, oldTemplate) {
  let tree = Object.assign(new h(), newTemplate)
  if (newTemplate && newTemplate.children) {
    tree.children = newTemplate.children.map((node, index) => {
      let treeNode = node
      let isNewComponent = false
      if (treeNode.isComponent) {
        // 查找依然存在的组件
        node.component = getOldComponent(
          oldTemplate.children,
          treeNode.componentClass.cid
        )
        if (!node.component) {
          // 如果没有旧组件，获取新组件
          node.component = new node.componentClass({
            parent: node.parent,
            propData: node.properties
          })
          // 保存新的虚拟模板
          treeNode = node.component.$template = node.component.$createVNode(node.properties)
          // treeNode = node.component.$template
          treeNode.component = node.component
          // 标记为新的组件
          isNewComponent = true
        } else {
          // 如果是依然存在的组件，更新节点 porps
          node.component.$initProp(node.properties)
          // 直接引用旧组件的虚拟 dom 树
          treeNode = node.component.$vDomTree
          // 保存组件的实例
          treeNode.component = node.component
        }
      }

      if (treeNode.children && treeNode.children.length !== 0) {
        if (isNewComponent) {
          treeNode = createTree(treeNode)
        } else {
          if (oldTemplate && oldTemplate.children) {
            treeNode = changeTree(treeNode, oldTemplate.children[index])
          } else {
            treeNode = createTree(treeNode)
          }
        }
      }
      if (isNewComponent) {
        // 保存新组件的虚拟 dom 树
        node.component.$vDomTree = treeNode
      }

      return treeNode
    })
    // 注销在老模板中没有被复用的组件，释放内存
    if (oldTemplate && oldTemplate.children.length !== 0) {
      for (let i = 0, len = oldTemplate.children.length; i < len; i++) {
        if (
          oldTemplate.children[i].isComponent &&
          !oldTemplate.children[i].used
        ) {
          oldTemplate.children[i].component.$destroy()
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

export default function getTree (newTemplate, oldTemplate) {
  let tree = null
  if (!oldTemplate) tree = createTree(newTemplate)
  else tree = changeTree(newTemplate, oldTemplate)
  return deepClone(tree)
}
