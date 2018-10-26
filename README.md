# Seed
a simple front-end framework with mvc

## Usage
```js
import Seed from '@'

var app = new Seed({
  render (h) {
    return (
      <div>
        <h2>check has {this.listCount}</h2>
        <ul>
          {this.list.map(item => (
            <li>{item}</li>
          ))}
        </ul>
      </div>
    )
  },
  methods: {
    add: function (item) {
      this.list.push(item)
    }
  },
  created () {
    this.add('phone')
  },
  computed: {
    listCount: function () {
      return this.list.length
    }
  },
  data () {
    return {
      list: ['key', 'money', 'IdCard']
    }
  }
})

Seed.$mount(document.getElementById('app'), app)
```

## Changelog
### 2018.10.26
> v0.1.2 简化获取虚拟 dom 树的逻辑

### 2018.8.14
> v0.1.1 更新 virtual-dom 结构

### 2018.8.12
> v0.1.0 项目初始化，构建项目基础结构
