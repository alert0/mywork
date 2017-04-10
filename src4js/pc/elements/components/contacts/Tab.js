import { Spin } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as EContentAction from '../../actions/contacts/tab';
import TitleContainer from './Title';
import Immutable from 'immutable';
import { ContactsCom, SearchInput } from './Contacts';
//内容组件
class EContent extends React.Component {
    searchContacts(value){
        const { edata, tabid, actions } = this.props;
        const { params } = edata.toJSON();
        params['tabid'] = tabid;
        params['key'] = value;
        actions.getContactsTabDatas(params)
    }
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
                contentHtml =  <ContactsCom eid={eid} list={list} esetting={esetting}/>
        }
        if(refresh) contentHtml = <Spin>{ contentHtml }</Spin>
        return <div>
            <SearchInput placeholder="搜索姓名/首字母/手机号" type="contacts" onSearch={value => this.searchContacts(value)} style={{width:'300px',marginTop:'5px'}} />
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
    const { econtactstab } = state;
    return ({
        data: econtactstab.get("data"),
        tabid: econtactstab.get("tabid"),
        refresh: econtactstab.get("refresh")
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
        data: stateProps.data.get(key) || Immutable.fromJS(ecLocalStorage.getObj("portal-" + window.global_hpid, "contacts-tab-" + key, true) || initdata),
        tabid: tabid,
        refresh: stateProps.refresh.get(key) || false,
        config: ownProps.config,
        edata: Immutable.fromJS(data),
        handleRefresh: ownProps.handleRefresh,
        actions: dispatchProps.actions
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EContent);
