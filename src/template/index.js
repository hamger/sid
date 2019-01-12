import getVTmpNode from './getVTmpNode'
import getVDomTree from './getVDomTree'
import { diff, patch, create } from '../virtual-dom'

export default {
  install (DD) {
    DD.$mount = function (el, dd) {
      // 获取虚拟模板树
      let template = dd.$getVTmpTree()
      // 获得虚拟dom树，并转化为真实 dom 元素挂载在 $el 属性
      dd.$patch(template)
      el.appendChild(dd.$el)
    }

    // 在实例作用域下执行实例的 render 函数
    DD.prototype.render = function () {
      /**
       * 这里的 h 参数就是 this.$h.bind(this)
       * render (h) {
       *  return ()
       *    <div className="todo-wrap">
       *      <Title title={this.title} />
       *      <div className="item-wrap">
       *        <NoTask noTaskInfo={this.noTaskInfo} />
       *      </div>
       *      <TodoInput placeholder={'记点什么'} />
       *    </div>
       *  )
       * }
       * 经过 babel 将 jsx 转化为如下所示的函数
       * render (h) {
       *  return (
       *    h('div', {class: "todo-wrap"}, [
       *      h(Sub, {title: "Hanger's TodoList"}，[]),
       *      h('div', {className: "item-wrap"}，[
       *        h(Sub2, {noTaskInfo: "暂无 TodoList"}, [])
       *      ]),
       *      h(sub3, {placeholder: "记点什么"}, [])
       *    ])
       *  )
       * }
       * 可见执行一次 render 函数，内部多次执行 $h()，即 getVTmpNode()
       * 因此最后返回的结果是一个表示 dom 结构的对象（含组件）
       * {tagName: "div", properties: {…}, children: Array(3)}
       * 此时的对象中依然存在自定义的标签，也就是 tanName 值是 Sub（一个构造器对象），姑且将这样的对象称之为虚拟模板树，
       * 虚拟模板树无法被转化为真实的 dom 树，因此我们需要把虚拟模板树中的自定义标签转化为html支持的标签，
       * 这个转化逻辑在 getVDomTree 中完成，原理就是递归实例化 Sub 得到虚拟 dom 树，
       * 虚拟 dom 树可以被 create 函数转化为真实的 dom 树
       */
      return this.$options.render.call(this, this.$h.bind(this))
    }

    // 将 jsx 转化为虚拟模板树，此时自定义标签还未解析
    DD.prototype.$h = function (tag, properties, ...children) {
      return getVTmpNode(this, tag, properties, ...children)
    }

    // 获取虚拟模板树，并对其进行监听
    DD.prototype.$getVTmpTree = function () {
      let template = null
      // 建一个 watcher，观察整颗虚拟模板树
      this.$watch(
        () => {
          template = this.render.call(this)
          return template
        },
        newVTmpTree => {
          // 依赖变更后重绘 dom 树
          this.$patch(newVTmpTree)
        }
      )
      return template
    }

    // 将虚拟模板树应用到真实的 dom
    DD.prototype.$patch = function (newVTmpTree) {
      // 将虚拟模板树转化为虚拟dom树，此时自定义标签被解析为html标签
      let vDomTree = getVDomTree(newVTmpTree, this.$vTmpTree)
      // console.log(vDomTree)
      if (!this.$vDomTree) {
        this.$el = create(vDomTree)
      } else {
        var patches = diff(this.$vDomTree, vDomTree)
        this.$el = patch(this.$el, patches)
      }
      // 保存组件的虚拟模板树，作为下次 $patch 中的旧虚拟模板树
      this.$vTmpTree = newVTmpTree
      // 保存组件的虚拟dom树，作为下次 $patch 中的旧虚拟dom树
      this.$vDomTree = vDomTree
      this.$initDOMBind(this.$el, newVTmpTree)
    }

    // 为某一组件下的所有子组件上设置 $el 属性，表示其对应的真实 dom，在执行 patch 方法时需要用到
    DD.prototype.$initDOMBind = function (rootDom, vTmpTree) {
      if (!vTmpTree.children || vTmpTree.children.length === 0) return
      vTmpTree.children.forEach((vTmpNode, i) => {
        if (vTmpNode._constructor) {
          // 为子组件上加一个 $el 属性，表示其对应的真实 dom
          vTmpNode.component.$el = rootDom.childNodes[i]
          // 递归遍历子组件的子代
          this.$initDOMBind(rootDom.childNodes[i], vTmpNode.component.$vTmpTree)
        } else {
          this.$initDOMBind(rootDom.childNodes[i], vTmpNode)
        }
      })
    }
  }
}
