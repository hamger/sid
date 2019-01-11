import sid from '@'

export default sid.extend({
  render (h) {
    var Component = this.$route.route.component
    return (
      <div>
        <Component />
      </div>
    )
  }
})
