function Event() {
    this._events = {};
}

Event.prototype.on = function (name, cb) {
    var events = this._events[name] || [];
    events.push(cb);
    this._events[name] = events;
};

Event.prototype.add = function (name, cb) {
    this.on(name, cb);
    var self = this;
    document.addEventListener(name, function (e) {
        cb.call(self, e);
    }, false);
};

Event.prototype.off = function (name) {
    if (name in this._events) {
        delete this._events[name];
    }
};

Event.prototype.pause = function (name) {
    if (name in this._events) {
        this._events[name].pause = true;
    }
};

Event.prototype.resume = function (name) {
    if (name in this._events) {
        this._events[name].pause = false;
    }
};

Event.prototype.trigger = function (name) {
    if (name in this._events && !this._events[name].pause) {
        var len = arguments.length;
        var args = [], i = 1;
        while (i < len) {
            args.push(arguments[i++]);
        }
        this._events[name].forEach(function (cb) {
            if (typeof cb === 'function') {
                cb.apply(this, args);
            }
        });
    }
};


//module.exports = Event;