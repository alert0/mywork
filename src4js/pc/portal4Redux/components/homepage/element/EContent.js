import {
  Component
} from 'react';
import {
  Table,
  Spin
} from 'antd';


//元素组件
import {
  WorkFlow, // 流程中心
  News, // 文档中心
  Picture, // 图片元素
  Stock, // 股票元素
  AddWf, // 新建流程
  Slide, // 幻灯片
  ReportForm, // 图表元素
  OutterSys, // 集成登录
  Audio, // 音频元素
  SearchEngine, // 搜索元素
  DataCenter, // 个人数据
  NewNotice, // 公告元素
  Video, // 视频元素
  Weather, // 天气元素
  Flash, // Flash元素
  MoreNews, // 多新闻中心
  Magazine, // 期刊中心
  Notice, // 公告栏元素
  Plan, // 计划报告元素
  CustomMenu, // 自定义菜单元素
  ImgSlide, // 多图元素
  Task, // 任务元素
  FormModeCustomSearch // 建模查询中心
} from './ETypes';
import TitleContainer from './TitleContainer';
import Scratchpad from './Scratchpad'; // 标签元素
import CustomPage from './CustomPage'; // 自定义页面
import MyCalendar from './MyCalendar'; // 日历日程

import {
  formatData
} from '../../../util/formatdata';

import {
  ELEMENT_TYPES
} from '../../../constants/ActionTypes';
const {
  RSS, // RSS元素
  NEWS, // 文档元素
  WORKFLOW, // 流程元素
  CUSTOMPAGE, // 自定义页面元素
  REPORTFORM, // 图表元素
  OUTDATA, // 外部数据元素
  FORMMODECUSTOMSEARCH, // 建模查询中心元素

  MAIL, // 我的邮件
  ADDWF, // 新建流程
  TASK, // 任务元素
  BLOGSTATUS, // 微博元素
  CONTACTS, // 通讯录

  UNREAD_DOCS, // 未读文档
  MESSAGE_REMINDING, // 消息提醒 
  MY_PROJECTS, // 我的项目 
  NEW_CUSTOMERS, // 最新客户 
  NEW_MEETING, // 最新会议 
  UNREAD_COOPERATION, // 未读协作  
  MONTH_TARGET, // 当月目标 
  DAY_PLAN, // 当日计划
  SUBSCRIBE_KONWLEDG, // 知识订阅

  MORE_NEWS, // 多新闻中心
  MAGEZINE, // 期刊元素
  STOCK, // 股票元素
  DOC_CONTENT, // 文档内容
  AUDIO, // 音频元素 
  FAVOURITE, // 收藏元素
  FLASH, // Flash元素
  PICTURE, // 图片元素
  MYCALENDAR, // 日历日程
  IMGSLIDE, // 多图元素
  NEWNOTICE, // 最新通告  
  OUTTERSYS, // 集成登录
  SCRATCHPAD, // 便签元素
  WEATHER, // 天气元素
  VIDEO, // 视频元素 
  SLIDE, // 幻灯片元素 
  DATACENTER, // 个人中心
  JOBSINFO, // 多岗位办理事项
  SEARCHENGINE, // 搜索元素
  NOTICE, // 通告栏元素
  PLAN, // 计划元素
  MENU, // 菜单元素
  WORKTASK // 任务计划
} = ELEMENT_TYPES;
import {
  bindActionCreators
} from 'redux'
import {
  connect
} from 'react-redux'
import * as EContentAction from '../../../actions/homepage/econtent';

import ecLocalStorage from '../../../util/ecLocalStorage.js';

//内容组件
class EContent extends Component {
  constructor(props) {
    super(props)
    const {
      eid,
      data,
      actions
    } = props;
    let currenttab = data.currenttab ? data.currenttab : data.tabids[0];
    actions.initETabDatas(eid, currenttab, data.data);
  }
  componentWillUpdate(nextProps) {
    const {
      eid,
      data,
      actions
    } = nextProps;
    if (JSON.stringify(data.data) !== JSON.stringify(this.props.data.data)) {
      let currenttab = data.currenttab ? data.currenttab : data.tabids[0];
      actions.initETabDatas(eid, currenttab, data.data);
    }
  }
  render() {
    let contentHtml = <div width="100%"></div>;
    const {
      eid,
      toolbar,
      data,
      ebaseid,
      currtab,
      actions,
      ifClickCurrTab
    } = this.props;
    let tabdata = this.props.tabdata;
    if (tabdata) {
      tabdata = tabdata.toJSON();
    }
    const tabids = data.tabids;
    const titles = data.titles;
    let counts = new Array;
    if (WORKFLOW === ebaseid || TASK === ebaseid) {
      counts = data.counts;
    }
    let tabClass = ''
    if (!_isEmptyObject(tabdata)) {
      contentHtml = <EType eid={eid} ebaseid={ebaseid} data={tabdata} currenttab={currtab} esetting={data.esetting}/>
    }
    if (ifClickCurrTab && ebaseid !== CUSTOMPAGE) {
      contentHtml = <Spin>{contentHtml}</Spin>
    }
    return <div>
        <TitleContainer url={data.url} ebaseid={ebaseid} counts={counts}  toolbar={toolbar} currenttab={currtab} titles={titles} tabids={tabids} eid={eid}/>
        <div className="tabContant" id={`tabcontant_${eid}`}>{contentHtml}</div>
    </div>;
  }
}

const mapStateToProps = state => {
  const {
    econtent
  } = state;
  return ({
    currtab: econtent.get("currtab"),
    ifClickCurrTab: econtent.get("ifClickCurrTab"),
    tabdata: econtent.get("tabdata")
  })
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(EContentAction, dispatch)
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    currtab: stateProps.currtab.get(ownProps.eid),
    ifClickCurrTab: stateProps.ifClickCurrTab.get(ownProps.eid),
    tabdata: stateProps.tabdata.get(ownProps.eid),
    data: ownProps.data,
    ebaseid: ownProps.ebaseid,
    eid: ownProps.eid,
    toolbar: ownProps.toolbar,
    actions: dispatchProps.actions
  };
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EContent);

export class EType extends Component {
  render() {
    let EleType = null;
    const eid = this.props.eid;
    const ebaseid = this.props.ebaseid;
    const data = this.props.data;
    const currenttab = this.props.currenttab;
    const esetting = this.props.esetting;
    if (ebaseid === NEWNOTICE) ////公告元素
      return <div className="tabContant" id={`tabcontant_${eid}`}><NewNotice eid={eid} data={data} esetting={esetting}/></div>
    if (ebaseid === PICTURE) ////公告元素
      return <Picture eid={eid} data={data} esetting={esetting}/>

    if (!_isEmptyObject(data)) {
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
            EleType = <Table columns={formatData(list[0], esetting)} showHeader={false} pagination={false} dataSource={list} size="small" />
          break;
        case NEWS: //文档中心
          EleType = <News eid={eid} data={data} esetting={esetting}/>
          break;
        case WORKFLOW: //流程中心
          EleType = <WorkFlow eid={eid} data={data} esetting={esetting}/>
          break;
        case ADDWF: //新建流程
          EleType = <AddWf data={data} esetting={esetting}/>
          break;
        case TASK: //任务元素
          return <Task data={data} esetting={esetting}/>
          break;
        case MORE_NEWS: //多新闻中心
          EleType = <MoreNews data={data} esetting={esetting}/>;
          break;
        case FORMMODECUSTOMSEARCH:
          EleType = <FormModeCustomSearch eid={eid} data={data} esetting={esetting}/>
          break;
        case MAGEZINE: //期刊中心
          EleType = <Magazine data={data} esetting={esetting}/>;
          break;
        case STOCK: //股票元素
          EleType = <Stock data={data} esetting={esetting}/>;
          break;
        case DOC_CONTENT: //文档内容
          EleType = <div id="__content__" dangerouslySetInnerHTML={{__html: data}} ></div>
          break;
        case CUSTOMPAGE: //自定义页面
          EleType = <CustomPage data={data} eid={eid} currenttab={currenttab}/>;
          break;
        case SLIDE: // 幻灯片
          EleType = <Slide eid={eid} data={data} esetting={esetting}/>
          break;
        case REPORTFORM: //图表元素
          EleType = <ReportForm data={data} eid={eid}/>
          break;
        case OUTTERSYS: //集成登录
          EleType = <OutterSys data={data} esetting={esetting}/>
          break;
        case AUDIO: //音频元素
          EleType = <Audio data={data} eid={eid} esetting={esetting}/>
          break;
        case SEARCHENGINE: // 搜索元素
          EleType = <SearchEngine data={data} eid={eid}/>
          break;
        case DATACENTER: //个人数据
          EleType = <DataCenter data={data} esetting={esetting} eid={eid}/>
          break;
        case MYCALENDAR: //日历日程
          EleType = <MyCalendar data={data} eid={eid} userid={esetting.userid}/>
          break;
        case VIDEO: //视频元素
          EleType = <Video data={data} eid={eid}/>
          break;
        case WEATHER: //天气元素
          EleType = <Weather data={data} esetting={esetting} eid={eid}/>
          break;
        case SCRATCHPAD: //便签元素
          EleType = <Scratchpad data={data} eid={eid}/>
          break;
        case FLASH:
          EleType = <Flash data={data} eid={eid}/>
          break;
        case NOTICE:
          EleType = <Notice data={data} eid={eid}/>
          break;
        case PLAN: // 计划任务
          EleType = <Plan data={data} eid={eid}/>
          break;
        case MENU:
          EleType = <CustomMenu data={data} eid={eid} esetting={esetting}/>
          break;
        case IMGSLIDE:
          EleType = <ImgSlide data={data} eid={eid}/>
          break;
        default:
          break;
      }
    }
    return (<div>{EleType}</div>)
  }
}