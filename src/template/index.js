import createVdom from './createVdom'
import getTree from './getTree'
import { diff, patch, create } from '../virtual-dom'

export default {
  install (DD) {
    DD.$mount = function (el, dd) {
      // window.onload = function () {
      let template = dd.$createVNode(dd.propData)
      dd.$patch(template)
      el.appendChild(dd.$el)
      // }
    }

    // 将 jsx 转化为虚拟模板，此时自定义标签还未解析
    DD.prototype.$h = function (tag, properties, ...children) {
      return createVdom(this, tag, properties, ...children)
    }

    // 在实例作用域下执行实例的 render 函数
    DD.prototype.render = function () {
      /**
       * 执行一次render函数，内部多次执行 $h
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
       * 先获取 {} 中变量的值，此时将会收集依赖，再经过 babel 将 jsx 转化为如下所示的函数
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
       * 因此最后返回的结果是一个表示 dom 结构的对象（含组件）
       * {tagName: "div", properties: {…}, children: Array(3)}
       * 此时的对象中依然存在自定义的标签，也就是 tanName 值是 Sub（表示一个构造函数）的对象，姑且称之为虚拟模板，
       * 虚拟模板无法被转化为真实的dom树，因此我们需要把虚拟模板中的自定义标签转化为html支持的标签，
       * 这个转化逻辑在 getTree 中完成，原理就是用 Sub 的实例替换自定义标签
       */
      return this.$options.render.call(this, this.$h.bind(this))
    }

    // 调用组件的 render 函数，创建虚拟模板
    DD.prototype.$createVNode = function (prop) {
      let template = null
      this.$initProp(prop)
      // 建一个 watcher，观察对属性的操作
      this.$watch(
        () => {
          template = this.render.call(this)
          return template
        },
        newTemplate => {
          // 依赖变更后重绘 dom 树
          this.$patch(newTemplate)
        }
      )
      return template
    }

    DD.prototype.$patch = function (newTemplate) {
      // 将虚拟模板转化为虚拟dom树，此时自定义标签被解析
      let vDomTree = getTree(newTemplate, this.$template)
      if (!this.$vDomTree) {
        this.$el = create(vDomTree)
      } else {
        this.$el = patch(this.$el, diff(this.$vDomTree, vDomTree))
      }
      this.$initDOMBind(this.$el, newTemplate)
      // 将有 $el 信息的虚拟模板保存在实例的 $template
      this.$template = newTemplate
      this.$vDomTree = vDomTree
    }

    // 由于组件的更新需要一个 $el ，所以 $initDOMBind 在每次 $patch 之后都需要调用
    // 父组件的状态改变时，父组件的 $el 是不变的，只需要重新获取子元素的 $el
    DD.prototype.$initDOMBind = function (rootDom, vNodeTemplate) {
      if (!vNodeTemplate.children || vNodeTemplate.children.length === 0) return
      vNodeTemplate.children.forEach((item, i) => {
        if (item.isComponent) {
          // 在组件上加一个 $el 属性，表示组件的父元素
          item.component.$el = rootDom.childNodes[i]
          this.$initDOMBind(rootDom.childNodes[i], item.component.$template)
        } else {
          this.$initDOMBind(rootDom.childNodes[i], item)
        }
      })
    }
  }
}
