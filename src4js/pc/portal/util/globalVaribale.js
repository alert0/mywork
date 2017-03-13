import ecLocalStorage from './ecLocalStorage.js';

// 缓存类
window.ecLocalStorage = ecLocalStorage;
// 用户登录名
window.global_loginid = '';
// 门户id
window.global_hpid = '0';
// 分部id
window.global_subCompanyId = '0';

// 定义空方法，解决找不到该方法报错
window.loadCommonMenu = () => {};

// JavaScript异步加载
window.jsLoaded = {};
window.jsAsyncLoading = (key, urls, callback) => {
    if (urls && jQuery.isArray(urls) && urls.length) {
        if (window.jsLoaded[key] == undefined) {
            window.jsLoaded[key] = urls;

            let index = 0;
            let len = urls.length;
            for (let i = 0; i < len; i++) {
                let head = document.getElementsByTagName('head')[0];
                let script = document.createElement('script');
                script.type = 'text/javascript';
                // script.charset = 'utf-8';
                // script.async = true;

                if (script.readyState) { // IE
                    script.onreadystatechange = function() {
                        if (script.readyState == 'loaded' || script.readyState == 'complete') {
                            script.onreadystatechange = null;
                            index++;
                            if (index == len && jQuery.isFunction(callback)) {
                                callback();
                            }
                        }
                    };
                } else { // Others: Firefox, Safari, Chrome, and Opera
                    script.onload = function() {
                        index++;
                        if (index == len && jQuery.isFunction(callback)) {
                            callback();
                        }
                    };
                }

                script.src = urls[i];
                head.appendChild(script);
            }
        } else {
            if (jQuery.isFunction(callback)) {
                callback();
            }
        }
    }
};

// CSS异步加载
window.cssLoaded = {};
window.cssAsyncLoading = (key, urls, callback) => {
    if (urls && jQuery.isArray(urls) && urls.length) {
        if (window.cssLoaded[key] == undefined) {
            window.cssLoaded[key] = urls;

            let index = 0;
            let len = urls.length;
            for (let i = 0; i < len; i++) {
                let head = document.getElementsByTagName('head')[0];
                let link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';

                if (link.readyState) { // IE
                    link.onreadystatechange = function() {
                        if (link.readyState == 'loaded' || link.readyState == 'complete') {
                            link.onreadystatechange = null;
                            index++;
                            if (index == len && jQuery.isFunction(callback)) {
                                callback();
                            }
                        }
                    };
                } else { // Others: Firefox, Safari, Chrome, and Opera
                    link.onload = function() {
                        index++;
                        if (index == len && jQuery.isFunction(callback)) {
                            callback();
                        }
                    };
                }

                link.href = urls[i];
                head.appendChild(link);
            }
        } else {
            if (jQuery.isFunction(callback)) {
                callback();
            }
        }
    }
};