import Sid from '@'

export default Sid.extend({
  render (h) {
    var Component = this.$route.route.component
    return (
      <div>
        <Component />
      </div>
    )
  }
})
