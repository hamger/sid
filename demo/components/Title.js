import Seed from '../../src/index'

export default Seed.extend({
  render (h) {
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
