module.exports = function diff(newVNode, oldVNode) {
    if (newVNode == null) {
        return {status: 'remove'}
    }

    if (newVNode._uid !== oldVNode._uid) {
        return {status: 'replace'}
    }

    if (newVNode.tagName !== oldVNode.tagName) {
        return {status: 'replace'}
    }

}