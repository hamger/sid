
import Router from '../../router'
import page1 from './page1'
import page2 from './page2'
import view1 from './view1'
import view2 from './view2'

var router = new Router({
  id: 'router-view',
  // mode: 'history',
  // mode: 'hash',
  base: '/todolist',
  routes: [
    {
      path: '/page1',
      name: 'page1',
      component: page1,
      beforeEnter: (next) => {
        console.log('before enter page1')
        next()
      },
      afterEnter: (next) => {
        console.log('enter page1')
        next()
      },
      beforeLeave: (next) => {
        console.log('start leave page1')
        next()
      }
    },
    {
      path: '/page2',
      name: 'page2',
      component: page2,
      beforeEnter: (next) => {
        console.log('before enter page2')
        next()
      },
      afterEnter: (next) => {
        console.log('enter page2')
        next()
      },
      beforeLeave: (next) => {
        console.log('start leave page2')
        next()
      }
    },
    {
      path: '/page2/view1',
      name: 'view1',
      component: view1
    },
    {
      path: '/page2/view2',
      name: 'view2',
      component: view2
    }
  ]
})

export default router
