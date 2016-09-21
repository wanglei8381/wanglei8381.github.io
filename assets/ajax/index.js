/**
 * 标题 ajax请求
 * 描述 摘抄zepto
 * 创建日期 16/9/14 下午1:44
 * 作者 lei.wang@wuage.com
 * 版本 0.0.1
 */

(function () {
    var $ = {};
    var jsonType = 'application/json';
    var htmlType = 'text/html';
    var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var scriptTypeRE = /^(?:text|application)\/javascript/i;
    var xmlTypeRE = /^(?:text|application)\/xml/i;
    var blankRE = /^\s*$/;
    var noop = function () {
    };

    $.ajaxSettings = {
        type: 'GET',
        beforeSend: noop,
        success: noop,
        error: noop,
        complete: noop,
        context: null,
        xhr: function () {
            return new window.XMLHttpRequest();
        },
        accepts: {
            script: 'text/javascript, application/javascript, application/x-javascript',
            json: jsonType,
            xml: 'application/xml, text/xml',
            html: htmlType,
            text: 'text/plain'
        },
        timeout: 0,
        processData: true,
        cache: true
    };
})();