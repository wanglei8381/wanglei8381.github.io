//var Event = require('./event');
var touch = {},
    _top = false,//到达顶部
    _bottom = false,//到达底部
    deltaY = 0, //滑动的距离
    firstTouch;

var pullUpDown = {
    __proto__: new Event(),
    init: function () {
        if (document.body.scrollTop === 0) {
            _top = true;
        }
    },
    start: function () {
        var self = this;
        this.init();
        this.add('touchstart', this.gestureStart);
        this.add('touchmove', this.gestureMove);
        this.add('touchend', this.gestureEnd);
        this.add('touchcancel', this.cancelSwipe);
        window.addEventListener('scroll', function () {
            self.cancelSwipe();
        }, false);
    },
    swipeDirection: function (x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
        Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down')
    },
    gestureStart: function (e) {
        this.trigger('start');
        firstTouch = e.touches[0];

        if (e.touches && e.touches.length === 1 && touch.x2) {
            touch.x2 = touch.y2 = undefined;
        }

        touch.x1 = firstTouch.pageX;
        touch.y1 = firstTouch.pageY;
    },
    gestureMove: function (e) {
        firstTouch = e.touches[0];
        touch.x2 = firstTouch.pageX;
        touch.y2 = firstTouch.pageY;
        if (_top) {
            e.preventDefault();
            deltaY = touch.y2 - touch.y1;
            //deltaY = deltaY < 0 ? 0 : deltaY;
            // var distinct = Math.log(deltaY) * 10;
            var distinct = deltaY / 5;
            this.trigger('move', distinct);
        }
    },
    gestureEnd: function () {

        if (touch.y2) {
            var distinct = touch.y2 - touch.y1;
            this.trigger('end', distinct / 5);
        }
        this.handleDir();
    },
    handleDir: function () {
        touch.x1 = touch.x2;
        touch.y1 = touch.y2;
        deltaY = 0;
    },
    cancelSwipe: function () {
        _top = false;
        _bottom = false;
        this.down();
        this.up();
    },
    down: function () {
        if (document.documentElement.clientHeight + document.body.scrollTop === document.documentElement.scrollHeight) {
            _bottom = true;
            this.trigger('bottom');
            this.handleDir();
        }
    },
    up: function () {
        if (document.body.scrollTop === 0) {
            _top = true;
            this.trigger('top');
            this.handleDir();
        }
    }
};


window.addEventListener('load', function () {
    pullUpDown.start();
}, false);
