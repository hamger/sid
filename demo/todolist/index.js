import Sid from '@'
import App from './components/App'
import './index.scss'
import sRouter from '#'
import router from './router.js'
Sid.use(sRouter, router)
// 挂载dom元素
App.$mount(document.getElementById('app'))
