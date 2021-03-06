/**
 * 公共js
 */
(function (window, document, $) {
    'use strict';

    /* Date对象扩展函数 */
    if (!Date.prototype.format) {
        /**
         * 日期格式化
         * @param fmt
         * @returns {*}
         */
        Date.prototype.format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }

    var util = {
        getQueryParam: getQueryParam,
        getBrowser: getBrowser,
        getOrientation: getOrientation,
        openApp: openApp
    }; // 工具函数集合

    /**
     * 获取指定值的param
     * @param key
     * @returns {String}
     */
    function getQueryParam(key) {
        var search = location.search.substr(1);
        //console.log('location search: ', typeof search, search);

        var params = search.split('&');
        //console.log('location params: ', typeof params, params);

        var value = '';
        for (var i = 0; i < params.length; i++) {
            if (!!params[i]) {
                var param = params[i].split('=');
                if (key == param[0]) {
                    value = param[1];
                    break;
                }
            }
        }

        return value;
    }

    /**
     * 获取浏览器信息
     * @returns {Object}
     */
    function getBrowser() {
        return {
            versions: function () {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                return { //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    weChat: u.indexOf('MicroMessenger') > -1, //是否微信
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase() // 语言版本
        }
    };

    /**
     * 判断横竖屏
     * @returns {String}
     */
    function getOrientation() {
        var orientation = 'portrait';
        if (window.orientation) {
            var winOrientation = window.orientation;
            if (winOrientation == 0 || winOrientation == 180) {
                // 竖屏
                orientation = 'portrait';
            } else if (winOrientation == 90 || winOrientation == -90) {
                // 横屏
                orientation = 'landscape';
            }
        }
        return orientation;
    };

    /**
     * 打开app，type 1=>课程 2=>小组 3=> 活动
     * @param {*} type
     * @param {*} id
     */
    function openApp() {
        var browser = this.getBrowser();

        var data;
        var config = {
            /*scheme:必须*/
            schemeForIOS: 'zanfitness://', // 打开ios应用的url
            schemeForAndroid: 'zanfitness://www.zanfitness.com:8080', // 打开android应用的url
            downloadUrl: 'http://zanfitness.com/apkdown/zstu.html', // 应用下载页
            weChatDownloadUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zanfitness.student', // 微信下载链接
            timeout: 600
        };

        // 判断是否是移动终端
        if (browser.versions.mobile) {
            if (browser.versions.weChat) {
                // 直接跳转至应用宝
                window.location.href = config.weChatDownloadUrl;
            } else {
                location.href = browser.versions.ios ? config.schemeForIOS : config.schemeForAndroid;
                setTimeout(function () {
                    // layer.confirm('是否现在去下载应用？', {
                    //     title: '信息',
                    //     btn: [
                    //         '确定',
                    //         '取消'
                    //     ]
                    // }, function(e){
                    //     location.href =config.downloadUrl;
                    // });
                }, config.timeout);
            }
        }
    };

    window.util = util;
})(window, document, jQuery);
