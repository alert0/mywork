/**
 * 弹出框
 *
 * @param title         弹出框标题
 * @param url           弹出框访问的地址
 * @param width         弹出框宽度，默认700px
 * @param height        弹出框高度，默认600px
 * @param opacity       弹出框遮罩层透明度，默认40%
 * @param callbackfunc  关闭弹出框的回调函数
 */
export function showDialog({title, url, width = 700, height = 600, opacity = 0.4, callbackfunc}) {
    let dialog = new Dialog();
    dialog.Title = title;
    dialog.URL = url;
    dialog.Width = width;
    dialog.Height = height;
    dialog.ShowCloseButton = true;
    dialog.opacity = opacity;
    dialog.callbackfunc4CloseBtn = () => callbackfunc();
    dialog.show();
}

/**
 * js 异步加载
 *
 * @param src           js 文件路径
 * @param callbackfunc  js 执行完的回调函数
 */
export function jsAsyncLoad(src, callbackfunc) {
    let body = document.getElementsByTagName('body')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    //script.charset = 'utf-8';
    //script.async = true;

    if (script.readyState) { // IE
        script.onreadystatechange = () => {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
                if (typeof callbackfunc == 'function') {
                    callbackfunc();
                }
            }
        };
    } else { // Others: Firefox, Safari, Chrome, and Opera
        script.onload = () => {
            if (typeof callbackfunc == 'function') {
                callbackfunc();
            }
        };
    }

    script.src = src;
    body.appendChild(script);
}

/**
 * css 异步加载
 *
 * @param href          css 文件路径
 * @param callbackfunc  css 加载完的回调函数
 */
export function cssAsyncLoad(href, callbackfunc) {
    let body = document.getElementsByTagName('body')[0];
    let link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';

    if (link.readyState) { // IE
        link.onreadystatechange = () => {
            if (link.readyState == 'loaded' || link.readyState == 'complete') {
                link.onreadystatechange = null;
                if (typeof callbackfunc == 'function') {
                    callbackfunc();
                }
            }
        };
    } else { // Others: Firefox, Safari, Chrome, and Opera
        link.onload = () => {
            if (typeof callbackfunc == 'function') {
                callbackfunc();
            }
        };
    }

    link.href = href;
    body.appendChild(link);
}