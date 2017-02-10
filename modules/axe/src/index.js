class Axe {
	constructor(options) {
		this.options = options

		this._data = this.options.data || {}

		proxy(this, this._data)
	}

}

function proxy(axe, data) {
	let keys = Object.keys(data),
		i = keys.length

	let define = (key) => {

		Object.defineProperty(axe, key, {
			configurable: true,
			enumerable: true,
			set(val) {
				axe._data[key] = val
			},
			get() {
				return axe._data[key]
			}
		})
	}

	while (i--) {
		define(keys[i])
	}

}

const axe = new Axe({
	data: {
		m: 'a',
		n: 'b'
	}
})


axe.m = 'a1'
axe.n = 'b1'

console.log(axe._data)