let Vue = require('vue')


new Vue({
	data: {
		obj: {
			msg: 'msg'
		}
	},

	computed: {
		res() {
			return this.obj.msg
		}
	},

	watch: {
		'obj': {
			deep: true,
			sync: true,
			handler(obj, oldObj) {
				// console.log(obj.msg, oldObj.msg)
			}
		}
	},

	created() {

		this.$watch(()=>{
			return this.obj.msg 
		},()=>{
			console.log(obj.msg, oldObj.msg)
		})

		this.obj.msg = 2
		this.obj.msg = 3
		
	}
})