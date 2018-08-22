import Seed from '@'

export default Seed.extend({
  render (h) {
    console.log(this.$route)
    var Component = this.$route.route.component
    // console.log(component)
    return (
      <div>
        <Component />
      </div>
    )
  }
})
// import Seed from '@'

// export default Seed.extend({
//   render (h) {
//     return (<div><span>按时发放的舒服撒发放</span></div>)
//   }
// })
