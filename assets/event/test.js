/**
 * 标题
 * 描述
 * 创建日期 16/9/6 下午3:49
 * 作者 lei.wang@wuage.com
 * 版本 0.0.1
 */


var Event = require('./');

function Foo() {
    this.name = 'foo';
    this.__proto__ = new Event();
}

// Foo.prototype = new Event();
var o = new Foo();
o.on('toast', function () {
    console.log(this.name);
});

o.trigger('toast');