// 定义模块路由与模块菜单的映射
// pc/theme/constants/ModuleRouteMap.js
export const MODULE_ROUTE_MAP = {
    'portal':   {id: 0, name: '我的门户'},
    'workflow': {id: 1, name: '我的流程'},
    'document': {id: 2, name: '我的知识'},
    'meeting': {id: 6, name: '我的会议'},
    'report': {id: 110, name: '我的报表'},
    'blog': {id: 392, name: '我的微博'},
};

select * from LeftMenuInfo

//流程 ----- 待办 新建 已办 请求 查询 
update LeftMenuInfo set routeurl='/workflow/listDoing' where id = 13
update LeftMenuInfo set routeurl='/workflow/add' where id = 12
update LeftMenuInfo set routeurl='/workflow/listDone' where id = 90
update LeftMenuInfo set routeurl='/workflow/listMine' where id = 14
update LeftMenuInfo set routeurl='/workflow/queryFlow' where id = 15


//微博 ----- 我的微博 我的关注 微博报表 微博设置
update LeftMenuInfo set routeurl='/blog/myBlog' where id = 393
update LeftMenuInfo set routeurl='/blog/myAttention' where id = 394
update LeftMenuInfo set routeurl='/blog/report' where id = 395
update LeftMenuInfo set routeurl='/blog/setting' where id = 399

//会议 ----- 会议日历 会议室使用情况 查询会议 会议任务 会议报表 周期会议
update LeftMenuInfo set routeurl='/meeting/calView' where id = 573
update LeftMenuInfo set routeurl='/meeting/roomPlan' where id = 54
update LeftMenuInfo set routeurl='/meeting/search' where id = 55
update LeftMenuInfo set routeurl='/meeting/decision' where id = 575
//update LeftMenuInfo set routeurl='/meeting/report' where id = 574
update LeftMenuInfo set routeurl='/meeting/repeat' where id = 611

//知识 ----- 新建文档 我的文档 查询文档 文档目录 虚拟目录 最新文档 知识排名 文档订阅 批量共享 文档监控
//update LeftMenuInfo set routeurl='/document/add' where id = 16
update LeftMenuInfo set routeurl='/document/myDoc' where id = 17
update LeftMenuInfo set routeurl='/document/search' where id = 23
update LeftMenuInfo set routeurl='/document/directory' where id = 615
update LeftMenuInfo set routeurl='/document/dummy' where id = 218
update LeftMenuInfo set routeurl='/document/latest ' where id = 21
update LeftMenuInfo set routeurl='/document/rank' where id = 22
update LeftMenuInfo set routeurl='/document/subscription' where id = 83
update LeftMenuInfo set routeurl='/document/batchSharing' where id = 112
update LeftMenuInfo set routeurl='/document/monitor' where id = 102


select * from MainMenuInfo

//报表
update MainMenuInfo set routeurl='/report/fna/totalBudget' where id = 10172
