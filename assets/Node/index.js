/**
 * 标题
 * 描述
 * 创建日期 16/9/1 下午7:28
 * 作者 lei.wang@wuage.com
 * 版本 0.0.1
 */

(function () {

    var root = this;
    //一些可以不需要单位的css属性，其中line-height的数值表示当前字体的大小的倍数
    var cssNumber = {
        'column-count': 1,
        'columns': 1,
        'font-weight': 1,
        'line-height': 1,
        'opacity': 1,
        'z-index': 1,
        'zoom': 1
    };
    //缓存元素默认展示方式
    var elementDisplay = {},
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
            'tr': document.createElement('tbody'),
            'tbody': table, 'thead': table, 'tfoot': table,
            'td': tableRow, 'th': tableRow,
            '*': document.createElement('div')
        },
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;

    //检测是否支持classList
    var isSupportClassList = !!document.body.classList;

    //document --> $doc
    root.$doc = document;
    root.$html = document.documentElement;
    root.$body = document.body;

    Node.prototype.remove = function () {
        if (this.parentNode != null) {
            this.parentNode.removeChild(this);
        }
    };

    Node.prototype.find = function (selector) {
        return this.querySelectorAll(selector);
    };

    Node.prototype.findOne = function (selector) {
        return this.querySelector(selector);
    };

    Node.prototype.parent = function () {
        return this.parentNode;
    };

    Node.prototype.empty = function () {
        this.innerHTML = '';
        return this;
    };

    Node.prototype.prop = function (prop) {
        return getComputedStyle(this, '').getPropertyValue(prop);
    };

    Node.prototype.attr = function (name, value) {
        if (this.nodeType !== 1) return;
        if (typeof name == 'string' && !(1 in arguments)) {
            if (this.nodeType === 1) {
                return this.getAttribute(name);
            }
        } else {
            if (Object.isPlainObject(name)) {
                for (var key in name) {
                    this.setAttribute(key, name[key]);
                }
            } else if (typeof name == 'string' && typeof name == 'value') {
                this.setAttribute(name, value);
            }
            return this;
        }
    }

    Node.prototype.removeAttr = function (name) {
        if (this.nodeType !== 1) return;
        this.removeAttribute(name);
    }

    Node.prototype.css = function (property, value) {
        var self = this;
        if (arguments.length < 2) {
            if (typeof property === 'string') {
                return this.style[camelize(property)] || this.prop(property);
            } else if (Object.isArray(property)) {
                var props = {}
                property.forEach(function (prop) {
                    props[prop] = (self.style[camelize(prop)] || self.prop(prop));
                });
                return props;
            }
        }

        var css = ''
        if (typeof property == 'string') {
            if (!value && value !== 0)
                this.style.removeProperty(dasherize(property))
            else
                css = dasherize(property) + ":" + maybeAddPx(property, value)
        } else {
            for (key in property)
                if (!property[key] && property[key] !== 0)
                    this.style.removeProperty(dasherize(key));
                else
                    css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
        }

        this.style.cssText += ';' + css;
        return this;

    }

    Node.prototype.data = function (name, value) {
        var attrName = 'data-' + name.replace(/([A-Z])/g, '-$1').toLowerCase()

        var data = (1 in arguments) ?
            this.attr(attrName, value) :
            this.attr(attrName)

        return data;
    }

    Node.prototype.show = function () {
        this.style.display == "none" && (this.style.display = '')
        if (this.prop("display") == "none") {
            this.style.display = defaultDisplay(this.nodeName);
        }
    }

    Node.prototype.hide = function () {
        return this.css("display", "none");
    }

    Node.prototype.prev = function () {
        return this.previousElementSibling;
    }

    Node.prototype.next = function () {
        return this.nextElementSibling;
    }

    Node.prototype.hasClass = function (name) {
        if (!name) return false
        if (isSupportClassList) {
            return this.classList.contains(name);
        } else {
            return this.className.indexOf(name) > -1;
        }
    }

    Node.prototype.addClass = function (name) {
        if (!name) return false
        if (isSupportClassList) {
            this.classList.add(name)
        } else {
            if (!('className' in this)) return this;
            if (!this.hasClass(name)) {
                this.className = this.className + ' ' + name;
            }
        }
        return this;
    }

    Node.prototype.removeClass = function (name) {
        if (!name) return false
        if (isSupportClassList) {
            this.classList.remove(name);
        } else {
            if (!('className' in this)) return this;
            if (this.hasClass(name)) {
                this.className = this.className.replace(name, '');
            }
        }
        return this;
    }

    Node.prototype.toggleClass = function (name) {
        if (!name) return false
        if (isSupportClassList) {
            this.classList.toggle(name);
        } else {
            if (!('className' in this)) return this;
            this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
        }
        return this;
    }

    Node.prototype.append = function (el) {
        var self = this;
        if (el instanceof Node) {
            this.appendChild(el);
        } else if (typeof el === 'string') {
            el = fragment(el);
            if (el) {
                if (Object.isArray(el)) {
                    el.forEach(function (_el) {
                        self.appendChild(_el);
                    });
                } else {
                    this.appendChild(el);
                }
            }
        }
        return this;
    }

    Node.prototype.prepend = function (el) {
        var self = this;
        var prepend = function (_el) {
            if (!self.firstChild) {
                self.appendChild(_el);
            } else {
                self.firstChild.before(_el);
            }
        };
        if (el instanceof Node) {
            prepend(el);
        } else if (typeof el === 'string') {
            el = fragment(el);
            if (el) {
                if (Object.isArray(el)) {
                    el.forEach(function (_el) {
                        prepend(_el);
                    });
                } else {
                    prepend(el);
                }
            }
        }
        return this;
    }

    Node.prototype.before = function (el) {
        var self = this;
        if (el instanceof Node) {
            this.parentNode.insertBefore(el, this);
        } else if (typeof el === 'string') {
            el = fragment(el);
            if (el) {
                if (Object.isArray(el)) {
                    el.forEach(function (_el) {
                        self.parentNode.insertBefore(_el, self);
                    });
                } else {
                    this.parentNode.insertBefore(el, this);
                }
            }
        }
        return this;
    }

    Node.prototype.after = function (el) {
        var self = this;

        var after = function (_el) {
            if (self.nextSibling) {
                self.nextSibling.before(_el);
            } else {
                self.parentNode.appendChild(_el);
            }
        }
        if (el instanceof Node) {
            after(el);
        } else if (typeof el === 'string') {
            el = fragment(el);
            if (el) {
                if (Object.isArray(el)) {
                    el.forEach(function (_el) {
                        after(_el);
                    });
                } else {
                    after(el);
                }
            }
        }

        return this;
    }

    NodeList.prototype.each = function (callback) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (callback.call(this[i], this[i], i) === false) {
                return this;
            }
        }
    }

    //简单html片段处理函数
    //摘抄zepto
    function fragment(html, name, properties) {
        var dom, container

        // A special case optimization for a single tag
        if (singleTagRE.test(html)) dom = document.createElement(RegExp.$1);

        if (!dom) {
            if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
            if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
            if (!(name in containers)) name = '*'

            container = containers[name];
            container.innerHTML = '' + html;
            var childNodes = container.childNodes;
            var list = [];
            //避免死循环
            var count = 0;
            while (childNodes.length > 0 && count < 100) {
                var _dom = container.removeChild(childNodes[0]);
                properties && _dom.attr(properties);
                list.push(_dom);
                count++;
            }
            if (list.length === 1) {
                dom = list[0];
            } else {
                dom = list;
            }

        } else {
            properties && dom.attr(properties);
        }

        return dom
    }

    function camelize(str) {
        return str.replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : ''
        })
    }

    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase()
    }

    //为一些元素添加PX单位
    function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
    }

    //获取元素的默认展示方式,创建一个节点添加到body的后面获取其display,再将其删除
    function defaultDisplay(nodeName) {
        var element, display
        if (!elementDisplay[nodeName]) {
            element = document.createElement(nodeName)
            document.body.appendChild(element)
            display = getComputedStyle(element, '').getPropertyValue("display")
            element.parentNode.removeChild(element)
            display == "none" && (display = "block")
            elementDisplay[nodeName] = display
        }
        return elementDisplay[nodeName]
    }

    ['Array', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach(function (name) {
        Object['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    Object.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    Object.isWindow = function (obj) {
        return obj != null && obj == obj.window;
    }

    //是否是简单的对象，简单说就是obj = {}或new Object()类似这样的声明方式
    Object.isPlainObject = function (obj) {
        return Object.isObject(obj) && !Object.isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }

})();