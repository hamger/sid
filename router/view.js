import Seed from '@'

export default Seed.extend({
  render (h) {
    var Component = this.$route.route.component
    return (
      <div>
        <Component />
      </div>
    )
  }
})
