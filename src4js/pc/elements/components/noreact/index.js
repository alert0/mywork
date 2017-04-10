import { Spin, Table } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NoReactAction from '../../actions/noreact/';
import Immutable from 'immutable';
import EHeader from '../common/EHeader';
import { NoRightCom } from '../Common';
//元素组件
class NoReact extends React.Component {
    componentDidMount(){
        const { data, actions } = this.props;
        let config = this.props.config.toJSON();
        const { eid, ebaseid } = config.item;
        actions.initNoReactConfig(config);
    }
    shouldComponentUpdate(nextProps){
        const { config, refresh } = this.props;
        return !Immutable.is(config,nextProps.config) || refresh !== nextProps.refresh
    }
    componentDidUpdate(prevProps) {
        const { config, data, actions } = this.props;
        if(!Immutable.is(prevProps.config,config)){
            const { eid, ebaseid } = config.toJSON().item;
            actions.initNoReactConfig(config);  
        }
    }
    render() {
        const { data, refresh, actions } = this.props;
        let config = this.props.config.toJSON();
        const { isHasRight, item } = config;
        const { eid, ebaseid, content, header, contentview } = item;
        let EContentHtml = <div width = "100%"></div>;
        if(isHasRight === 'true'){
            EContentHtml = <div id={"no_react_element_" + eid}></div>
        }else{
            EContentHtml = <NoRightCom/>
        }
        if (refresh) EContentHtml = <Spin>{ EContentHtml }</Spin>
        return <div className = "item" style = { { marginTop: '10px' } } id = { `item_${eid}` } data-eid = { eid } data-ebaseid = { ebaseid } data-needRefresh = { item.needRefresh } data-cornerTop = { item.cornerTop } data-cornerTopRadian = { item.cornerTopRadian } data-cornerBottom = { item.cornerBottom } data-cornerBottomRadian = { item.cornerBottomRadian }>
            <EHeader config = {config} handleRefresh={actions.handleRefresh.bind(this)}/>
            <div className = "content" id = { `content_${eid}` } style = { { width: 'auto', _width: '100%' } }>
                <div className = "content_view" id = { `content_view_id_${eid}` } style={contentview.style}>
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
NoReact = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(NoReact);
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
        actions: bindActionCreators(NoReactAction, dispatch)
    }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    const { eid } = ownProps.config.item;
    return {
        refresh: stateProps.refresh.get(eid) || false,
        data: stateProps.data.get(eid),
        config: stateProps.config.get(eid) || Immutable.fromJS(ownProps.config),
        actions: dispatchProps.actions
    };
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(NoReact);



