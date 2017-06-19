import { Spin } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MyCalendarAction from '../../actions/mycalendar/';
import Immutable from 'immutable';
import EHeader from '../common/EHeader';
import { NoRightCom } from '../Common';
import CalendarTemplate from './CalendarTemplate';
//元素组件
class MyCalendar extends React.Component {
    componentDidMount(){
        const { config, actions } = this.props;
        if(!_isEmpty(config.toJSON())){
            actions.initMyCalendarConfig(config.toJSON());
        }
    }
    shouldComponentUpdate(nextProps){
        const { config, data, refresh } = this.props;
        return !Immutable.is(config,nextProps.config) || !Immutable.is(data,nextProps.data) || refresh !== nextProps.refresh
    }
    render() {
        const { data, refresh, actions } = this.props;
        let config = this.props.config.toJSON();
        if(_isEmpty(config)) return <div></div>
        const { isHasRight, item } = config;
        const { eid, ebaseid, content, header, contentview } = item;
        const edata = data.toJSON();
        let EContentHtml = <div width = "100%"></div>;
        if(isHasRight === 'true'){
            if (!_isEmpty(edata)) {
                EContentHtml = <CalendarTemplate data={edata.data} eid={eid} userid={edata.esetting.userid}/>
            }
        }else{
            EContentHtml = <NoRightCom/>
        }
        if (refresh) {
            EContentHtml = <Spin>{ EContentHtml }</Spin>
        }
        return <div className = "item" style = {{marginTop: '10px'} } id = { `item_${eid}` } data-eid = { eid } data-ebaseid = { ebaseid } data-needRefresh = { item.needRefresh } data-cornerTop = { item.cornerTop } data-cornerTopRadian = { item.cornerTopRadian } data-cornerBottom = { item.cornerBottom } data-cornerBottomRadian = { item.cornerBottomRadian }>
            <EHeader config = {config} handleRefresh={actions.handleRefresh.bind(this)}/>
            <div className = "setting" id = { `setting_${eid}` }></div>
            <div className = "content" id = { `content_${eid}` } style = { { width: 'auto', _width: '100%' } }>
                <div className = "content_view" id = { `content_view_id_${eid}` } style = {contentview.style}>
                    {EContentHtml }
                </div>
                <div style = { { textAlign: 'right' }} id = { `footer_${eid}` }></div>
            </div>
            </div>;
    }
}
import { WeaErrorPage, WeaTools } from 'ecCom';

class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
            return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，流程元素加载异常，请联系管理员！" }/>
        );
    }
}
MyCalendar = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(MyCalendar);
const mapStateToProps = state => {
    const { elements } = state;
    return ({
        data: elements.get("data"),
        refresh: elements.get("refresh"),
        config: elements.get("config")
    })
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(MyCalendarAction, dispatch)
    }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    const { eid } = ownProps.config.item;
    let config = ownProps.config;
    const iconfig = stateProps.config.get(eid);
    if(iconfig !== undefined && _isEmpty(iconfig.toJSON())){
        config = {};
    }
    return {
        refresh: stateProps.refresh.get(eid) || false,
        data: stateProps.data.get(eid) || Immutable.fromJS({}),
        config: Immutable.fromJS(config),
        actions: dispatchProps.actions
    };
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MyCalendar);



