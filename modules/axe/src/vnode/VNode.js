let uid = 1
class VNode {

    constructor(tagName = 'div', innerHTML = '', props = {}) {
        this.tagName = tagName

        if (typeof innerHTML === 'object') {
            props = innerHTML
            innerHTML = ''
        }

        this.innerHTML = innerHTML
        this.props = props
        this.children = []
        this.parent = null
        this._uid = uid++
        this.el = null
    }

}

module.exports = VNode