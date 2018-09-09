import Seed from '@'
import Title from './components/Title'
export default Seed.extend({
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
