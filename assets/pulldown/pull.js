var touch = {}, swipeTimeout, up = false;
var deltaX = 0, deltaY = 0, firstTouch;
function cancelSwipe() {
    if (swipeTimeout) clearTimeout(swipeTimeout);
    up = false;
    deltaX = 0;
    deltaY = 0;
    mainContentFrameWrapper.style.top = '1px';
    swipeTimeout = null;
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
            console.log(touch);
            console.log(deltaX, deltaY);
            mainContentFrameWrapper.style.top = Math.log(deltaY) * 10 + 'px';
        }
    }

    function gestureEnd(e) {

        mainContentFrameWrapper.style.top = '1px';

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

            swipeTimeout = setTimeout(function () {
                console.log('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
                touch = {};
                up = true;
                deltaX = 0;
                deltaY = 0;
            }, 0);
    }

    document.addEventListener('touchstart', gestureStart, false);
    document.addEventListener('touchmove', gestureMove, false);
    document.addEventListener('touchend', gestureEnd, false);
    document.addEventListener('touchcancel', cancelSwipe, false);
    window.addEventListener('scroll', cancelSwipe, false);
}, false);