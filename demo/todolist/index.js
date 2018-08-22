import Seed from '@'
import App from './components/App'
import './index.scss'
import sRouter from '../../router'
import router from './router.js'
Seed.use(sRouter, router)
// 挂载dom元素
Seed.$mount(document.getElementById('app'), App)
