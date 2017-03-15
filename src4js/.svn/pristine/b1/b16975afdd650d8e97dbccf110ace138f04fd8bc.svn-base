import { Spin } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as EContentAction from '../../actions/econtent';
import TitleContainer from './TitleContainer';
import EType from './EType';

import { ELEMENT_TYPES } from '../../constants/ActionTypes';
const { WORKFLOW, CUSTOMPAGE, TASK } = ELEMENT_TYPES;

//内容组件
class EContent extends React.Component {
    constructor(props) {
        super(props)
        const { eid, data, actions } = props;
        let currenttab = data.currenttab ? data.currenttab : data.tabids[0];
        actions.initETabDatas(eid, currenttab, data.data);
    }
    componentWillUpdate(nextProps) {
        const { eid, data, actions } = nextProps;
        if (JSON.stringify(data.data) !== JSON.stringify(this.props.data.data)) {
            let currenttab = data.currenttab ? data.currenttab : data.tabids[0];
            actions.initETabDatas(eid, currenttab, data.data);
        }
    }
    render() {
        let contentHtml = <div width = "100%"></div>;
        const { eid, toolbar, data, ebaseid, currtab, actions, ifClickCurrTab } = this.props;
        let tabdata = this.props.tabdata;
        if (tabdata) tabdata = tabdata.toJSON();
        const tabids = data.tabids;
        const titles = data.titles;
        let counts = new Array;
        if (WORKFLOW === ebaseid || TASK === ebaseid) {
            counts = data.counts;
        }
        let tabClass = ''
        let more = '';
        let currCount = '';
        if (!_isEmpty(tabdata)) {
            if (ebaseid === WORKFLOW) {
                more = tabdata.tabsetting.more;
            }
            if (WORKFLOW === ebaseid && tabdata.tabsetting.count) {
                currCount = tabdata.tabsetting.count;
                for (var i = 0; i <tabids.length; i++) {
                    if (tabids[i] === currtab) {
                        counts[i] = currCount;
                    }
                }
            }
            contentHtml = <EType eid = { eid }
            ebaseid = { ebaseid }
            data = { tabdata }
            currenttab = { currtab }
            esetting = { data.esetting }
            />
        }
        if (ifClickCurrTab && ebaseid !== CUSTOMPAGE) {
            contentHtml = <Spin>{ contentHtml }</Spin>
        }
        return <div>
            <TitleContainer params = {data.params} ebaseid={ebaseid} more={ more } currCount = { currCount } counts = { counts } toolbar = { toolbar } currenttab = { currtab } titles = { titles } tabids = { tabids }eid = { eid } />
            <div className = "tabContant" id = { `tabcontant_${eid}` } >
            { contentHtml }
            </div>
         </div>;
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
EContent = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(EContent);


const mapStateToProps = state => {
    const { econtent } = state;
    return ({
        currtab: econtent.get("currtab"),
        ifClickCurrTab: econtent.get("ifClickCurrTab"),
        tabdata: econtent.get("tabdata")
    })
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(EContentAction, dispatch) }
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
