import Seed from './data-dirver'
import template from './template'

// 为DD添加操作dom的插件（在DD的原型上添加一些方法）
Seed.use(template, Seed)

export default Seed
