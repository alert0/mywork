/**
 * 弹出框
 *
 * @param title         弹出框标题
 * @param url           弹出框访问的地址
 * @param width         弹出框宽度，默认700px
 * @param height        弹出框高度，默认600px
 * @param callbackfunc  关闭弹出框的回调函数
 */
export function showDialog(title, url, width = 700, height = 600, callbackfunc) {
    if ('/favourite/MyFavourite.jsp' == url) {
        width = 657;
        height = 565;
    } else if ('/systeminfo/version.jsp' == url || '/hrm/HrmTab.jsp?_fromURL=HrmResourcePassword' == url) {
        width = 630;
        height = 400;
    }

    let dialog = new Dialog();
    dialog.Title = title;
    dialog.URL = url;
    dialog.Width = width;
    dialog.Height = height;
    dialog.ShowCloseButton = true;
    dialog.opacity = 0.4;
    dialog.callbackfunc4CloseBtn = () => callbackfunc();
    dialog.show();
}