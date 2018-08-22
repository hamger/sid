import Seed from '@'

var title = Seed.extend({
  render (h) {
    console.log(this)
    return (
      <p className='title'>{this.title}</p>
    )
  },
  props: {
    title: {
      type: String,
      default: 'hello Title'
    }
  }
})

export default title
