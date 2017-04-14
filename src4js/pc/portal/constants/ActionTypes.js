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

// 门户相关
const PORTAL_HPDATA = "portal_hpdata";                     //门户组件状态常量
const PORTAL_PARAMS = "portal_params";                     //门户组件状态常量

module.exports = {
    PORTAL_URL,
    PORTAL_HPDATA,
    PORTAL_PARAMS,
    SYNERGY_URL,
    SYNERGY_ROUTER_MAPPING_URL
}
