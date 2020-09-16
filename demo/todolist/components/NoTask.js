import Sid from '@'

let NoTask = Sid.extend({
  render (h) {
    return <div className="no-task">{this.noTaskInfo}</div>
  },
  props: ['noTaskInfo']
})

export default NoTask
