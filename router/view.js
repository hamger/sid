import Seed from '@'

export default Seed.extend({
  props: {
    vid: {
      type: String,
      default: 'default'
    }
  },
  render (h) {
    var Component = this.$route.route.component
    return (
      <div>
        <Component />
      </div>
    )
  }
})
