import sid from '@'

let NoTask = sid.extend({
  render (h) {
    return <div className="no-task">{this.noTaskInfo}</div>
  },
  props: ['noTaskInfo']
})

export default NoTask
