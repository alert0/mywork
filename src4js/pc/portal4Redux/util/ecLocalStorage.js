import PortalUtils from './portalUtils';

/**
 * ECLocalStorage
 *
 * ecology本地缓存对象，基于localStorage封装
 *
 */
export default class ECLocalStorage {
    /**
     * 清除绑定登录帐号的缓存数据
     *
     * @param account   必须，登录帐号
     */
    static clearByAccount(account) {
        if ('undefined' != typeof(account)) {
            //定义key以登录账号结尾的正则
            let reg = new RegExp('-' + account + '$');
            let keyArr = [];
            for (let i = 0, len = localStorage.length; i < len; i++) {
                let key = localStorage.key(i);
                if (reg.test(key)) {
                    keyArr.push(key);
                }
            }
            for (let j = 0; j < keyArr.length; j++) {
                localStorage.removeItem(keyArr[j]);
            }
        }
    }

    /**
     * 清除模块的缓存数据
     *
     * @param moduleName    必须，模块名
     */
    static clearByModule(moduleName) {
        if ('undefined' != typeof(moduleName)) {
            //定义key以模块名结尾的正则
            let reg = new RegExp('^' + moduleName + '-');
            let keyArr = [];
            for (let i = 0, len = localStorage.length; i < len; i++) {
                let key = localStorage.key(i);
                if (reg.test(key)) {
                    keyArr.push(key);
                }
            }
            for (let j = 0; j < keyArr.length; j++) {
                localStorage.removeItem(keyArr[j]);
            }
        }
    }

    /**
     * 移除模块下对应关键字的缓存数据
     *
     * @param moduleName    必须，模块名
     * @param key           必须，关键字
     * @param bindUser      可选，是否绑定用户，默认不绑定
     */
    static remove(moduleName, key, bindUser) {
        if ('undefined' != typeof(moduleName) && 'undefined' != typeof(key)) {
            let moduleKey = moduleName;
            if (bindUser) {
                moduleKey += (this.getCacheAccount() ? '-' + this.getCacheAccount() : '');
            }

            let moduleStr = localStorage.getItem(moduleKey);
            let moduleObj = JSON.parse(moduleStr) || {};
            delete moduleObj[key];
            moduleStr = JSON.stringify(moduleObj);

            localStorage.setItem(moduleKey, moduleStr);
        }
    }

    /**
     * 获取模块下对应关键字的缓存数据，返回字符串
     *
     * @param moduleName    必须，模块名
     * @param key           必须，关键字
     * @param bindUser      可选，是否绑定用户，默认不绑定
     * @returns {string}
     */
    static getStr(moduleName, key, bindUser) {
        let obj = this.getObj(moduleName, key, bindUser);

        if (null != obj) {
            if ('string' == typeof(obj)) {
                return obj.toString();
            } else {
                return JSON.stringify(obj);
            }
        } else {
            return '';
        }
    }

    /**
     * 获取模块下对应关键字的缓存数据，返回JSON对象
     *
     * @param moduleName    必须，模块名
     * @param key           必须，关键字
     * @param bindUser      可选，是否绑定用户，默认不绑定
     * @returns {object}
     */
    static getObj(moduleName, key, bindUser) {
        let obj = null;

        if ('undefined' != typeof(moduleName) && 'undefined' != typeof(key)) {
            let moduleKey = moduleName;
            if (bindUser) {
                moduleKey += (this.getCacheAccount() ? '-' + this.getCacheAccount() : '');
            }

            let moduleStr = localStorage.getItem(moduleKey);
            let moduleObj = JSON.parse(moduleStr) || {};
            obj = moduleObj[key];
        }

        return obj;
    }

    /**
     * 设置模块下对应关键字的缓存数据
     *
     * @param moduleName    必须，模块名
     * @param key           必须，关键字
     * @param value         必须，缓存数据
     * @param bindUser      可选，是否绑定用户，默认不绑定
     */
    static set(moduleName, key, value, bindUser) {
        if ('undefined' != typeof(moduleName) && 'undefined' != typeof(key)) {
            let moduleKey = moduleName;
            if (bindUser) {
                moduleKey += (this.getCacheAccount() ? '-' + this.getCacheAccount() : '');
            }

            let moduleStr = localStorage.getItem(moduleKey);
            let moduleObj = JSON.parse(moduleStr) || {};
            moduleObj[key] = value;
            moduleStr = JSON.stringify(moduleObj);

            localStorage.setItem(moduleKey, moduleStr);
        }
    }

    /**
     * 获取缓存的当前用户登录账号
     *
     * @returns {string}
     */
    static getCacheAccount() {
        return localStorage.getItem('account');
    }

    /**
     * 缓存当前用户登录账号
     *
     * @param account   用户登录账号
     */
    static setCacheAccount(account) {
        localStorage.setItem('account', account);
    }

    /**
     * 获取登录后默认跳转的路由地址
     *
     * @returns {string}
     */
    static getDefaultRoute() {
        let defaultRoute = '/main';
        let portalMenu = this.getObj('portalLeftMenu', 'portalMenu', true);
        if (portalMenu && portalMenu.length) {
            defaultRoute += portalMenu[0].routeurl;
        }
        return defaultRoute;
    }

    /**
     * 登陆成功后，初始化浏览器本地缓存
     */
    static storageInit() {
        let account = PortalUtils.getCookie('loginidweaver');
        let cacheAccount = this.getCacheAccount();
        if (cacheAccount && cacheAccount != account) {
            this.clearByAccount(cacheAccount);
        }

        this.setCacheAccount(account);
    }
}