# hg-sid
a simple front-end framework with mvc


## Install

使用 npm 安装： `npm install hg-sid`

使用 yarn 安装： `yarn add hg-sid`

## Usage
```js
import Sid from 'hg-sid'

var app = new Sid({
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

app.$mount(document.getElementById('app'))
```

## Changelog
### 2019.1.11

> v0.1.3 项目名从 Seed 更名为 Sid

### 2018.10.26
> v0.1.2 简化获取虚拟 dom 树的逻辑

### 2018.8.14
> v0.1.1 更新 virtual-dom 结构

### 2018.8.12
> v0.1.0 项目初始化，构建项目基础结构
