const ELEMENT_STATE_TYPES = {                                // 通用元素组件状态常量
    ELEMENT_DATA: 'element_data',
    ELEMENT_REFRESH: 'element_refresh',
    ELEMENT_CONFIG: 'element_config',
    ELEMENT_DELETE: 'element_delete'
}

const ELEMENT_TOOLBAR = {                                    // 元素锁定状态常量
    ELEMENT_TOOLBAR_ISLOCK:'element_toolbar_islock'
}

const WORKFLOW_STATE_TYPES = {                               // 流程元素组件状态常量
    WORKFLOW_TAB_DATA:'workflow_tab_data',
    WORKFLOW_TAB_REFRESH:'workflow_tab_refresh',
    WORKFLOW_TAB_TABID:'workflow_tab_tabid',
    CHANGE_WORKFLOW_TABID:'change_workflow_tabid'
}

const CUSTOMPAGE_STATE_TYPES = {                             // 自定义页面组件状态常量
    CUSTOMPAGE_TAB_DATA:'custompage_tab_data',
    CUSTOMPAGE_TAB_REFRESH:'custompage_tab_refresh',
    CUSTOMPAGE_TAB_TABID:'custompage_tab_tabid',
    CHANGE_CUSTOMPAGE_TABID:'change_custompage_tabid',
    CUSTOMPAGE_IFRAME_REFRESH:'custompage_iframe_refresh'
}

const MYCALENDAR_STATE_TYPES = {                             // 日历日程组件状态常量
    MYCALENDAR_DATA:'mycalendar_data'
}

const RSS_STATE_TYPES = {                                    // RSS阅读器组件状态常量
    RSS_TAB_DATA:'rss_tab_data',
    RSS_TAB_REFRESH:'rss_tab_refresh',
    RSS_TAB_TABID:'rss_tab_tabid',
    CHANGE_RSS_TABID:'change_rss_tabid'
}

const NEWS_STATE_TYPES = {                                   // 文档中心组件状态常量
    NEWS_TAB_DATA:'news_tab_data',
    NEWS_TAB_REFRESH:'news_tab_refresh',
    NEWS_TAB_TABID:'news_tab_tabid',
    CHANGE_NEWS_TABID:'change_news_tabid'
}

const REPORTFORM_STATE_TYPES = {                             // 图表元素组件状态常量
    REPORTFORM_TAB_DATA:'rss_tab_data',
    REPORTFORM_TAB_REFRESH:'rss_tab_refresh',
    REPORTFORM_TAB_TABID:'rss_tab_tabid',
    CHANGE_REPORTFORM_TABID:'change_rss_tabid'
}
const OUTDATA_STATE_TYPES = {                                // 外部数据元素组件状态常量
    OUTDATA_TAB_DATA:'outdata_tab_data',
    OUTDATA_TAB_REFRESH:'outdata_tab_refresh',
    OUTDATA_TAB_TABID:'outdata_tab_tabid',
    CHANGE_OUTDATA_TABID:'change_outdata_tabid'
}

const FORMMODECUSTOMSEARCH_STATE_TYPES = {                   // 建模查询中心组件状态常量
    FORMMODECUSTOMSEARCH_TAB_DATA:'formmodecustomsearch_tab_data',
    FORMMODECUSTOMSEARCH_TAB_REFRESH:'formmodecustomsearch_tab_refresh',
    FORMMODECUSTOMSEARCH_TAB_TABID:'formmodecustomsearch_tab_tabid',
    CHANGE_FORMMODECUSTOMSEARCH_TABID:'change_formmodecustomsearch_tabid'
}
const MAIL_STATE_TYPES = {                                   // 我的邮件组件状态常量
    MAIL_TAB_DATA:'mail_tab_data',
    MAIL_TAB_TABID:'mail_tab_tabid',
    CHANGE_MAIL_TABID:'change_mail_tabid'
}

const BLOGSTATUS_STATE_TYPES = {                             // 微博动态组件状态常量
    BLOGSTATUS_TAB_DATA:'blogstatus_tab_data',
    BLOGSTATUS_TAB_TABID:'blogstatus_tab_tabid',
    CHANGE_BLOGSTATUS_TABID:'change_blogstatus_tabid'
}

const CONTACTS_STATE_TYPES = {                               // 通讯录组件状态常量
    CONTACTS_TAB_DATA:'contacts_tab_data',
    CONTACTS_TAB_REFRESH:'contacts_tab_refresh',
    CONTACTS_TAB_TABID:'contacts_tab_tabid',
    CHANGE_CONTACTS_TABID:'change_contacts_tabid'
}


const ADDWF_STATE_TYPES = {                                  // 新建流程组件状态常量
    ADDWF_TAB_DATA:'addwf_tab_data',
    ADDWF_TAB_REFRESH:'addwf_tab_refresh',
    ADDWF_TAB_TABID:'addwf_tab_tabid',
    CHANGE_ADDWF_TABID:'change_addwf_tabid'
}

const TASK_STATE_TYPES = {                                   // 任务元素组件状态常量
    TASK_TAB_DATA:'task_tab_data',
    TASK_TAB_REFRESH:'task_tab_refresh',
    TASK_TAB_TABID:'task_tab_tabid',
    CHANGE_TASK_TABID:'change_task_tabid'
}

const ELEMENT_URLS = {
    WORKFLOW_URL: '/api/portal/element/workflow',                                  // 流程元素初始化加载或刷新时请求url
    WORKFLOW_TAB_URL: '/api/portal/element/workflowtab',                           // 流程元素点击tab时请求url
    CUSTOMPAGE_URL: '/api/portal/element/custompage',                              // 自定义页面初始化加载或刷新时请求url
    CUSTOMPAGE_TAB_URL: '/api/portal/element/custompagetab',                       // 自定义页面点击tab时请求url
    MYCALENDAR_URL: '/api/portal/element/mycalendar',                              // 日历日程初始化加载或刷新时请求url
    RSS_URL: '/api/portal/element/rss',                                            // RSS阅读器初始化加载或刷新时请求url
    RSS_TAB_URL: '/api/portal/element/rsstab',                                     // RSS阅读器点击tab时请求url
    NEWS_URL: '/api/portal/element/news',                                          // 文档中心初始化加载或刷新时请求url
    NEWS_TAB_URL: '/api/portal/element/newstab',                                   // 文档中心点击tab时请求url
    REPORTFORM_URL: '/api/portal/element/reportform',                              // 图表元素初始化加载或刷新时请求url
    REPORTFORM_TAB_URL: '/api/portal/element/reportformtab',                       // 图表元素点击tab时请求url
    OUTDATA_URL: '/api/portal/element/outdata',                                    // 外部数据元素初始化加载或刷新时请求url
    OUTDATA_TAB_URL: '/api/portal/element/outdatatab',                             // 外部数据元素点击tab时请求url
    FORMMODECUSTOMSEARCH_URL: '/api/portal/element/formmodecustomsearch',          // 建模查询中心元素初始化加载或刷新时请求url
    FORMMODECUSTOMSEARCH_TAB_URL: '/api/portal/element/formmodecustomsearchtab',   // 建模查询中心元素点击tab时请求url
    VIEW_URL: '/api/portal/element/view',                                          // 以view.jsp显示的元素初始化加载或刷新时请求url
    PICTURE_URL: '/api/portal/element/picture',                                    // 图片元素初始化加载或刷新时请求url
    MORENEWS_URL: '/api/portal/element/morenews',                                  // 多新闻中心初始化加载或刷新时请求url
    STOCK_URL: '/api/portal/element/stock',                                        // 股票元素初始化加载或刷新时请求url
    MAGAZINE_URL: '/api/portal/element/magazine',                                  // 期刊元素初始化加载或刷新时请求url
    DOCCONTENT_URL: '/api/portal/element/doccontent',                              // 文档内容初始化加载或刷新时请求url
    AUDIO_URL: '/api/portal/element/audio',                                        // 音频元素初始化加载或刷新时请求url
    FAVOURITE_URL: '/api/portal/element/favourite',                                // 收藏元素初始化加载或刷新时请求url
    FLASH_URL: '/api/portal/element/flash',                                        // flash元素初始化加载或刷新时请求url
    IMGSLIDE_URL: '/api/portal/element/imgslide',                                  // 多图元素初始化加载或刷新时请求url
    DATACENTER_URL: '/api/portal/element/datacenter',                              // 个人数据初始化加载或刷新时请求url
    VIDEO_URL: '/api/portal/element/video',                                        // 视频元素初始化加载或刷新时请求url
    WEATHER_URL: '/api/portal/element/weather',                                    // 天气元素初始化加载或刷新时请求url
    OUTTERSYS_URL: '/api/portal/element/outtersys',                                // 集成登录初始化加载或刷新时请求url
    SCRATCHPAD_URL: '/api/portal/element/scratchpad',                              // 标签元素初始化加载或刷新时请求url
    SLIDE_URL: '/api/portal/element/slide',                                        // 幻灯片元素初始化加载或刷新时请求url
    JOBSINFO_URL: '/api/portal/element/jobsinfo',                                  // 多岗位查询初始化加载或刷新时请求url
    SEARCHENGINE_URL: '/api/portal/element/searchengine',                          // 搜索元素初始化加载或刷新时请求url
    CUSTOMMENU_URL: '/api/portal/element/custommenu',                              // 自定义菜单初始化加载或刷新时请求url
    NOTICE_URL: '/api/portal/element/notice',                                      // 公告栏元素初始化加载或刷新时请求url
    MAIL_URL: '/api/portal/element/mail',                                          // 我的邮件初始化加载或刷新时请求url
    BLOGSTATUS_URL: '/api/portal/element/blogstatus',                              // 微博动态初始化加载或刷新时请求url
    CONTACTS_URL: '/api/portal/element/contacts',                                  // 通讯录初始化加载或刷新时请求url
    CONTACTS_TAB_URL: '/api/portal/element/contactstab',                           // 通讯录点击tab时请求url
    ADDWF_URL: '/api/portal/element/addwf',                                        // 新建流程初始化加载或刷新时请求url
    ADDWF_TAB_URL: '/api/portal/element/addwftab',                                 // 新建流程点击tab时请求url
    TASK_URL: '/api/portal/element/task',                                          // 任务元素初始化加载或刷新时请求url
    TASK_TAB_URL: '/api/portal/element/tasktab',                                   // 任务元素点击tab时请求url
    NEWNOTICE_URL: '/api/portal/element/newnotice',                                // 最新公告初始化加载或刷新时请求url
    WORKTASK_URL: '/api/portal/element/worktask',                                  // 计划任务初始化加载或刷新时请求url  
    PLAN_URL: '/api/portal/element/plan',                                          // 计划报告元素初始化加载或刷新时请求url
    PLAN_TAB_URL: '/api/portal/element/plantab'                                    // 计划报告元素点击tab时请求url

}
const REQ_URLS = {
	WORKFLOW_MORE_SPA_URL: '/spa/workflow/index.jsp#/main/workflow/queryFlow?jsonstr=',    //流程more页面地址
    SIGN_VIEW_URL : '/api/workflow/request/requestLog',                                       //流程获取签字意见信息请求地址
    SCRATCHPAD_URL: "/api/portal/scratchpad/saveScratchpad",                        //标签元素内容保存请求地址
    ELEMENT_ISLOCK_URL:"/api/portal/elementtoolbar/lock",
    ELEMENT_UNLOCK_URL:"/api/portal/elementtoolbar/unlock",
    ELEMENT_DELETE_URL:"/api/portal/elementtoolbar/delete"
}

const SIGN_VIEW = 'sign_view';                                //流程签字意见列表组件
const SIGN_VIEW_IS_MORE = 'sign_view_is_more';                //流程签字意见更多信息
const SCRATCHPAD_TEXT = 'scratchpad_text';                    //便签元素

//元素类型统一管理
const ELEMENT_TYPES = {
    /** ---------- 可变tab元素 ---------- **/
    RSS: '1',                                       // RSS元素
    NEWS: '7',                                      // 文档元素
    WORKFLOW: '8',                                  // 流程元素
    CUSTOMPAGE: '29',                               // 自定义页面元素
    REPORTFORM: 'reportForm',                       // 图表元素
    OUTDATA: 'OutData',                             // 外部数据元素
    FORMMODECUSTOMSEARCH: 'FormModeCustomSearch',   // 建模查询中心元素

    /** ---------- 不可变tab元素 ---------- **/
    MAIL: '16',                                     // 我的邮件
    ADDWF: 'addwf',                                 // 新建流程
    TASK: 'Task',                                   // 任务元素
    BLOGSTATUS: 'blogStatus',                       // 微博元素
    CONTACTS: 'contacts',                           // 通讯录

    /** ---------- 以view.jsp页面显示的元素 ---------- **/
    UNREAD_DOCS: '6',                               // 未读文档
    MESSAGE_REMINDING: '9',                         // 消息提醒 
    MY_PROJECTS: '10',                              // 我的项目 
    NEW_CUSTOMERS: '11',                            // 最新客户 
    NEW_MEETING: '12',                              // 最新会议 
    UNREAD_COOPERATION: '13',                       // 未读协作  
    MONTH_TARGET: '14',                             // 当月目标 
    DAY_PLAN: '15',                                 // 当日计划
    SUBSCRIBE_KONWLEDG: '34',                       // 知识订阅

    /** ---------- 元素 ---------- **/
    MORE_NEWS: '17',                                // 多新闻中心
    MAGAZINE: '18',                                 // 期刊元素
    STOCK: '19',                                    // 股票元素
    DOC_CONTENT: '25',                              // 文档内容
    AUDIO: 'audio',                                 // 音频元素 
    FAVOURITE: 'favourite',                         // 收藏元素
    FLASH: 'Flash',                                 // Flash元素
    PICTURE: 'picture',                             // 图片元素
    MYCALENDAR: 'MyCalendar',                       // 日历日程
    IMGSLIDE: 'imgSlide',                           // 多图元素
    NEWNOTICE: 'newNotice',                         // 最新通告  
    OUTTERSYS: 'outterSys',                         // 集成登录
    SCRATCHPAD: 'scratchpad',                       // 便签元素
    WEATHER: 'weather',                             // 天气元素
    VIDEO: 'video',                                 // 视频元素 
    SLIDE: 'Slide',                                 // 幻灯片元素 
    DATACENTER: 'DataCenter',                       // 个人中心
    JOBSINFO: 'jobsinfo',                           // 多岗位办理事项
    SEARCHENGINE: 'searchengine',                   // 搜索元素
    NOTICE: 'notice',                               // 通告栏元素
    PLAN: 'plan',                                   // 计划元素
    CUSTOMMENU: 'menu',                             // 自定义菜单
    WORKTASK: '32'                                  // 任务计划
}

module.exports = {
    ELEMENT_STATE_TYPES,
    ELEMENT_TOOLBAR,
    WORKFLOW_STATE_TYPES,
    CUSTOMPAGE_STATE_TYPES,
    MYCALENDAR_STATE_TYPES,
    RSS_STATE_TYPES,
    NEWS_STATE_TYPES,
    REPORTFORM_STATE_TYPES,
    OUTDATA_STATE_TYPES,
    FORMMODECUSTOMSEARCH_STATE_TYPES,
    MAIL_STATE_TYPES,
    BLOGSTATUS_STATE_TYPES,
    CONTACTS_STATE_TYPES,
    ADDWF_STATE_TYPES,
    TASK_STATE_TYPES,
    ELEMENT_URLS,
    REQ_URLS,
    SIGN_VIEW,
    SIGN_VIEW_IS_MORE,
    SCRATCHPAD_TEXT,
    ELEMENT_TYPES
}
