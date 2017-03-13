export const PortalHrmCardActions = {
  HRMCARDA_LOAD_SETTING: "HRMCARDA_LOAD_SETTING", //加载人力资源卡片设置
  HRMCARDA_SET_CURRENTDATA: "hrmcarda_set_currentdata", //更改卡片为新的显示
  HRMCARDA_CHANGE_VISIBLE: "hrmcarda_change_visible", //卡片显示状态
  HRMCARDA_LOAD_USERINFO: "hrmcarda_load_userinfo", //加载用户数据
  HRMCARDA_USERIMG_LOADED: "hrmcarda_userimg_loaded", //用户头像记载完毕
}

export const LoginActions = {
  LOGIN_PRELOAD: "login_preload", //页面设置
  LOGIN_HRMSETTING: "login_hrmsetting", //人力资源设置，验证码、动态口令设置
  LOGIN_SETBGSRC: "login_setbgsrc", //设置背景图片
  LOGIN_FORM_VISIBLE: "login_form_visible", //切换二维码跟form页面
  LOGIN_USER_CHECKED: "login_user_checked", //记住用户名选中切换
  LOGIN_PWD_CHECKED: "login_pwd_checked", //记住密码选中切换
  LOGIN_CHECK_DYNPWD: "login_check_dynpwd", //用户名对应动态口令检查
  LOGIN_SETWRONGTIMES: "login_setwrongtimes", //记录用户输入错误次数
  LOGIN_CHANGEVALCODE: "login_changevalcode", //用户刷新验证码
  LOGIN_SETBTNSTATE: "login_setbtnstate", //登录按钮状态切换

  LOGIN_MLSELECTVISIBLE: "login_mlselectvisible", //多语言选择框
  LOGIN_MLSELECTDATA: "login_mlselectdata", //多语言选择数据

  LOGIN_BGSELECTER_VISIBLE: "login_bgselecter_visible", //背景图片选择框显示
  LOGIN_BGSELECTER_LEFT: "login_bgselecter_left", //背景图片选择框距左位置
}

export const PortalHeadActions = {
  HEAD_FREQUSE_MENU: "head_frequse_menu", //加载常用菜单
  HEAD_ACCOUNTINFO: "head_accountinfo", //当前登录人员信息
  HEAD_QUICKSEARCH_MENU: "head_quicksearch_menu", //快捷搜索菜单
  HEAD_TOP_MENU: "head_top_menu", //顶部菜单
  HEAD_TOOLBAR_ITEM: "head_toolbar_item", //右上角工具栏按钮
  HEAD_TOOLBAR_MORE: "head_toolbar_more", //工具栏更多菜单
  HEAD_BIRTHINFO: "head_birthinfo", //生日提醒信息
  HEAD_BIRTH_VISIBLE: "head_birth_visible", //生日提醒是否可见
  HEAD_SYN_REMINDINFO: "head_syn_remindinfo", //同步提醒信息

  HEAD_GET_LOGO_SRC: "head_get_logo_src", //获取左上角logo
}

export const PortalHeadPopOverActions = {
  HEAD_TOPMENU_VISIBLE: "head_topmenu_visible", //顶部菜单下拉显示状态
  HEAD_FREQUSE_VISIBLE: "head_frequse_visible", //常用菜单下拉显示状态
  HEAD_QUICKSEARCH_VISIBLE: "head_quicksearch_visible", //快捷搜索下拉显示状态
  HEAD_TOOLBARMORE_VISIBLE: "head_toolbarmore_visible", //工具栏更多下拉显示状态
  HEAD_HRMINFO_VISIBLE: "head_hrminfo_visible", //账号信息下拉显示状态
  HEAD_REMINDINFO_VISIBLE: "head_remindinfo_visible", //提醒信息下拉显示状态
}

export const PortalHeadTopMenuActions = {
  HEAD_TOPMENU_SELNAME: "head_topmenu_selname", //选中的顶部菜单
}

export const PortalHeadQuickSearchActions = {
  HEAD_QUICKSEARCH_SETSELITEM: "head_quicksearch_setselitem", //快搜选择模块
}

// 门户左侧菜单
export const PORTAL_LEFT_MENU = {
  PORTAL_LEFT_MENU: "PORTAL_LEFT_MENU", // 左侧菜单
  PORTAL_LEFT_MENU_MODE: "PORTAL_LEFT_MENU_MODE", // 左侧菜单模式
  PORTAL_LEFT_MENU_SELECTED_MENU: "PORTAL_LEFT_MENU_SELECTED_MENU", // 左侧菜单选中的菜单
};

// 门户相关
export const INIT_HP_DATA = "init_hp_data"; //初始化门户配置信息
export const INIT_E_DATA = "init_e_data"; //初始化元素信息
export const REFRESH_E_DATA = "refresh_e_data"; //刷新元素数据
export const GET_E_TAB_DATA = "get_e_tab_data"; //获取默认tab页的数据
export const GET_E_CURRENT_TABID = "get_e_current_tabid"; //刷新元素tab页的数据
export const INIT_SPECIAL_E_DATA = "init_special_e_data"; //初始化特殊元素信息(包含：通讯录，微博动态，我的邮件三个元素)
export const CHANGE_E_TABID = "change_e_tabid"; //切换元素tab更新tabid
export const INIT_CONTACTS_DATA = "init_contacts_data"; //初始化通讯录元素信息
export const INIT_SCRATCHPAD_TEXT = "init_scratchpad_text"; //初始化便签元素信息
export const INIT_CUSTOMPAGE_VISIBLE = "init_custompage_visible"; //自定义页面元素信息
export const GET_MYCALENDAR_DATA = "get_mycalendar_data"; //日历日程元素信息

//元素类型统一管理
export const ELEMENT_TYPES = {
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