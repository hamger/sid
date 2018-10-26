import DD from './instance'
import { initClassApi } from './class-api'
import observe from './observer/observer'
import Watcher from './observer/watcher'

// 初始化 DD 的类方法
initClassApi(DD)

export default DD
export {
  observe,
  Watcher
}
