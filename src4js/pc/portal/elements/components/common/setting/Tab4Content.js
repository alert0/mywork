import React from 'react';

// RSS阅读器
import Content_1 from './content/Content_1';
// 文档中心
import Content_7 from './content/Content_7';
// 流程中心
import Content_8 from './content/Content_8';
// 最新客户
import Content_11 from './content/Content_11';
// 最新会议
import Content_12 from './content/Content_12';
// 未读文档
import Content_6 from './content/Content_6';
// 未读协作
import Content_13 from './content/Content_13';
// 当月目标
import Content_14 from './content/Content_14';
// 当日计划
import Content_15 from './content/Content_15';
// 我的邮件
import Content_16 from './content/Content_16';
// 消息提醒
import Content_9 from './content/Content_9';
// 我的项目
import Content_10 from './content/Content_10';
// 多新闻中心
import Content_17 from './content/Content_17';
// 期刊中心
import Content_18 from './content/Content_18';
// 股票元素
import Content_19 from './content/Content_19';
// 文档内容
import Content_25 from './content/Content_25';
// 自定义页面
import Content_29 from './content/Content_29';
// 计划任务
import Content_32 from './content/Content_32';
// 知识订阅
import Content_34 from './content/Content_34';
// 音频元素
import Content_audio from './content/Content_audio';
// 微博动态
import Content_blogStatus from './content/Content_blogStatus';
// 收藏元素
import Content_favourite from './content/Content_favourite';
// Flash元素
import Content_Flash from './content/Content_Flash';
// 自定义菜单
import Content_menu from './content/Content_menu';
// 公告栏元素
import Content_notice from './content/Content_notice';
// 图片元素
import Content_picture from './content/Content_picture';
// 图表元素
import Content_reportForm from './content/Content_reportForm';
// 搜索元素
import Content_searchengine from './content/Content_searchengine';
// 幻灯片
import Content_Slide from './content/Content_Slide';
// 视频元素
import Content_video from './content/Content_video';
// 天气元素
import Content_weather from './content/Content_weather';
// 便签元素
import Content_scratchpad from './content/Content_scratchpad';
// 个人数据
import Content_DataCenter from './content/Content_DataCenter';
// 日历日程
import Content_MyCalendar from './content/Content_MyCalendar';
// 任务元素
import Content_Task from './content/Content_Task';
// 计划报告元素
import Content_plan from './content/Content_plan';
// 多岗位办理事项
import Content_jobsinfo from './content/Content_jobsinfo';
// 集成登录
import Content_outterSys from './content/Content_outterSys';
// 通讯录
import Content_contacts from './content/Content_contacts';
// 新建流程
import Content_addwf from './content/Content_addwf';
// 多图元素
import Content_imgSlide from './content/Content_imgSlide';
// 公告元素
import Content_newNotice from './content/Content_newNotice';

export default class Tab4Content extends React.Component {
    render() {
        const thisProps = this.props;
        const {ebaseid} = thisProps.data;
        const props = {
            ...thisProps,
            formItemLayout: {
                labelCol: {span: 4},
                wrapperCol: {span: 20},
            }
        };

        let tab4Content = <div></div>;
        switch (ebaseid) {
            // RSS阅读器
            case '1':
                tab4Content = <Content_1 {...props}/>;
                break;
            // 文档中心
            case '7':
                tab4Content = <Content_7 {...props}/>;
                break;
            // 流程中心
            case '8':
                tab4Content = <Content_8 {...props}/>;
                break;
            // 最新客户
            case '11':
                tab4Content = <Content_11 {...props}/>;
                break;
            // 最新会议
            case '12':
                tab4Content = <Content_12 {...props}/>;
                break;
            // 未读文档
            case '6':
                tab4Content = <Content_6 {...props}/>;
                break;
            // 未读协作
            case '13':
                tab4Content = <Content_13 {...props}/>;
                break;
            // 当月目标
            case '14':
                tab4Content = <Content_14 {...props}/>;
                break;
            // 当日计划
            case '15':
                tab4Content = <Content_15 {...props}/>;
                break;
            // 我的邮件
            case '16':
                tab4Content = <Content_16 {...props}/>;
                break;
            // 消息提醒
            case '9':
                tab4Content = <Content_9 {...props}/>;
                break;
            // 我的项目
            case '10':
                tab4Content = <Content_10 {...props}/>;
                break;
            // 多新闻中心
            case '17':
                tab4Content = <Content_17 {...props}/>;
                break;
            // 期刊中心
            case '18':
                tab4Content = <Content_18 {...props}/>;
                break;
            // 股票元素
            case '19':
                tab4Content = <Content_19 {...props}/>;
                break;
            // 文档内容
            case '25':
                tab4Content = <Content_25 {...props}/>;
                break;
            // 自定义页面
            case '29':
                tab4Content = <Content_29 {...props}/>;
                break;
            // 计划任务
            case '32':
                tab4Content = <Content_32 {...props}/>;
                break;
            // 知识订阅
            case '34':
                tab4Content = <Content_34 {...props}/>;
                break;
            // 音频元素
            case 'audio':
                tab4Content = <Content_audio {...props}/>;
                break;
            // 微博动态
            case 'blogStatus':
                tab4Content = <Content_blogStatus {...props}/>;
                break;
            // 收藏元素
            case 'favourite':
                tab4Content = <Content_favourite {...props}/>;
                break;
            // Flash元素
            case 'Flash':
                tab4Content = <Content_Flash {...props}/>;
                break;
            // 自定义菜单
            case 'menu':
                tab4Content = <Content_menu {...props}/>;
                break;
            // 公告栏元素
            case 'notice':
                tab4Content = <Content_notice {...props}/>;
                break;
            // 图片元素
            case 'picture':
                tab4Content = <Content_picture {...props}/>;
                break;
            // 图片元素
            case 'reportForm':
                tab4Content = <Content_reportForm {...props}/>;
                break;
            // 搜索元素
            case 'searchengine':
                tab4Content = <Content_searchengine {...props}/>;
                break;
            // 幻灯片
            case 'Slide':
                tab4Content = <Content_Slide {...props}/>;
                break;
            // 视频元素
            case 'video':
                tab4Content = <Content_video {...props}/>;
                break;
            // 天气元素
            case 'weather':
                tab4Content = <Content_weather {...props}/>;
                break;
            // 便签元素
            case 'scratchpad':
                tab4Content = <Content_scratchpad {...props}/>;
                break;
            // 个人数据
            case 'DataCenter':
                tab4Content = <Content_DataCenter {...props}/>;
                break;
            // 日历日程
            case 'MyCalendar':
                tab4Content = <Content_MyCalendar {...props}/>;
                break;
            // 任务元素
            case 'Task':
                tab4Content = <Content_Task {...props}/>;
                break;
            // 计划报告元素
            case 'plan':
                tab4Content = <Content_plan {...props}/>;
                break;
            // 多岗位办理事项
            case 'jobsinfo':
                tab4Content = <Content_jobsinfo {...props}/>;
                break;
            // 集成登录
            case 'outterSys':
                tab4Content = <Content_outterSys {...props}/>;
                break;
            // 新建流程
            case 'addwf':
                tab4Content = <Content_addwf {...props}/>;
                break;
            // 通讯录
            case 'contacts':
                tab4Content = <Content_contacts {...props}/>;
                break;
            // 多图元素
            case 'imgSlide':
                tab4Content = <Content_imgSlide {...props}/>;
                break;
            // 公告元素
            case 'newNotice':
                tab4Content = <Content_newNotice {...props}/>;
                break;
            // 默认
            default:
                tab4Content = <div></div>;
        }

        return tab4Content;
    }
}