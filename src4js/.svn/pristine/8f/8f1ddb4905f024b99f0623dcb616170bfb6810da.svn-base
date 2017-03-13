import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SpecialElementAction from '../../actions/specialelement';
import TitleContainer from './TitleContainer';
import { BlogStatus, Mail } from './etypes/';
import { ELEMENT_TYPES } from '../../constants/ActionTypes';
const { MAIL, CONTACTS, BLOGSTATUS } = ELEMENT_TYPES;

//特殊元素特殊处理
class SpecialElement extends React.Component {
constructor(props) {
    super(props)
    const { eid, data, actions } = props;
    actions.initSEDatas(eid, data.tabids[0], data.data);
}
render() {
    const { eid, ebaseid, data, toolbar, actions, currenttab } = this.props;
    const { titles, tabids, counts } = data;
    let list = this.props.list;
    if (list) list = list.toJSON();
    if (_isEmpty(list)) list = data.data[currenttab];
    let html = null;
    if (!_isEmpty(list)) {
        switch (ebaseid) {
            case MAIL:
                html = <Mail list = { list }
                currTab = { currenttab }
                esetting = { data.esetting }
                olist = { data.data.oplist }
                />
                break;
            case BLOGSTATUS:
                html = <BlogStatus list = { list }
                currTab = { currenttab }
                esetting = { data.esetting }
                />
                break;
        }
    }
    return <div>{
        ebaseid === CONTACTS ? null : <TitleContainer ebaseid = { ebaseid }
        counts = { counts }
        toolbar = { toolbar }
        currenttab = { currenttab }
        titles = { titles }
        tabids = { tabids }
        eid = { eid }
        sedata = { data }
        />}{ html }</div>
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
SpecialElement = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(SpecialElement);

const mapStateToProps = state => {
    const {
        specialelement
    } = state;
    return ({
        list: specialelement.get("list"),
        currenttab: specialelement.get("currenttab")
    })
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(SpecialElementAction, dispatch) }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        list: stateProps.list.get(ownProps.eid),
        currenttab: stateProps.currenttab.get(ownProps.eid),
        data: ownProps.data,
        ebaseid: ownProps.ebaseid,
        eid: ownProps.eid,
        toolbar: ownProps.toolbar,
        actions: dispatchProps.actions
    };
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SpecialElement);
