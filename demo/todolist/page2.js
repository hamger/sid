import Seed from '@'

export default Seed.extend({
  render (h) {
    return (
      <p>{this.title}</p>
    )
  },
  props: {
    title: {
      type: String,
      default: 'this is page2'
    }
  }
})
