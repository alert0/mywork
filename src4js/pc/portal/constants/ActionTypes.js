const SYNERGY_URL = '/api/portal/synergy/synergyinfo';     // 协同区Url
const SYNERGY_ROUTER_MAPPING_URL = {                       // 协同区路由与url映射关系
    '/workflow/listDoing': {
        path: '/workflow/search/WFSearchResult.jsp',
        viewScope: 'doing'
    },
    '/workflow/add': {
        path: '/workflow/request/RequestTypeShow.jsp',
        viewScope: ''
    },
    '/workflow/listDone': {
        path: '/workflow/search/WFSearchResult.jsp',
        viewScope: 'done'
    },
    '/workflow/listMine': {
        path: '/workflow/search/WFSearchResult.jsp',
        viewScope: 'mine'
    },
    '/workflow/queryFlow': {
        path: '/workflow/search/WFSearchShow.jsp',
        viewScope: ''
    },
    '/workflow/req': {
        path: '/workflow/request/ViewRequest.jsp',
        viewScope: ''
    }
}

const PORTAL_URL = "/api/portal/homepage/hpdata";          // 初始化门户配置信息url
const PORTAL_BE_LIST_URL = "/api/portal/hpbaseelement/list";  // 初始化门户配置信息url
const PORTAL_ADD_ELEMENT = "/api/portal/hpbaseelement/addElement";  // 初始化门户配置信息url
const PORTAL_SETTING_INFO ="/api/portal/hpsetting/hpsettinginfo";//获取门户设置信息url
const PORTAL_DOPORTALSYNIZE="/api/portal/rightclick/doPortalSynize";//更新同步
// 门户相关
const PORTAL_HPDATA = "portal_hpdata";                     //门户组件状态常量
const PORTAL_PARAMS = "portal_params";                     //门户组件状态常量
const PORTAL_BE_LIST = "portal_be_list";                   //门户设置组件
const PORTAL_BE_LIST_FILTER = "portal_be_list_filter";
const PORTAL_HP_SETTING = "portal_hp_setting";
const PORTAL_HP_SETTING_MAX = "portal_hp_setting_max";
const PORTAL_HP_SETTING_CLOSE = "portal_hp_setting_close";
const RIGHT_CLICK_LOCATION_SHOW="right_click_location_show"; //显示页面地址对话框
const RIGHT_CLICK_SYNCHOME="right_click_synchome";//同步首页确认框
const RIGHT_CLICK_MENU_SHOW = 'right_click_menu_show';
const RIGHT_CLICK_MENU_CLOSE = 'right_click_menu_close';
const RIGHT_CLICK_MENU_URL = '/api/portal/rightclick/rightclickmenu';
const RIGHT_CLICK_MENU_LIST = 'right_click_menu_list';

module.exports = {
    PORTAL_URL,
    PORTAL_HPDATA,
    PORTAL_DOPORTALSYNIZE,
    PORTAL_PARAMS,
    SYNERGY_URL,
    SYNERGY_ROUTER_MAPPING_URL,
    PORTAL_BE_LIST_URL,
    PORTAL_BE_LIST,
    PORTAL_BE_LIST_FILTER,
    PORTAL_ADD_ELEMENT,
    PORTAL_HP_SETTING,
    PORTAL_SETTING_INFO,
    PORTAL_HP_SETTING_MAX,
    PORTAL_HP_SETTING_CLOSE,
    RIGHT_CLICK_MENU_SHOW,
    RIGHT_CLICK_MENU_CLOSE,
    RIGHT_CLICK_MENU_URL,
    RIGHT_CLICK_SYNCHOME,
    RIGHT_CLICK_LOCATION_SHOW,
    RIGHT_CLICK_MENU_LIST,
}
