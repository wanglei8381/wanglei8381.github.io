module.exports = function createElement(vnode) {

    // let parent = document.createDocumentFragment()

    let root = document.createElement(vnode.tagName)

    //设置属性
    setProps(root, vnode.props)

    vnode.el = root

    if (vnode.children.length) {
        vnode.children.forEach((item) => {
            let el = createElement(item)
            root.appendChild(el)
        })
    } else {
        root.innerHTML = vnode.innerHTML
    }

    return root
}

function setProps(el, props) {
    let keys = Object.keys(props),
        val, stylKeys
    keys.forEach((key)=> {
        val = props[key]
        if (key === 'style') {
            stylKeys = Object.keys(val)
            val = stylKeys.map(function (k) {
                return k + ':' + val[k]
            }).join('; ')
        }
        el.setAttribute(key, val)
    })
}