/**
 * 表单内容相关
 */
export const REQFORM_INIT_INFO = 'reqform_init_info'
export const REQFORM_SET_DETAILVALUE = 'reqform_set_detailvalue'
export const REQFORM_CLEAR_INFO = 'reqform_clear_info'
export const REQFORM_CHANGE_MAIN_VALUE = 'reqform_change_main_value'
export const REQFORM_CHANGE_DETAIL_VALUE = 'reqform_change_detail_value'
export const REQFORM_SET_FIELD_VARIABLE = 'reqform_set_field_variable'
export const REQFORM_CLEAR_FIELD_VARIABLE = 'reqform_clear_field_variable'


/**
 * 表单签字意见列表
 */
export const LOGLIST_SET_LOG_PARAMS = 'logList_set_log_params' //签字意见分页参数
export const LOGLIST_SET_MARK_INFO = 'logList_set_mark_info' //签字意见
export const LOGLIST_SET_LOGLIST_TABKEY = 'logList_set_loglist_tabkey' //签字意见tabkey
export const LOGLIST_IS_SHOW_USER_HEAD_IMG = 'logList_is_show_user_head_img' //设置是否显示签字意见操作者头像
export const LOGLIST_SAVE_SIGN_FIELDS = 'logList_save_sign_fields' //签字意见搜索表单内容
export const LOGLIST_SET_SHOW_SEARCHDROP = 'logList_set_show_searchdrop' //签字意见搜索表单显示
export const LOGLIST_UPDATE_SHOW_USER_LOGID = 'logList_update_show_user_logid' //更新需要显示全部人员的logid
export const LOGLIST_SET_REL_REQ_LOG_PARAMS = 'logList_set_rel_req_log_params' //设置相关流程签字意见加载参数
export const LOGLIST_SET_SCROLL_MARK_INFO = 'logList_set_scroll_mark_info' //设置滚动签字意见
export const LOGLIST_IS_LOADING_LOG = 'logList_is_loading_log' //正在加载滚动签字意见
export const LOGLIST_CLEAR_LOG_DATA ='logList_clear_log_data' //清除意见问题
export const LOGLIST_CLEAR_INFO ='logList_clear_info' 

/**
 * 表单
 */
export const REQ_INIT_PARAMS = 'req_init_params' //参数载入
export const REQ_CLEAR_INFO = 'req_clear_info'  //清除信息
export const FORM_LOADING = 'form_loading' //loading
export const SET_MARK_INPUT_INFO = 'set_mark_input_info' //签字意见输入框
export const SET_RIGHT_MENU_INFO = 'set_right_menu_info' //右键菜单
export const SET_WORKFLOW_STATUS = 'set_workflow_status' //流程状态
export const SET_RESOURCES_KEY = 'set_resources_key' //相关资源sessionkey
export const SET_HIDDEN_AREA = 'set_hidden_area' //设置隐藏域
export const SET_REQ_TABKEY = 'set_req_tabkey' //设置表单tabkey
export const REQ_IS_SUBMIT = 'req_is_submit' //表单已提交
export const REQ_IS_RELOAD = 'req_is_reload' //表单保存
export const CONTROLL_SIGN_INPUT ='control_sign_input' //签字意见框控制
export const INIT_SIGN_INPUT ='init_sign_input' //初始化签字意见框
export const SET_REQ_SUBMIT_ERROR_MSG_HTML = 'set_req_submit_error_msg_html' //设置提交精确提示信息
export const SET_SHOW_FORWARD ='set_show_forward' //是否点击转发按钮
export const SET_OPERATE_INFO ='set_operate_info' //变更提交信息
export const SET_SHOWBACK_TO_E8 ='set_showback_to_e8' //切回e8按钮
export const CLEAR_ALL = 'clear_all' //清除所有

/**
 * 列表公用
 */
export const LOADING = 'loading' //加载状态
export const INIT_DATAKEY = 'init_datakey' //获得查询key
export const INIT_BASE = 'init_base' //加载基本数据
export const INIT_COUNT = 'init_count' //加载数量数据
export const INIT_TOPTABCOUNT = 'init_toptabcount' //更新数字
export const SET_SELECTED_TREEKEYS = 'set_selected_treekeys' //设置树选中
export const SAVE_ORDER_FIELDS = 'save_order_fields' //高级搜所表单
export const CLEAR_LEFTTREE = 'clear_lefttree' //清除左侧树
export const SET_SHOW_SEARCHAD = 'set_show_searchad' //高级搜索受控
export const UNMOUNT_CLEAR = 'unmount_clear' //组件卸载需要清除的数据
export const CLEAR_PAGE_STATUS = 'clear_page_status' //是否需要清除页面状态

/**
 * 待办事宜
 */
export const LISTDOING_LOADING = 'listDoing_loading' //加载状态
export const SET_NOW_ROUTER_PATH = 'set_now_router_path' //获得查询key
export const LISTDOING_INIT_DATAKEY = 'listDoing_init_datakey' //获得查询key
export const LISTDOING_INIT_BASE = 'listDoing_init_base' //加载基本数据
export const LISTDOING_INIT_COUNT = 'listDoing_init_count' //加载数量数据
export const LISTDOING_INIT_TOPTABCOUNT = 'listDoing_init_toptabcount' //更新数字
export const LISTDOING_SET_SELECTED_TREEKEYS = 'listDoing_set_selected_treekeys' //设置树选中
export const LISTDOING_SAVE_ORDER_FIELDS = 'listDoing_save_order_fields' //高级搜所表单
export const LISTDOING_CLEAR_LEFTTREE = 'listDoing_clear_lefttree' //清除左侧树
export const LISTDOING_SET_SHOW_SEARCHAD = 'listDoing_set_show_searchad' //高级搜索受控
export const LISTDOING_SET_SHOW_BATCHSUBMIT = 'listDoing_set_show_batchsubmit'  //批量提交
export const LISTDOING_OPER_PHRASES = 'listDoing_oper_phrases'    //批量提交流程短语
export const LISTDOING_UNMOUNT_CLEAR = 'listDoing_unmount_clear' //组件卸载需要清除的数据
export const LISTDOING_CLEAR_PAGE_STATUS = 'listDoing_clear_page_status' //是否需要清除页面状态

/**
 * 已办
 */
export const LISTDONE_LOADING = 'listDone_loading' //加载状态
export const LISTDONE_INIT_DATAKEY = 'listDone_init_datakey' //获得查询key
export const LISTDONE_INIT_BASE = 'listDone_init_base' //加载基本数据
export const LISTDONE_INIT_COUNT = 'listDone_init_count' //加载数量数据
export const LISTDONE_INIT_TOPTABCOUNT = 'listDone_init_toptabcount' //更新数字
export const LISTDONE_SET_SELECTED_TREEKEYS = 'listDone_set_selected_treekeys' //设置树选中
export const LISTDONE_SAVE_ORDER_FIELDS = 'listDone_save_order_fields' //高级搜所表单
export const LISTDONE_CLEAR_LEFTTREE = 'listDone_clear_lefttree' //清除左侧树
export const LISTDONE_SET_SHOW_SEARCHAD = 'listDone_set_show_searchad' //高级搜索受控
export const LISTDONE_UNMOUNT_CLEAR = 'listDone_unmount_clear' //组件卸载需要清除的数据
export const LISTDONE_CLEAR_PAGE_STATUS = 'listDone_clear_page_status' //是否需要清除页面状态

/**
 * 我的请求
 */
export const LISTMINE_LOADING = 'listMine_loading' //加载状态
export const LISTMINE_INIT_DATAKEY = 'listMine_init_datakey' //获得查询key
export const LISTMINE_INIT_BASE = 'listMine_init_base' //加载基本数据
export const LISTMINE_INIT_COUNT = 'listMine_init_count' //加载数量数据
export const LISTMINE_INIT_TOPTABCOUNT = 'listMine_init_toptabcount' //更新数字
export const LISTMINE_SET_SELECTED_TREEKEYS = 'listMine_set_selected_treekeys' //设置树选中
export const LISTMINE_SAVE_ORDER_FIELDS = 'listMine_save_order_fields' //高级搜所表单
export const LISTMINE_CLEAR_LEFTTREE = 'listMine_clear_lefttree' //清除左侧树
export const LISTMINE_SET_SHOW_SEARCHAD = 'listMine_set_show_searchad' //高级搜索受控
export const LISTMINE_UNMOUNT_CLEAR = 'listMine_unmount_clear' //组件卸载需要清除的数据
export const LISTMINE_CLEAR_PAGE_STATUS = 'listMine_clear_page_status' //是否需要清除页面状态

/**
 * 新建流程
 */
export const SET_ADD_LOADING = 'set_add_loading' //loading
export const SET_TABKEY = 'set_tabkay' //tab切换
export const SET_MULITCOL = 'set_mulitcol' //列数切换
export const SET_ISABC = 'set_isabc' //字母排列
export const SET_SEARCH_VALUE = 'set_search_value' //流程搜索
export const SET_WFTYPES = 'set_wftypes' //获取数据
export const SET_TYPES_SHOW = 'set_types_show' //单列显示数据
export const SET_TYPES_COLS = 'set_wftypes_cols' //多列显示数据
export const SET_TYPES_ABC = 'set_wftypes_abc' //字母排列数据
export const SET_USED_BEANS = 'set_used_beans' //常用数据
export const SET_COMMONUSE ='set_commonuse' //设置
export const SET_IMPORT_DATA = 'set_import_data' //设置导入流程列表
export const SET_IMPORT_SEARCH_VALUE = 'set_import_search_value' //设置导入流程搜索值
export const SET_IMPORT_DATA_SHOW = 'set_import_data_show' //设置流程导入列表值
export const SET_ABC_SELECTED = 'set_abc_selected' //设置abc按钮选中
export const SET_SHOW_BEAGENTERS = 'set_show_beagenters'    //设置展示代理身份创建区域
export const SET_SHOW_IMPORTWF = 'set_show_importwf'        //设置展示流程导入区域


/**
 * 查询流程
 */
export const QUERY_FLOW_INIT_BASE = 'query_flow_init_base' //加载基本数据
export const QUERY_FLOW_SAVE_FIELDS = 'query_flow_save_fields' //查询流程表单
export const QUERY_FLOW_SEARCH_RESULT = 'query_flow_search_result' //查询流程查询结果
export const QUERY_FLOW_LOADING = 'query_flow_loading' //加载状态
export const QUERY_FLOW_UPDATE_DISPLAY_TABLE = 'query_flow_update_display_table' //重置数据
export const QUERY_FLOW_SET_SHOW_SEARCHAD = 'query_flow_set_show_searchad' //高级搜索受控
export const QUERY_FLOW_INIT_TREE = 'query_flow_init_tree' //初始化树
export const QUERY_FLOW_SET_SEARCH_PARAMS = 'query_flow_set_search_params' //树搜索条件
export const QUERY_FLOW_SET_SELECTED_TREEKEYS = 'query_flow_set_selected_treekeys' //树选中


