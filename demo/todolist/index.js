import sid from '@'
import App from './components/App'
import './index.scss'
import sRouter from '#'
import router from './router.js'
sid.use(sRouter, router)
// 挂载dom元素
sid.$mount(document.getElementById('app'), App)
