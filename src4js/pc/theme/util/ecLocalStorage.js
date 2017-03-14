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
        if (account != undefined) {
            // 定义缓存数据的key是以账号结尾的正则
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
        if (moduleName != undefined) {
            // 定义缓存数据的key是以模块名结尾的正则
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
        if (moduleName != undefined && key != undefined) {
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

        if (obj != null) {
            if (typeof(obj) == 'string') {
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

        if (moduleName != null && key != undefined) {
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
        if (moduleName != undefined && key != undefined) {
            let moduleKey = moduleName;
            if (bindUser) {
                moduleKey += (this.getCacheAccount() ? '-' + this.getCacheAccount() : '');
            }

            let moduleStr = localStorage.getItem(moduleKey);
            let moduleObj = JSON.parse(moduleStr) || {};
            moduleObj[key] = value;
            moduleStr = JSON.stringify(moduleObj);

            try {
                localStorage.setItem(moduleKey, moduleStr);
            } catch (ex) {
                if (ex.name == 'QuotaExceededError') {
                    console.warn('本地存储已达上限，将清除部分缓存数据！');
                    let cacheAccount = this.getCacheAccount();
                    if (cacheAccount != null) {
                        this.clearByAccount(cacheAccount);
                    }
                    try {
                        localStorage.setItem(moduleKey, moduleStr);
                    } catch (ex) {
                        if (ex.name == 'QuotaExceededError') {
                            console.warn('缓存数据清除失败，将清空全部缓存数据！');
                            localStorage.clear();
                        }
                    }
                }
            }
        }
    }

    /**
     * 获取缓存的当前用户登录账号
     *
     * @returns {string}
     */
    static getCacheAccount() {
        let cacheAccount = localStorage.getItem('account');
        if (cacheAccount == null) {
            let reg = new RegExp('(^| )loginidweaver=([^;]*)(;|$)');
            let result = document.cookie.match(reg);
            if (result && result.length == 4) {
                cacheAccount = unescape(result[2]);
            }
        }

        return cacheAccount;
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

        // 如果有缓存的门户菜单，则登录后默认跳转缓存的第一个门户
        let portalMenu = this.getObj('theme', 'portalMenu', true);
        if (portalMenu && portalMenu.length) {
            defaultRoute += portalMenu[0].routeurl;
        }

        return defaultRoute;
    }

    /**
     * 登陆成功后，初始化浏览器本地缓存
     */
    static storageInit() {
        // 上次登录缓存的账号
        let cacheAccount = this.getCacheAccount();

        // 本次登录账号
        let account = '';
        let reg = new RegExp('(^| )loginidweaver=([^;]*)(;|$)');
        let result = document.cookie.match(reg);
        if (result && result.length == 4) {
            account = unescape(result[2]);
        }

        // 上次登录缓存的账号和本次登录账号不一致，清除上次登录缓存的账号的缓存数据
        if (cacheAccount && cacheAccount != account) {
            this.clearByAccount(cacheAccount);
        }
        this.setCacheAccount(account);
    }
}