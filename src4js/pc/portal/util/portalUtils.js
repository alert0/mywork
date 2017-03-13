/**
 * PortalUtils
 *
 * 定义门户工具类
 */
export default class PortalUtils {
    /**
     * 根据关键字，获取cookie对应参数的值
     *
     * @param key   关键字
     * @returns {*}
     */
    static getCookie = (key) => {
        let reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
        let result = document.cookie.match(reg);
        if (result && result.length == 4) {
            return unescape(result[2]);
        } else {
            return null;
        }
    };

    /**
     * 根据关键字，获取URL对应参数的值
     *
     * @param key   关键字
     * @returns {*}
     */
    static getURLParamValue = (key) => {
        let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
        let result = window.location.search.substr(1).match(reg);
        if (result && result.length == 4) {
            return decodeURI(result[2]);
        } else {
            return null;
        }
    };
}