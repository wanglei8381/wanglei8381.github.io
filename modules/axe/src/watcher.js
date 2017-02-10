class Watcher {

	constructor(cxt, exp, cb) {
		this.cxt = cxt
		this.getter = () => this.cxt[exp]
		this.value = this.get()
		this.cb = cb
	}

	get() {

		Dep.target = this

		return this.getter()
	}

	update() {
		let value = this.get()
		if (value !== this.value) {
			this.cb.call(this.cxt, value, this.value)
			this.value = value
		}
	}

}

class Dep {
	constructor() {
		this.watchers = []
	}

	addDep() {
		this.watchers.push(Dep.target)
	}

	notify() {
		console.log(this.watchers)
		this.watchers.forEach((watcher) => {
			watcher.update()
		})
	}
}

Dep.target = null

function defineReactive(data) {

	let keys = Object.keys(data),
		i = keys.length


	let define = (key, val) => {

		let dep = new Dep()
		Object.defineProperty(data, key, {
			configurable: true,
			enumerable: true,
			set(newVal) {
				val = newVal

				dep.notify()
			},
			get() {

				if (Dep.target) {
					dep.addDep()
				}
				return val
			}
		})
	}

	while (i--) {
		define(keys[i], data[keys[i]])
	}

}

const obj = {
	m: 'a',
	n: 'b'
}

defineReactive(obj)

const watch = new Watcher(obj, 'm', (newVal, oldVal) => {
	console.log(newVal, oldVal)
})

obj.m = 'b'
obj.m = 'c'
obj.n
obj.n = 'b'


// watch.update()


let arr = [1,2,3]

arr.slice(0)

console.log(arr)
