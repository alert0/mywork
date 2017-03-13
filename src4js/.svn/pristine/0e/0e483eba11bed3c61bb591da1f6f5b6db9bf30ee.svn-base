const REQ_URLS = {
    HOMEPAGE_URL: "/page/interfaces/homepageInterface.jsp",
    ELEMENT_URL: "/page/interfaces/element/Elements.jsp",
    ELEMENTTABCONTENTDATA_URL: "/page/interfaces/element/compatible/ElementsTabContentData.jsp",
    SCRATCHPAD_URL: "/page/element/scratchpad/ScratchpadOperation.jsp",
    WORKFLOW_MORE_SPA_URL: "/spa/workflow/index.jsp#/main/workflow/queryFlow?jsonstr="
}

// 协同区Url
const SYNERGY_URL = '/page/interfaces/synergyInfoToJson.jsp'; //初始化门户配置信息
const SYNERGY_ROUTER_MAPPING_URL = {
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


// 门户相关
const INIT_HP_DATA = "init_hp_data"; //初始化门户配置信息
const INIT_E_DATA = "init_e_data"; //初始化元素信息
const REFRESH_E_DATA = "refresh_e_data"; //刷新元素数据
const GET_E_TAB_DATA = "get_e_tab_data"; //获取默认tab页的数据
const GET_E_CURRENT_TABID = "get_e_current_tabid"; //刷新元素tab页的数据
const INIT_SPECIAL_E_DATA = "init_special_e_data"; //初始化特殊元素信息(包含：通讯录，微博动态，我的邮件三个元素)
const CHANGE_E_TABID = "change_e_tabid"; //切换元素tab更新tabid
const INIT_CONTACTS_DATA = "init_contacts_data"; //初始化通讯录元素信息
const INIT_SCRATCHPAD_TEXT = "init_scratchpad_text"; //初始化便签元素信息
const INIT_CUSTOMPAGE_VISIBLE = "init_custompage_visible"; //自定义页面元素信息
const GET_MYCALENDAR_DATA = "get_mycalendar_data"; //日历日程元素信息

//元素类型统一管理
const ELEMENT_TYPES = {
    /** ---------- 可变tab元素 ---------- **/
    RSS: "1", // RSS元素
    NEWS: "7", // 文档元素
    WORKFLOW: "8", // 流程元素
    CUSTOMPAGE: "29", // 自定义页面元素
    REPORTFORM: "reportForm", // 图表元素
    OUTDATA: "OutData", // 外部数据元素
    FORMMODECUSTOMSEARCH: "FormModeCustomSearch", // 建模查询中心元素

    /** ---------- 不可变tab元素 ---------- **/
    MAIL: "16", // 我的邮件
    ADDWF: "addwf", // 新建流程
    TASK: "Task", // 任务元素
    BLOGSTATUS: "blogStatus", // 微博元素
    CONTACTS: "contacts", // 通讯录

    /** ---------- 以view.jsp页面显示的元素 ---------- **/
    UNREAD_DOCS: "6", // 未读文档
    MESSAGE_REMINDING: "9", // 消息提醒 
    MY_PROJECTS: "10", // 我的项目 
    NEW_CUSTOMERS: "11", // 最新客户 
    NEW_MEETING: "12", // 最新会议 
    UNREAD_COOPERATION: "13", // 未读协作  
    MONTH_TARGET: "14", // 当月目标 
    DAY_PLAN: "15", // 当日计划
    SUBSCRIBE_KONWLEDG: "34", // 知识订阅

    /** ---------- 元素 ---------- **/
    MORE_NEWS: "17", // 多新闻中心
    MAGEZINE: "18", // 期刊元素
    STOCK: "19", // 股票元素
    DOC_CONTENT: "25", // 文档内容
    AUDIO: "audio", // 音频元素 
    FAVOURITE: "favourite", // 收藏元素
    FLASH: "Flash", // Flash元素
    PICTURE: "picture", // 图片元素
    MYCALENDAR: "MyCalendar", // 日历日程
    IMGSLIDE: "imgSlide", // 多图元素
    NEWNOTICE: "newNotice", // 最新通告  
    OUTTERSYS: "outterSys", // 集成登录
    SCRATCHPAD: "scratchpad", // 便签元素
    WEATHER: "weather", // 天气元素
    VIDEO: "video", // 视频元素 
    SLIDE: "Slide", // 幻灯片元素 
    DATACENTER: "DataCenter", // 个人中心
    JOBSINFO: "jobsinfo", // 多岗位办理事项
    SEARCHENGINE: "searchengine", // 搜索元素
    NOTICE: "notice", // 通告栏元素
    PLAN: "plan", // 计划元素
    MENU: "menu", // 菜单元素
    WORKTASK: "32" // 任务计划
}

module.exports = {
    REQ_URLS,
    ELEMENT_TYPES,
    INIT_HP_DATA,
    INIT_E_DATA,
    REFRESH_E_DATA,
    GET_E_TAB_DATA,
    GET_E_CURRENT_TABID,
    INIT_SPECIAL_E_DATA,
    CHANGE_E_TABID,
    INIT_CONTACTS_DATA,
    INIT_SCRATCHPAD_TEXT,
    INIT_CUSTOMPAGE_VISIBLE,
    GET_MYCALENDAR_DATA,
    SYNERGY_URL,
    SYNERGY_ROUTER_MAPPING_URL
}
