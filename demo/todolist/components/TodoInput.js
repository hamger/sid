import sid from '@'
// let id = 0
export default sid.extend({
  render (h) {
    return (
      <div className="input-wrap">
        <input
          className="input"
          type="text"
          placeholder={this.placeholder}
          value={this.inputValue}
          onchange={(e) => { this.inputValue = e.target.value }}
        />
        <div className="save" onclick={this.save.bind(this)}>
          保存
        </div>
      </div>
    )
  },
  props: ['placeholder'],
  data () {
    return {
      inputValue: ''
    }
  },
  methods: {
    save () {
      // this.$emit('addTodo', `hanger${id++}`)
      this.$emit('addTodo', this.inputValue)
      this.inputValue = ''
    }
  }
})
