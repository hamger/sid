import Seed from '../src/index'
import App from './components/App'
import './index.scss'

// 挂载dom元素
window.onload = function () {
  Seed.$mount(document.getElementById('app'), App)
}
