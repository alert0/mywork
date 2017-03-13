import { Spin } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

//每个布局区域的元素组件集合
import EHeader from './EHeader';
import EContent from './EContent';
import SpecialElement from './SpecialElement';
import EType from './EType';
import { Contacts } from './etypes/';

import { ELEMENT_TYPES } from '../../constants/ActionTypes';

const { WORKFLOW, MAIL, BLOGSTATUS, CONTACTS, CUSTOMPAGE } = ELEMENT_TYPES;

import * as ElementAction from '../../actions/element';

//元素组件
class Element extends React.Component {
    componentDidMount() {
        const { ele, actions ,edata} = this.props;
        const { eid, ebaseid } = ele.item;
        if (ebaseid === WORKFLOW)
            window.ifWorkFlowRefrash = actions.handleRefresh.bind(this, ele);
        if(!_isRE(ebaseid)){
          jQuery("#no_react_element_"+eid).html(edata);
        }
    }
    componentDidUpdate() {
        const { ele, edata } = this.props;
        const { eid, ebaseid } = ele.item;
        if(!_isRE(ebaseid)){
          jQuery("#no_react_element_"+eid).html(edata);
        }
    }
    render() {
        const { ele, actions, isEReFresh } = this.props;
        const isHasRight = ele.isHasRight === "true";
        const item = ele.item;

        const { eid, ebaseid, content, header, contentview } = item;

        let edata = this.props.edata;

        const isRe = _isRE(ebaseid);

        if (edata && isRe) edata = edata.toJSON();

        let EContentHtml = <div width = "100%"></div>;

        let slideclass = '';
        if (!_isEmpty(edata)) {
            if (isRe) {
                //对特殊元素进行处理
                const specialEArr = [BLOGSTATUS, CONTACTS, MAIL];
                var toolbar = null;
                if (header.canHeadbar === 'false') {
                    toolbar = { toolbar: header.toolbar, ele }
                }
                if (specialEArr.contains(ebaseid)) {
                    if (ebaseid === CONTACTS) {
                        EContentHtml = <Contacts eid = { eid }
                        ebaseid = { ebaseid }
                        data = { edata }
                        toolbar = { toolbar }
                        />
                    } else {
                        EContentHtml = <SpecialElement eid = { eid }
                        ebaseid = { ebaseid }
                        data = { edata }
                        toolbar = { toolbar }
                        />
                    }
                } else {
                    if (undefined !== edata.tabids) {
                        EContentHtml = isHasRight ? <EContent eid = { eid }
                        ebaseid = { ebaseid }
                        data = { edata }
                        toolbar = { toolbar }
                        /> : <NoRight/>;
                    } else {
                        EContentHtml = edata.isHasRight === undefined ? <EType eid = { eid }
                        ebaseid = { ebaseid }
                        data = { edata.data }
                        esetting = { edata.esetting }
                        /> : <NoRight/>;
                    }
                }
            } else {

                EContentHtml = <div id={"no_react_element_" + eid}></div>;
            }
        }
        if (isEReFresh && ebaseid !== CUSTOMPAGE) {
            EContentHtml = <Spin>{ EContentHtml }</Spin>
        }
        // let style = item.style;
        return <div className = "item"
        style = { { marginTop: '10px' } }
        id = { `item_${eid}` }
        data-eid = { eid }
        data-ebaseid = { ebaseid }
        data-needRefresh = { item.needRefresh }
        data-cornerTop = { item.cornerTop }
        data-cornerTopRadian = { item.cornerTopRadian }
        data-cornerBottom = { item.cornerBottom }
        data-cornerBottomRadian = { item.cornerBottomRadian }>
            <EHeader header = { header }
        eid = { eid }
        ebaseid = { ebaseid }
        ele = { ele }
        /><div className = "content"
        id = { `content_${eid}` }
        style = { { width: 'auto', _width: '100%' } }>
            <div className = "content_view"
        id = { `content_view_id_${eid}` }
        style = { contentview.style }>{ EContentHtml }</div>
        <div style = { { textAlign: 'right' }}
        id = { `footer_${eid}` }>
        </div></div></div>;
    }
}

//无权访问的元素的组件
const NoRight = (props) => <div style = { { width: '100%', height: '160px', textAlign: 'center', paddingTop: '63px' } }>
    <img src = "/synergy/js/waring_wev8.png" />{"对不起， 您暂时没有权限！"}</div>

import { WeaErrorPage, WeaTools } from 'weaCom';

class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
        return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" }
            />
        );
    }
}

Element = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Element);

const mapStateToProps = state => {
    const { element } = state;
    return ({
        edata: element.get("edata"),
        isEReFresh: element.get("isEReFresh")
    })
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ElementAction, dispatch)
    }
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        isEReFresh: stateProps.isEReFresh.get(ownProps.ele.item.eid),
        edata: stateProps.edata.get(ownProps.ele.item.eid),
        actions: dispatchProps.actions,
        ele: ownProps.ele
    };
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Element);
