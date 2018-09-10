import Seed from '@'

export default Seed.extend({
  props: {
    name: {
      type: String
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
