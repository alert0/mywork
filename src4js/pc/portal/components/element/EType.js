import { Table } from 'antd';
//元素组件
import { WorkFlow, News, Picture, Stock, AddWf, Slide, ReportForm, OutterSys, Audio, SearchEngine, DataCenter, NewNotice, Video, Weather, Flash, MoreNews, Magazine, Notice, Plan, CustomMenu, ImgSlide, Task, FormModeCustomSearch, Scratchpad, CustomPage, MyCalendar } from './etypes/';

import { ELEMENT_TYPES } from '../../constants/ActionTypes';

const { RSS, NEWS, WORKFLOW, CUSTOMPAGE, REPORTFORM, OUTDATA, FORMMODECUSTOMSEARCH, MAIL, ADDWF, TASK, BLOGSTATUS, CONTACTS, UNREAD_DOCS, MESSAGE_REMINDING, MY_PROJECTS, NEW_CUSTOMERS, NEW_MEETING, UNREAD_COOPERATION, MONTH_TARGET, DAY_PLAN, SUBSCRIBE_KONWLEDG, MORE_NEWS, MAGEZINE, STOCK, DOC_CONTENT, AUDIO, FAVOURITE, FLASH, PICTURE, MYCALENDAR, IMGSLIDE, NEWNOTICE, OUTTERSYS, SCRATCHPAD, WEATHER, VIDEO, SLIDE, DATACENTER, JOBSINFO, SEARCHENGINE, NOTICE, PLAN, MENU, WORKTASK } = ELEMENT_TYPES;

import { formatData } from '../../util/formatdata';

class EType extends React.Component {
    render() {
        let EleType = null;
        const eid = this.props.eid;
        const ebaseid = this.props.ebaseid;
        const data = this.props.data;
        const currenttab = this.props.currenttab;
        const esetting = this.props.esetting;
        if (ebaseid === NEWNOTICE) ////公告元素
            return <div className = "tabContant"
        id = { `tabcontant_${eid}` }><NewNotice eid = { eid }
        data = { data }
        esetting = { esetting }
        /></div>
        if (ebaseid === PICTURE) ////公告元素
            return <Picture eid = { eid }
        data = { data }
        esetting = { esetting }
        />
        if (!_isEmpty(data)) {
            //后台获取数据集合
            let list = new Array;
            if (data.constructor === Array) {
                list = data;
            } else {
                if (data.data !== undefined && data.data.constructor === Array) {
                    list = data.data;
                }
            }
            switch (ebaseid) {
                case UNREAD_DOCS: //未读文档
                case MESSAGE_REMINDING: //消息提醒
                case MY_PROJECTS: //我的项目
                case NEW_CUSTOMERS: //最新客户
                case NEW_MEETING: //最新会议
                case UNREAD_COOPERATION: //未读协作
                case MONTH_TARGET: //当月目标
                case DAY_PLAN: //当日计划
                case SUBSCRIBE_KONWLEDG: //知识订阅
                case JOBSINFO: //多岗位办理事项
                case FAVOURITE: // 收藏元素
                case WORKTASK: // 计划任务
                case RSS: //RSS阅读器
                case OUTDATA: //外部数据元素
                    if (list.length !== 0)
                        EleType = <Table columns = { formatData(list[0], esetting) }
                    showHeader = { false }
                    pagination = { false }
                    dataSource = { list }
                    size = "small" />
                        break;
                case NEWS: //文档中心
                    EleType = <News eid = { eid }
                    data = { data }
                    esetting = { esetting }
                    />
                    break;
                case WORKFLOW: //流程中心
                    EleType = <WorkFlow eid = { eid }
                    data = { data }
                    esetting = { esetting }
                    />
                    break;
                case ADDWF: //新建流程
                    EleType = <AddWf data = { data }
                    esetting = { esetting }
                    />
                    break;
                case TASK: //任务元素
                    return <Task data = { data }
                    esetting = { esetting }
                    />
                    break;
                case MORE_NEWS: //多新闻中心
                    EleType = <MoreNews data = { data }
                    esetting = { esetting }
                    />;
                    break;
                case FORMMODECUSTOMSEARCH:
                    EleType = <FormModeCustomSearch eid = { eid }
                    data = { data }
                    esetting = { esetting }
                    />
                    break;
                case MAGEZINE: //期刊中心
                    EleType = <Magazine data = { data }
                    esetting = { esetting }
                    />;
                    break;
                case STOCK: //股票元素
                    EleType = <Stock data = { data }
                    esetting = { esetting }
                    />;
                    break;
                case DOC_CONTENT: //文档内容
                    EleType = <div id = "__content__"
                    dangerouslySetInnerHTML = {
                        { __html: data }
                    }></div>
                    break;
                case CUSTOMPAGE: //自定义页面
                    EleType = <CustomPage data = { data }
                    eid = { eid }
                    currenttab = { currenttab }
                    />;
                    break;
                case SLIDE: // 幻灯片
                    EleType = <Slide eid = { eid }
                    data = { data }
                    esetting = { esetting }
                    />
                    break;
                case REPORTFORM: //图表元素
                    EleType = <ReportForm data = { data }
                    eid = { eid }
                    />
                    break;
                case OUTTERSYS: //集成登录
                    EleType = <OutterSys data = { data }
                    esetting = { esetting }
                    />
                    break;
                case AUDIO: //音频元素
                    EleType = <Audio data = { data }
                    eid = { eid }
                    esetting = { esetting }
                    />
                    break;
                case SEARCHENGINE: // 搜索元素
                    EleType = <SearchEngine data = { data }
                    eid = { eid }
                    />
                    break;
                case DATACENTER: //个人数据
                    EleType = <DataCenter data = { data }
                    esetting = { esetting }
                    eid = { eid }
                    />
                    break;
                case MYCALENDAR: //日历日程
                    EleType = <MyCalendar data = { data }
                    eid = { eid }
                    userid = { esetting.userid }
                    />
                    break;
                case VIDEO: //视频元素
                    EleType = <Video data = { data }
                    eid = { eid }
                    />
                    break;
                case WEATHER: //天气元素
                    EleType = <Weather data = { data }
                    esetting = { esetting }
                    eid = { eid }
                    />
                    break;
                case SCRATCHPAD: //便签元素
                    EleType = <Scratchpad data = { data }
                    eid = { eid }
                    />
                    break;
                case FLASH:
                    EleType = <Flash data = { data }
                    eid = { eid }
                    />
                    break;
                case NOTICE:
                    EleType = <Notice data = { data }
                    eid = { eid }
                    />
                    break;
                case PLAN: // 计划任务
                    EleType = <Plan data = { data }
                    eid = { eid }
                    />
                    break;
                case MENU:
                    EleType = <CustomMenu data = { data }
                    eid = { eid }
                    esetting = { esetting }
                    />
                    break;
                case IMGSLIDE:
                    EleType = <ImgSlide data = { data }
                    eid = { eid }
                    />
                    break;
                default:
                    break;
            }
        }
        return ( <div>{ EleType }</div>)
    }
}

import { WeaErrorPage, WeaTools } from 'weaCom';
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
        return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" }
            />
        );
    }
}
EType = WeaTools.tryCatch(React, MyErrorHandler, { error: ""  })(EType);
export default EType;
