import sid from '@'

var title = sid.extend({
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

// var title = {
//   render (h) {
//     return (
//       <p className='title'>{this.title}</p>
//     )
//   },
//   props: {
//     title: {
//       type: String,
//       default: 'hello Title'
//     }
//   },
//   // created () {
//   //   console.log('created')
//   // }
// }

export default title
