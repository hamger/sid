import Sid from '@'
import Title from './components/Title'
export default Sid.extend({
  render (h) {
    return (
      <div>
        <Title title={this.title} />
      </div>
    )
  },
  data: function () {
    return {
      title: 'this is view1'
    }
  }
})
