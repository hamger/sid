const setAttr = (node, key, value) => {
  if (value === undefined) {
    if (isClassName(key)) {
      node.removeAttribute('class')
    } else {
      node.removeAttribute(key)
    }
  } else if (key === 'style') {
    node.style.cssText = value
  } else if (key === 'value') {
    var tagName = node.tagName || ''
    tagName = tagName.toLowerCase()
    if (tagName === 'input' || tagName === 'textarea') {
      node.value = value
    } else {
      node.setAttribute(key, value)
    }
  } else if (isClassName(key)) {
    let arr = value.trim().split(' ')
    emptyClass(node)
    arr.forEach(className => {
      node.classList.add(className)
    })
  } else if (isEventProp(key)) {
    // var events = EvStore(node)
    // events[extractEventName(key)] = value
    node.addEventListener(extractEventName(key), value.bind(this))
    // console.log(node)
  } else {
    node.setAttribute(key, value)
  }
}

// 清空类名
function emptyClass (node) {
  var arr = []
  for (var i = 0; i < node.classList.length; i++) {
    arr.push(node.classList.item(i))
  }
  arr.forEach(item => {
    node.classList.remove(item)
  })
}

function isClassName (name) {
  return /^className$/.test(name)
}

function isEventProp (name) {
  return /^on/.test(name)
}

function extractEventName (name) {
  return name.slice(2).toLowerCase()
}

export default setAttr
