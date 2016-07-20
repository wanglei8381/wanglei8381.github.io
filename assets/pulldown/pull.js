var mainContentFrameWrapper = this.top.mainContentFrameWrapper;
var pullDown = this.top.pullDown;
var pullUp = this.top.pullUp;
var touch = {}, swipeTimeout, up = false, down = false;
var deltaX = 0, deltaY = 0, firstTouch;
function cancelSwipe() {
    if (swipeTimeout) clearTimeout(swipeTimeout);
    up = false;
    down = false;
    deltaX = 0;
    deltaY = 0;
    mainContentFrameWrapper.style.top = '0';
    swipeTimeout = null;
    initPull();
}

function initPull() {
    pullUp.innerHTML = '上拉加载';
    pullDown.innerHTML = '下拉刷新';
}

function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
    Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
}
window.addEventListener('load', function () {

    function gestureStart(e) {
        firstTouch = e.touches[0];

        if (e.touches && e.touches.length === 1 && touch.x2) {
            touch.x2 = touch.y2 = undefined;
        }

        touch.x1 = firstTouch.pageX;
        touch.y1 = firstTouch.pageY;

    }

    function gestureMove(e) {
        firstTouch = e.touches[0];
        touch.x2 = firstTouch.pageX;
        touch.y2 = firstTouch.pageY;

        if (up) {
            deltaX += Math.abs(touch.x1 - touch.x2);
            deltaY += Math.abs(touch.y1 - touch.y2);
            //var distinct = Math.log(deltaY) * 10;
            var distinct = deltaY / 100;
            mainContentFrameWrapper.style.top = -distinct + 'px';
            if (distinct >= 70) {
                pullUp.innerHTML = '松手加载';
            } else {
                pullUp.innerHTML = '上拉加载';
            }
        }
        if (down) {
            deltaX += Math.abs(touch.x1 - touch.x2);
            deltaY += Math.abs(touch.y1 - touch.y2);
            // var distinct = Math.log(deltaY) * 10;
            var distinct = deltaY / 100;
            mainContentFrameWrapper.style.top = distinct + 'px';
            if (distinct >= 70) {
                pullDown.innerHTML = '松手刷新';
            } else {
                pullDown.innerHTML = '下拉刷新';
            }
        }
    }

    function gestureEnd(e) {

        mainContentFrameWrapper.style.top = '0px';

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

            swipeTimeout = setTimeout(function () {
                var dir = swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
                touch = {};
                deltaX = 0;
                deltaY = 0;
                switch (dir) {
                    case 'Up':
                        up = true;
                        break;
                    case 'Down':
                        down = true;
                        break;
                }
            }, 0);
    }

    document.addEventListener('touchstart', gestureStart, false);
    document.addEventListener('touchmove', gestureMove, false);
    document.addEventListener('touchend', gestureEnd, false);
    document.addEventListener('touchcancel', cancelSwipe, false);
    window.addEventListener('scroll', cancelSwipe, false);
}, false);