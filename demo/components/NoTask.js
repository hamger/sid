import Seed from '../../src/index'

let NoTask = Seed.extend({
  render (h) {
    return <div className="no-task">{this.noTaskInfo}</div>
  },
  props: ['noTaskInfo']
})

export default NoTask
