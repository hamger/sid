import sid from '@'
import Title from './components/Title'
export default sid.extend({
  render (h) {
    return (
      <div>
        <Title title={this.title} />
      </div>
    )
  },
  data: function () {
    return {
      title: 'this is page1'
    }
  }
})
