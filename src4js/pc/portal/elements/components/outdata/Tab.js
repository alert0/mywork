import { Spin } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as EContentAction from '../../actions/outdata/tab';
import TitleContainer from './Title';
import { Table } from 'antd';
import Immutable from 'immutable';
import { formatData } from '../../util/formatdata';
//内容组件
class EContent extends React.Component {
    shouldComponentUpdate(nextProps){
        const { config, data, refresh, tabid, edata } = this.props;
        return !Immutable.is(config,nextProps.config) || !Immutable.is(data,nextProps.data) || refresh !== nextProps.refresh || tabid !== nextProps.tabid || !Immutable.is(edata,nextProps.edata)
    }
    render() {
        let contentHtml = <div width = "100%"></div>;
        const { config, data, refresh, tabid, edata, actions, handleRefresh } = this.props;
        const { tabids, titles, esetting, params } = edata.toJSON();
        const { eid } = params;
        params['tabid'] = tabid;
        let tabdata = data.toJSON();
        if (!_isEmpty(tabdata)) {
            const list = tabdata.data;
            if(list.length > 0)
              contentHtml =  <Table columns = {formatData(list[0], esetting)} showHeader={false} pagination={false} dataSource={list} size="small"/>
        }
        if(refresh) contentHtml = <Spin>{ contentHtml }</Spin>
        return <div>
            <TitleContainer params={params} config={config} titles={titles} tabids={tabids} handleRefresh={handleRefresh}/>
            <div className = "tabContant" id = { `tabcontant_${eid}` } >
            { contentHtml }
            </div>
         </div>;
    }
}


import { WeaErrorPage, WeaTools } from 'ecCom';
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
            return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" }/>
        );
    }
}
EContent = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(EContent);
const mapStateToProps = state => {
    const { eoutdatatab } = state;
    return ({
        data: eoutdatatab.get("data"),
        tabid: eoutdatatab.get("tabid"),
        refresh: eoutdatatab.get("refresh")
    })
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(EContentAction, dispatch) }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    const { data, config } = ownProps;
    const { eid } = config.item;
    const tabid = stateProps.tabid.get(eid) || data.currenttab;
    const key = eid + "-" + tabid;
    const { currenttab } = data;
    let initdata = currenttab == tabid ? data.data : {};
    return {
        data: stateProps.data.get(key) || Immutable.fromJS(ecLocalStorage.getObj("portal-" + window.global_hpid, "outdataimport { formatData } from '../util/formatdata';-tab-" + key, true) || initdata),
        tabid: tabid,
        refresh: stateProps.refresh.get(key) || false,
        config: ownProps.config,
        edata: Immutable.fromJS(data),
        handleRefresh: ownProps.handleRefresh,
        actions: dispatchProps.actions
    };
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EContent);