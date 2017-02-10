let VNode = require('./VNode')

module.exports = function h(tag, props, children) {
    let parent = new VNode(tag, props)
    if (Array.isArray(children)) {
        children.forEach((item) => {
            item.parent = parent
            parent.children.push(item)
        })

    }

    return parent
}