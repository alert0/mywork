import {WeaTools} from 'weaCom';
import {PORTAL_LEFT_MENU} from '../constants/ActionTypes';
import {MODULE_ROUTE_MAP} from '../constants/ModuleRouteMap';
import ECLocalStorage from '../util/ecLocalStorage';

/**
 * 将后端请求出的菜单数据格式化为统一格式
 *
 * @param data      后台返回的JSON格式的菜单数据
 * @param type      菜单类型。目前类型分为三种：门户菜单（portal），邮件菜单（email），模块菜单（common）
 * @returns {Array}
 */
function formatMenu(data, type) {
    let menu = [];

    for (let i = 0; i < data.length; i++) {
        let obj = {
            // id由父级菜单id加上本身id
            id: data[i].infoId ? (data[i].parentId || '0') + '-' + data[i].infoId : (data[i].parentId || '0') + '-' + data[i].id,
            parentId: data[i].parentId || '0',
            levelid: (data[i].parentId || '0') + '-' + ('portal' == type ? data[i].levelid.split('_')[0] % 20 + '_portal' : data[i].levelid),
            origName: data[i].name,
            name: data[i].count != undefined ? data[i].name + '(' + data[i].count + ')' : data[i].name,
            icon: !data[i].icon || data[i].icon == '/images/homepage/baseelement_wev8.gif' || data[i].icon.indexOf('/images_face/') != -1 || data[i].icon.indexOf('/images/') != -1 || data[i].icon.indexOf('/image_secondary/') != -1 ? '' : data[i].icon,
            url: data[i].url && data[i].url.replace(/&#38;/g, '&'),
            // 门户返回的路由地址最前面有个“#”号，需要去除
            routeurl: 'portal' == type && data[i].routeurl ? '/portal' + data[i].routeurl.substring(1) : data[i].routeurl,
            child: data[i].child ? formatMenu(data[i].child, type) : [],
            target: data[i].target || 'mainFrame',
            count: data[i].count || '',
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
 * 加载门户菜单，返回Promise对象
 *
 * @returns {Promise}
 */
function getPortalMenuPromise() {
    return WeaTools.callApi('/page/interfaces/portalMenuToJson.jsp?parentid=0', 'GET', {}, 'json');
}

/**
 * 加载邮件菜单，返回Promise对象
 *
 * @returns {Promise}
 */
function getEmailMenuPromise() {
    return WeaTools.callApi('/wui/theme/ecology9/page/emailMenuJSON.jsp', 'GET', {}, 'json');
}

/**
 * 加载模块菜单，返回Promise对象
 *
 * @param parentId      模块父级菜单id。当parentId为0时，加载所有模块菜单
 * @returns {Promise}
 */
function getCommonMenuPromise(parentId) {
    return WeaTools.callApi('/page/interfaces/leftMenuToJson.jsp', 'POST', {parentid: parentId}, 'json');
}

/**
 * 加载所有模块菜单，并按模块分类缓存
 */
function loadAllMenu() {
    getPortalMenuPromise().then(function (result) {
        let portalMenu = formatMenu(result.menuList, 'portal');
        ECLocalStorage.set('portalLeftMenu', 'portalMenu', portalMenu, true);
    });

    WeaTools.callApi('/page/interfaces/leftMenuToJson.jsp?parentid=0', 'GET', {}, 'json').then(function (result) {
        for (let i = 0, len = result.length; i < len; i++) {
            if ('1' == result[i].isportal) {
                continue;
            }

            let commonMenu = formatMenu(result[i].child || [], 'common');
            ECLocalStorage.set('portalLeftMenu', 'commonMenu-' + result[i].infoId, commonMenu, true);
        }
    });

    getEmailMenuPromise().then(function (result) {
        let emailMenu = formatMenu(result, 'email');
        ECLocalStorage.set('portalLeftMenu', 'emailMenu', emailMenu, true);
    });
}

/**
 * 根据具体的路由地址计算出左侧菜单和选中的菜单
 *
 * @param router        路由对象
 * @param pathname      pathname的正确结构为：main/[模块路由]/[模块菜单路由]
 *                          main/portal/portal-1-1  表示门户下 hpid=1&subCompanyId=1 的门户菜单
 *                          main/workflow/listDoing 表示我的流程下“待办事宜”菜单
 * @param hasReload     是否需要重新加载所有菜单
 * @returns {function(*=)}
 */
export function loadLeftMenu(router, pathname, hasReload) {
    if (hasReload) {
        // 加载所有的菜单并缓存
        loadAllMenu();
    }

    // 根据路由地址解析出模块路由和模块菜单路由
    let routers = pathname.split('/');
    let moduleRoute = '';
    let moduleMenuRoute = '';
    let parentId = 0;
    if (routers && routers.length == 3) {
        moduleRoute = routers[1];
        moduleMenuRoute = routers[2];
        parentId = MODULE_ROUTE_MAP[moduleRoute].id;
    }

    let leftMenu = null;
    let leftMenuPromise = null;
    let leftMenuType = '';
    if ('main' == pathname || 'main/' == pathname || 'portal' == moduleRoute) {
        let portalMenu = ECLocalStorage.getObj('portalLeftMenu', 'portalMenu', true);
        if (portalMenu) {
            leftMenu = portalMenu;
        } else {
            leftMenuPromise = getPortalMenuPromise();
        }
        leftMenuType = 'portal';

    } else if ('email' == moduleRoute) {
        let emailMenu = ECLocalStorage.getObj('portalLeftMenu', 'emailMenu', true);
        if (emailMenu) {
            leftMenu = emailMenu;
        } else {
            leftMenuPromise = getEmailMenuPromise();
        }
        leftMenuType = 'email';

    } else {
        let commonMenu = ECLocalStorage.getObj('portalLeftMenu', 'commonMenu-' + parentId, true);
        if (commonMenu) {
            leftMenu = commonMenu;
        } else {
            leftMenuPromise = getCommonMenuPromise(parentId);
        }
        leftMenuType = 'common';

    }

    return (dispatch) => {
        if (leftMenu) {
            dispatchLeftMenu(dispatch, router, pathname, moduleRoute, moduleMenuRoute, leftMenu);
        } else {
            leftMenuPromise.then(function (result) {
                if ('portal' == leftMenuType) {
                    leftMenu = formatMenu(result.menuList, 'portal');
                    ECLocalStorage.set('portalLeftMenu', 'portalMenu', leftMenu, true);
                } else if ('email' == leftMenuType) {
                    leftMenu = formatMenu(result, 'email');
                    ECLocalStorage.set('portalLeftMenu', 'emailMenu', leftMenu, true);
                } else if ('common' == leftMenuType) {
                    leftMenu = formatMenu(result, 'common');
                    ECLocalStorage.set('portalLeftMenu', 'commonMenu-' + parentId, leftMenu, true);
                }

                dispatchLeftMenu(dispatch, router, pathname, moduleRoute, moduleMenuRoute, leftMenu);
            });
        }
    }
}

function dispatchLeftMenu(dispatch, router, pathname, moduleRoute, moduleMenuRoute, leftMenu) {
    // 默认选中的菜单
    let selectedMenu = {};

    if ('main' == pathname || 'main/' == pathname) {
        selectedMenu = leftMenu[0];
        loadMain(router, selectedMenu);

    } else {
        selectedMenu = routeMatch(leftMenu, `/${moduleRoute}/${moduleMenuRoute}`) || {};
    }

    dispatch({
        type: PORTAL_LEFT_MENU.PORTAL_LEFT_MENU,
        value: {
            leftMenu: leftMenu,
            selectedMenu: selectedMenu
        }
    });
}

function routeMatch(leftMenu, route) {
    let selectedMenu = null;

    for (let i = 0, len = leftMenu.length; i < len; i++) {
        if (route == leftMenu[i].routeurl) {
            selectedMenu = leftMenu[i];
            break;
        }

        if (leftMenu[i].child && leftMenu[i].child.length) {
            selectedMenu = routeMatch(leftMenu[i].child, route);
            if (selectedMenu) {
                return selectedMenu;
            }
        }
    }

    return selectedMenu;
}

/**
 * 根据选中的顶部菜单，改变左侧菜单，并默认选中第一个菜单
 *
 * @param type          菜单类型。目前类型分为三种：门户菜单（portal），邮件菜单（email），模块菜单（common）
 * @param topMenuId     顶部菜单id
 * @param topMenuName   顶部菜单名称
 * @param router        路由对象
 * @returns {function(*)}
 */
export function changeLeftMenu(type, topMenuId, topMenuName, router) {
    let leftMenu = null;
    let selectedMenu = null;
    let leftMenuType = '';
    let leftMenuPromise = null;

    if ('portal' == type) {
        let portalMenu = ECLocalStorage.getObj('portalLeftMenu', 'portalMenu', true);
        if (portalMenu) {
            leftMenu = portalMenu;
        } else {
            leftMenuPromise = getPortalMenuPromise();
        }
        leftMenuType = 'portal';
    } else if ('email' == type || '536' == topMenuId) {
        let emailMenu = ECLocalStorage.getObj('portalLeftMenu', 'emailMenu', true);
        if (emailMenu) {
            leftMenu = emailMenu;
        } else {
            leftMenuPromise = getEmailMenuPromise();
        }
        leftMenuType = 'email';
    } else {
        let commonMenu = ECLocalStorage.getObj('portalLeftMenu', 'commonMenu-' + topMenuId, true);
        if (commonMenu) {
            leftMenu = commonMenu;
        } else {
            leftMenuPromise = getCommonMenuPromise(topMenuId);
        }
        leftMenuType = 'common';
    }

    if (leftMenu) {
        selectedMenu = leftMenu[0];
        if ('email' == leftMenuType) {
            selectedMenu = leftMenu[2];
        }

        loadMain(router, selectedMenu);

        return (dispatch) => {
            dispatch({
                type: PORTAL_LEFT_MENU.PORTAL_LEFT_MENU,
                value: {
                    leftMenu: leftMenu,
                    selectedMenu: selectedMenu,
                    leftMenuType: leftMenuType
                }
            });
        }

    } else {
        return (dispatch) => {
            leftMenuPromise.then(function (result) {
                if ('portal' == leftMenuType) {
                    leftMenu = formatMenu(result.menuList, 'portal');
                    ECLocalStorage.set('portalLeftMenu', 'portalMenu', leftMenu, true);
                } else if ('email' == leftMenuType) {
                    leftMenu = formatMenu(result, 'email');
                    ECLocalStorage.set('portalLeftMenu', 'emailMenu', leftMenu, true);
                } else if ('common' == leftMenuType) {
                    leftMenu = formatMenu(result, 'common');
                    ECLocalStorage.set('portalLeftMenu', 'commonMenu-' + topMenuId, leftMenu, true);
                }

                selectedMenu = leftMenu[0];
                if ('email' == leftMenuType) {
                    selectedMenu = leftMenu[2];
                }

                loadMain(router, selectedMenu);

                dispatch({
                    type: PORTAL_LEFT_MENU.PORTAL_LEFT_MENU,
                    value: {
                        leftMenu: leftMenu,
                        selectedMenu: selectedMenu,
                        leftMenuType: leftMenuType
                    }
                });
            }, function (result) {
                console.log(result);
            });
        }
    }
}

/**
 * 改变左侧菜单被选中的菜单
 *
 * @param selectedMenu  左侧菜单被选中的菜单
 * @returns {function(*)}
 */
export function changeSelectedMenu(selectedMenu) {
    return (dispatch) => {
        dispatch({
            type: PORTAL_LEFT_MENU.PORTAL_LEFT_MENU_SELECTED_MENU,
            value: {
                selectedMenu: selectedMenu
            }
        })
    }
}

/**
 * 改变左侧菜单展示模式
 *
 * @param leftMenuMode  左侧菜单展示模式。1、展开状态（inline），即菜单垂直展开；2、收缩状态（vertical），即菜单水平展开
 * @returns {function(*)}
 */
export function changeLeftMenuMode(leftMenuMode) {
    ECLocalStorage.set('portalLeftMenu', 'leftMenuMode', leftMenuMode, false);

    return (dispatch) => {
        dispatch({
            type: PORTAL_LEFT_MENU.PORTAL_LEFT_MENU_MODE,
            value: {
                leftMenuMode: leftMenuMode
            }
        })
    }
}

/**
 * 加载路由或iframe
 *
 * @param router        路由对象
 * @param selectedMenu  选中的菜单
 */
export function loadMain(router, selectedMenu) {
    let routeUrl = selectedMenu.routeurl;
    let url = selectedMenu.url;

    if (routeUrl) {
        router.push({pathname: '/main' + routeUrl});

        document.getElementById('e9frameMain').style.visibility = 'hidden';
        document.getElementById('e9routeMain').style.display = 'block';
        let mainframe = document.getElementById('mainFrame');
        mainframe.src = '';
    } else if (url && url != 'javascript:void(0);') {
        let target = selectedMenu.target || 'mainFrame';
        if ('mainFrame' != target) {
            window.open(url, target);
        } else {
            let mainframe = document.getElementById('mainFrame');

            //处理邮件菜单
            if (url.indexOf('MailAdd.jsp') != -1 || url.indexOf('MailInboxList.jsp') != -1) {
                try {
                    if (url.indexOf('MailAdd.jsp') != -1) {
                        mainframe.contentWindow.addTab('1', url, selectedMenu.origName);
                    } else if (url.indexOf('MailInboxList.jsp') != -1) {
                        mainframe.contentWindow.refreshMailTab('2', url, selectedMenu.origName);
                    }
                } catch (e) {
                    mainframe.src = '/email/new/MailInBox.jsp?' + url.split("?")[1];
                }
            } else {
                mainframe.src = url;
            }
        }

        document.getElementById('e9frameMain').style.visibility = 'visible';
        document.getElementById('e9routeMain').style.display = 'none';
    }
}