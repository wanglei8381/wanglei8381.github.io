let createElement = require('./createElement')

module.exports = function render(vnode, parent) {
    let el = createElement(vnode)

    if (typeof parent === 'string') {
        parent = document.querySelector(parent)
    }

    parent.appendChild(el)
}