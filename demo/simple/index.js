import axios from 'axios'
import Sid from '../../package/sid.min.js'

var app = new Sid({
  render (h) {
    return (
      <div>
        <h2>check has {this.listCount}</h2>
        <ul>
          {this.list.map(item => (
            <li>{item}</li>
          ))}
        </ul>
      </div>
    )
  },
  methods: {
    add: function (item) {
      this.list.push(item)
    }
  },
  created () {
    axios
      .get('https://api.github.com')
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })

    this.add('phone')
  },
  computed: {
    listCount: function () {
      return this.list.length
    }
  },
  data () {
    return {
      list: ['key', 'money', 'IdCard']
    }
  }
})

Sid.$mount(document.getElementById('app'), app)
