import Seed from '@'
import TodoTask from './TodoTask'
import NoTask from './NoTask'
import Title from './Title'
import TodoInput from './TodoInput'
// import View from '#/View.js'

// <a style="cursor:pointer;" onclick={this.jump.bind(this, '/page1')}>page1</a>
// <a style="cursor:pointer;"
//   onclick={() => {
//     this.$router.push({ path: '/page2' })
//   }}
// >
//   page2
// </a>
// <View />
var app = new Seed({
  render (h) {
    return (
      <div className="todo-wrap">
        <Title title={this.title + ' with ' + this.taskCount} />
        <div className="list-wrap">
          {this.todoList.length === 0 ? (
            <NoTask noTaskInfo={this.noTaskInfo} />
          ) : (
            this.todoList.map(item => <TodoTask task={item} />)
          )}
        </div>
        <TodoInput placeholder={'记点什么'} />
      </div>
    )
  },
  methods: {
    jump: function (url) {
      this.$router.push({ path: url })
    }
  },
  created () {
    this.$on('removeById', id => {
      for (let i = 0, len = this.todoList.length; i < len; i++) {
        if (this.todoList[i].id === id) {
          this.todoList.splice(i, 1)
          return
        }
      }
    })
    let taskId = 0
    this.$on('addTodo', name => {
      this.todoList.unshift({
        id: taskId++,
        complete: false,
        taskName: name
      })
    })
  },
  computed: {
    taskCount: function () {
      return this.todoList.length
    }
  },
  data () {
    return {
      title: 'TodoList',
      todoList: [],
      inputValue: '',
      noTaskInfo: '暂无 TodoList'
    }
  }
})

export default app
