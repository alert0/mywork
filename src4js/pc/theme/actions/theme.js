import {WeaTools} from 'ecCom';
import * as THEME_API from '../apis/theme';
import {THEME} from '../constants/ActionTypes';
import {MODULE_ROUTE_MAP} from '../constants/ModuleRouteMap';
import ECLocalStorage from '../util/ecLocalStorage';

/**
 * 加载主题信息
 *
 * @returns {function(*)}
 */
export function loadThemeInfo() {
    const themeType = 'ecology9';
    const themeColorType = ECLocalStorage.getStr('themeTemp', `themeColorType-${ECLocalStorage.getCacheAccount()}`, false) || '0';

    return (dispatch) => {
        dispatch({
            type: THEME.THEME_INFO,
            value: {
                themeInfo: {
                    themeType: themeType,
                    themeColorType: themeColorType
                }
            }
        });
    }
}


/**
 * 改变主题颜色类型
 *
 * @param type   主题颜色类型
 *
 * @returns {function(*, *)}
 */
export function changeThemeColorType(type) {
    ECLocalStorage.set('themeTemp', `themeColorType-${ECLocalStorage.getCacheAccount()}`, type, false);

    return (dispatch, getState) => {
        const themeType = getState().theme.get('themeInfo').toJSON().themeType;

        dispatch({
            type: THEME.THEME_INFO,
            value: {
                themeInfo: {
                    themeType: themeType,
                    themeColorType: type
                }
            }
        });
    }
}

/**
 * 加载顶部 logo
 *
 * @returns {function(*)}
 */
export function loadTopLogo() {
    return (dispatch) => {
        THEME_API.getThemeConfig().then((result) => {
            dispatch({
                type: THEME.THEME_TOP_LOGO,
                value: {
                    topLogoImage: result.logo
                }
            });
        });
    }
}

/**
 * 加载顶部菜单
 *
 * @returns {function(*)}
 */
export function loadTopMenu() {
    return (dispatch) => {
        THEME_API.getTopMenu().then((result) => {
            dispatch({
                type: THEME.THEME_TOP_MENU,
                value: {
                    topMenu: result
                }
            });
        });
    }
}

/**
 * 显示隐藏顶部菜单
 *
 * @param visible   是否显示
 *
 * @returns {function(*)}
 */
export function changeTopMenuVisible(visible) {
    return (dispatch) => {
        dispatch({
            type: THEME.THEME_TOP_MENU,
            value: {
                topMenuVisible: visible
            }
        });
    }
}

/**
 * 改变顶部菜单被选中的菜单
 *
 * @param topMenuSelected  顶部菜单被选中的菜单
 *
 * @returns {function(*)}
 */
export function changeTopMenuSelected(topMenuSelected) {
    return (dispatch) => {
        dispatch({
            type: THEME.THEME_TOP_MENU,
            value: {
                topMenuSelected: topMenuSelected
            }
        })
    }
}

/**
 * 加载常用菜单
 *
 * @returns {function(*)}
 */
export function loadFreqUseMenu() {
    return (dispatch) => {
        THEME_API.getFreqUseMenu().then((result) => {
            dispatch({
                type: THEME.THEME_TOP_FREQ_USE_MENU,
                value: {
                    freqUseMenu: result
                }
            });
        });
    }
}

/**
 * 显示隐藏常用菜单
 *
 * @param visible   是否显示
 *
 * @returns {function(*)}
 */
export function changeFreqUseMenuVisible(visible) {
    return (dispatch) => {
        dispatch({
            type: THEME.THEME_TOP_FREQ_USE_MENU,
            value: {
                freqUseMenuVisible: visible
            }
        });
    }
}

/**
 * 加载快速搜索类型
 *
 * @returns {function(*)}
 */
export function loadQuickSearchTypes() {
    return (dispatch) => {
        THEME_API.getQuickSearchTypes().then((result) => {
            dispatch({
                type: THEME.THEME_TOP_QUICK_SEARCH,
                value: {
                    quickSearchTypes: result,
                    quickSearchTypesSelected: result[0]
                }
            });
        });
    }
}

/**
 * 显示隐藏快速搜索类型
 *
 * @param visible   是否显示
 *
 * @returns {function(*)}
 */
export function changeQuickSearchTypesVisible(visible) {
    return (dispatch) => {
        dispatch({
            type: THEME.THEME_TOP_QUICK_SEARCH,
            value: {
                quickSearchTypesVisible: visible
            }
        });
    }
}

/**
 * 改变被选中的快速搜索类型
 *
 * @param quickSearchTypesSelected  被选中的快速搜索类型
 *
 * @returns {function(*)}
 */
export function changeQuickSearchTypesSelected(quickSearchTypesSelected) {
    return (dispatch) => {
        dispatch({
            type: THEME.THEME_TOP_QUICK_SEARCH,
            value: {
                quickSearchTypesSelected: quickSearchTypesSelected
            }
        })
    }
}

/**
 * 加载提醒消息信息
 *
 * @returns {function(*)}
 */
export function loadRemindInfo() {
    return (dispatch) => {
        THEME_API.getRemindList().then((result) => {
            let hasRemind = true;
            if (result[0].key == 'nodata') {
                hasRemind = false;
            }

            dispatch({
                type: THEME.THEME_TOP_REMIND,
                value: {
                    hasRemind: hasRemind,
                    remindList: result
                }
            });
        })
    }
}

/**
 * 显示隐藏提醒消息
 *
 * @param visible   是否显示
 *
 * @returns {function(*)}
 */
export function changeRemindListVisible(visible) {
    return (dispatch) => {
        dispatch({
            type: THEME.THEME_TOP_REMIND,
            value: {
                remindListVisible: visible
            }
        });
    }
}

/**
 * 加载工具栏菜单
 *
 * @returns {function(*)}
 */
export function loadToolbarMenu() {
    return (dispatch) => {
        THEME_API.getToolbarMenu().then((result) => {
            dispatch({
                type: THEME.THEME_TOP_TOOLBAR,
                value: {
                    toolbarMenu: result
                }
            });
        });
    }
}

/**
 * 加载工具栏更多菜单
 *
 * @returns {function(*)}
 */
export function loadToolbarMoreMenu() {
    return (dispatch) => {
        THEME_API.getToolbarMoreMenu().then((result) => {
            dispatch({
                type: THEME.THEME_TOP_TOOLBAR_MORE,
                value: {
                    toolbarMoreMenu: result
                }
            });
        });
    }
}

/**
 * 显示隐藏工具栏更多菜单
 *
 * @param visible   是否显示
 *
 * @returns {function(*)}
 */
export function changeToolbarMoreMenuVisible(visible) {
    return (dispatch) => {
        dispatch({
            type: THEME.THEME_TOP_TOOLBAR_MORE,
            value: {
                toolbarMoreMenuVisible: visible
            }
        });
    }
}

/**
 * 加载账号数据
 *
 * @returns {function(*)}
 */
export function loadAccount() {
    return (dispatch) => {
        THEME_API.getAccount().then((result) => {
            dispatch({
                type: THEME.THEME_TOP_ACCOUNT,
                value: {
                    account: result
                }
            });
        });
    }
}

/**
 * 显示隐藏账号数据
 *
 * @param visible   是否显示
 *
 * @returns {function(*)}
 */
export function changeAccountVisible(visible) {
    return (dispatch) => {
        dispatch({
            type: THEME.THEME_TOP_ACCOUNT,
            value: {
                accountVisible: visible
            }
        });
    }
}


/**
 * 左侧菜单数据格式化，将后端请求出的左侧菜单数据格式化为前端使用的统一格式
 *
 * @param data      后端返回的 JSON 格式的左侧菜单数据
 * @param type      菜单类型。目前类型分为三种：门户菜单（portal），邮件菜单（email），模块菜单（common）
 * @returns {Array}
 */
function leftMenuFormat(data, type) {
    let menu = [];

    for (let i = 0; i < data.length; i++) {
        // 屏蔽流程督办菜单
        if ((data[i].infoId ? (data[i].parentId || '0') + '-' + data[i].infoId : (data[i].parentId || '0') + '-' + data[i].id) == '1-235') continue;
        let obj = {
            // 格式化后的id由父级菜单id加上菜单本身的id
            id: data[i].infoId ? (data[i].parentId || '0') + '-' + data[i].infoId : (data[i].parentId || '0') + '-' + data[i].id,
            parentId: data[i].parentId || '0',
            // 格式化后的levelid由父级菜单id加上菜单本身levelid
            levelid: (data[i].parentId || '0') + '-' + ('portal' == type ? data[i].levelid.split('_')[0] % 20 + '_portal' : data[i].levelid),
            origName: data[i].name,
            name: data[i].name,
            icon: !data[i].icon || data[i].icon == '/images/homepage/baseelement_wev8.gif' || data[i].icon.indexOf('/images_face/') != -1 || data[i].icon.indexOf('/images/') != -1 || data[i].icon.indexOf('/image_secondary/') != -1 ? '' : data[i].icon,
            url: data[i].url && data[i].url.replace(/&#38;/g, '&'),
            // 门户返回的路由地址最前面有个“#”号，需要去除
            routeurl: 'portal' == type && data[i].routeurl ? '/portal' + data[i].routeurl.substring(1) : data[i].routeurl,
            child: data[i].child ? leftMenuFormat(data[i].child, type) : [],
            target: data[i].target || 'mainFrame',
            count: data[i].count != undefined ? data[i].count + '' : '',
            countId: data[i].countId || '',
            titleUrlIcon: data[i].titleUrlIcon || '',
            titleUrl: data[i].titleUrl || '',
            tagColor: data[i].tagColor || '',
            hasTopLine: data[i].hasTopLine || '',
        };

        menu.push(obj);
    }

    return menu;
}

/**
 * 格式化并按菜单类型缓存左侧菜单
 *
 * @param result    后端返回的 JSON 格式的左侧菜单数据
 * @param type      菜单类型。目前类型分为三种：门户菜单（portal），邮件菜单（email），模块菜单（common）
 * @param key       缓存左侧菜单使用的关键字：门户菜单（portalMenu），邮件菜单（emailMenu），模块菜单（commonMenu-[parentId]）
 *
 * @return {Array}
 */
function formatAndCacheLeftMenu(result, type, key) {
    let leftMenu = leftMenuFormat(result, type);
    ECLocalStorage.set('theme', key, leftMenu, true);

    return leftMenu;
}

/**
 * 加载所有模块菜单，格式化并按菜单类型缓存左侧菜单
 */
function loadAllMenu() {
    THEME_API.getPortalMenu().then(function (result) {
        formatAndCacheLeftMenu(result.menuList, 'portal', 'portalMenu');
    });

    THEME_API.getEmailMenu().then(function (result) {
        formatAndCacheLeftMenu(result, 'email', 'emailMenu');
    });

    THEME_API.getCommonMenu({parentid: 0}).then(function (result) {
        for (let i = 0, len = result.length; i < len; i++) {
            if ('1' == result[i].isportal) {
                continue;
            }

            formatAndCacheLeftMenu(result[i].child || [], 'common', 'commonMenu-' + result[i].infoId);
        }
    });
}

/**
 * 根据具体的路由地址计算出左侧菜单和选中的菜单
 *
 * @param pathname      pathname的正确结构为：main/[模块路由]/[模块菜单路由]
 *                          main/portal/portal-1-1  表示门户下 hpid=1&subCompanyId=1 的门户菜单
 *                          main/workflow/listDoing 表示我的流程下“待办事宜”菜单
 * @param hasReload     是否需要重新加载所有菜单
 *
 * @returns {function(*=)}
 */
export function loadLeftMenu(pathname, hasReload) {
    if (hasReload) {
        // 加载所有模块菜单，格式化并按菜单类型缓存左侧菜单
        loadAllMenu();
    }

    //console.log('loadLeftMenu pathname:', pathname);
    // 根据路由地址解析出模块路由和模块菜单路由
    let routes = pathname.split('/');
    let moduleRoute = '';
    let moduleMenuRoute = '';
    let parentId = 0;
    if (routes && routes.length >= 3) {
        moduleRoute = routes[1];
        moduleMenuRoute = routes[2];
        parentId = MODULE_ROUTE_MAP[moduleRoute].id;
    }

    let leftMenu = null;
    let leftMenuPromise = null;
    let leftMenuType = '';
    if ('main' == pathname || 'main/' == pathname || 'portal' == moduleRoute) {
        let portalMenu = ECLocalStorage.getObj('theme', 'portalMenu', true);
        if (portalMenu) {
            leftMenu = portalMenu;
        } else {
            leftMenuPromise = THEME_API.getPortalMenu();
        }
        leftMenuType = 'portal';

    } else if ('email' == moduleRoute) {
        let emailMenu = ECLocalStorage.getObj('theme', 'emailMenu', true);
        if (emailMenu) {
            leftMenu = emailMenu;
        } else {
            leftMenuPromise = THEME_API.getEmailMenu();
        }
        leftMenuType = 'email';

    } else {
        let commonMenu = ECLocalStorage.getObj('theme', 'commonMenu-' + parentId, true);
        if (commonMenu) {
            leftMenu = commonMenu;
        } else {
            leftMenuPromise = THEME_API.getCommonMenu({parentid: parentId});
        }
        leftMenuType = 'common';

    }

    return (dispatch) => {
        if (leftMenu) {
            dispatchLeftMenu(dispatch, pathname, moduleRoute, moduleMenuRoute, leftMenu);
        } else {
            leftMenuPromise.then(function (result) {
                if ('portal' == leftMenuType) {
                    leftMenu = formatAndCacheLeftMenu(result.menuList, 'portal', 'portalMenu');
                } else if ('email' == leftMenuType) {
                    leftMenu = formatAndCacheLeftMenu(result, 'email', 'emailMenu');
                } else if ('common' == leftMenuType) {
                    leftMenu = formatAndCacheLeftMenu(result, 'common', 'commonMenu-' + parentId);
                }

                dispatchLeftMenu(dispatch, pathname, moduleRoute, moduleMenuRoute, leftMenu);
            });
        }
    }
}

function dispatchLeftMenu(dispatch, pathname, moduleRoute, moduleMenuRoute, leftMenu) {
    // 默认选中的菜单
    let leftMenuSelected = {};

    if ('main' == pathname || 'main/' == pathname) {
        leftMenuSelected = leftMenu[0];
        onLoadMain(leftMenuSelected);

    } else {
        leftMenuSelected = routeMatch(leftMenu, `/${moduleRoute}/${moduleMenuRoute}`) || {};
    }

    dispatch({
        type: THEME.THEME_LEFT_MENU,
        value: {
            leftMenu: leftMenu,
            leftMenuSelected: leftMenuSelected
        }
    });
}

function routeMatch(leftMenu, route) {
    let leftMenuSelected = null;

    for (let i = 0, len = leftMenu.length; i < len; i++) {
        if (route == leftMenu[i].routeurl) {
            leftMenuSelected = leftMenu[i];
            break;
        }

        if (leftMenu[i].child && leftMenu[i].child.length) {
            leftMenuSelected = routeMatch(leftMenu[i].child, route);
            if (leftMenuSelected) {
                return leftMenuSelected;
            }
        }
    }

    return leftMenuSelected;
}

/**
 * 根据选中的顶部菜单，改变左侧菜单，并默认选中第一个菜单
 *
 * @param type          菜单类型。目前类型分为三种：门户菜单（portal），邮件菜单（email），模块菜单（common）
 * @param topMenuId     顶部菜单id
 * @param topMenuName   顶部菜单名称
 *
 * @returns {function(*)}
 */
export function changeLeftMenu(type, topMenuId, topMenuName) {
    let leftMenu = null;
    let leftMenuSelected = null;
    let leftMenuType = '';
    let leftMenuPromise = null;

    if ('portal' == type) {
        let portalMenu = ECLocalStorage.getObj('theme', 'portalMenu', true);
        if (portalMenu) {
            leftMenu = portalMenu;
        } else {
            leftMenuPromise = THEME_API.getPortalMenu();
        }
        leftMenuType = 'portal';

    } else if ('email' == type || '536' == topMenuId) {
        let emailMenu = ECLocalStorage.getObj('theme', 'emailMenu', true);
        if (emailMenu) {
            leftMenu = emailMenu;
        } else {
            leftMenuPromise = THEME_API.getEmailMenu();
        }
        leftMenuType = 'email';

    } else {
        let commonMenu = ECLocalStorage.getObj('theme', 'commonMenu-' + topMenuId, true);
        if (commonMenu) {
            leftMenu = commonMenu;
        } else {
            leftMenuPromise = THEME_API.getCommonMenu({parentid: topMenuId});
        }
        leftMenuType = 'common';

    }

    if (leftMenu) {
        leftMenuSelected = leftMenu[0];
        if ('email' == leftMenuType) {
            leftMenuSelected = leftMenu[2];
        }

        onLoadMain(leftMenuSelected);

        return (dispatch) => {
            dispatch({
                type: THEME.THEME_LEFT_MENU,
                value: {
                    leftMenu: leftMenu,
                    leftMenuSelected: leftMenuSelected,
                    leftMenuType: leftMenuType
                }
            });
        }

    } else {
        return (dispatch) => {
            leftMenuPromise.then(function (result) {
                if ('portal' == leftMenuType) {
                    leftMenu = formatAndCacheLeftMenu(result.menuList, 'portal', 'portalMenu');
                } else if ('email' == leftMenuType) {
                    leftMenu = formatAndCacheLeftMenu(result, 'email', 'emailMenu');
                } else if ('common' == leftMenuType) {
                    leftMenu = formatAndCacheLeftMenu(result, 'common', 'commonMenu-' + topMenuId);
                }

                leftMenuSelected = leftMenu[0];
                if ('email' == leftMenuType) {
                    leftMenuSelected = leftMenu[2];
                }

                onLoadMain(leftMenuSelected);

                dispatch({
                    type: THEME.THEME_LEFT_MENU,
                    value: {
                        leftMenu: leftMenu,
                        leftMenuSelected: leftMenuSelected,
                        leftMenuType: leftMenuType
                    }
                });
            });
        }
    }
}

/**
 * 改变左侧菜单被选中的菜单
 *
 * @param leftMenuSelected  左侧菜单被选中的菜单
 *
 * @returns {function(*)}
 */
export function changeLeftMenuSelected(leftMenuSelected) {
    return (dispatch) => {
        dispatch({
            type: THEME.THEME_LEFT_MENU,
            value: {
                leftMenuSelected: leftMenuSelected
            }
        })
    }
}

/**
 * 改变左侧菜单展示模式
 *
 * @param leftMenuMode  左侧菜单展示模式。1、展开状态（inline），即菜单垂直展开；2、收缩状态（vertical），即菜单水平展开
 *
 * @returns {function(*)}
 */
export function changeLeftMenuMode(leftMenuMode) {
    ECLocalStorage.set('themeTemp', `leftMenuMode-${ECLocalStorage.getCacheAccount()}`, leftMenuMode, false);

    return (dispatch) => {
        dispatch({
            type: THEME.THEME_LEFT_MENU,
            value: {
                leftMenuMode: leftMenuMode
            }
        })
    }
}

/**
 * 加载路由或iframe
 *
 * @param menu      需要加载的菜单
 */
export function onLoadMain(menu) {
    let routeUrl = menu.routeurl;
    let url = menu.url;

    if (routeUrl) {
        weaHistory.push({pathname: '/main' + routeUrl});

        document.getElementById('e9frameMain').style.visibility = 'hidden';
        document.getElementById('e9routeMain').style.display = 'block';
        let mainframe = document.getElementById('mainFrame');
        mainframe.src = 'about:blank';
    } else if (url && url != 'javascript:void(0);') {
        let target = menu.target || 'mainFrame';
        if ('mainFrame' != target) {
            window.open(url, target);
        } else {
            let mainframe = document.getElementById('mainFrame');

            //处理邮件菜单
            if (url.indexOf('MailAdd.jsp') != -1 || url.indexOf('MailInboxList.jsp') != -1) {
                try {
                    if (url.indexOf('MailAdd.jsp') != -1) {
                        mainframe.contentWindow.addTab('1', url, menu.origName);
                    } else if (url.indexOf('MailInboxList.jsp') != -1) {
                        mainframe.contentWindow.refreshMailTab('2', url, menu.origName);
                    }
                } catch (e) {
                    mainframe.src = '/email/new/MailInBox.jsp?' + url.split("?")[1];
                }
            } else {
                mainframe.src = url;
            }

            document.getElementById('e9frameMain').style.visibility = 'visible';
            document.getElementById('e9routeMain').style.display = 'none';
        }
    }
}
