/* -------- 元素数据tab标题组件 -------- */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Toolbar from './Toolbar';
import * as TitleContainerAction from '../../actions/titlecontainer';
import { handleChangeTab } from '../../actions/econtent';
import { handleChangeSETab } from '../../actions/specialelement';
import ecLocalStorage from '../../util/ecLocalStorage.js';

import { ELEMENT_TYPES, REQ_URLS } from '../../constants/ActionTypes';

const { WORKFLOW, MAIL, BLOGSTATUS, CONTACTS, TASK } = ELEMENT_TYPES;

const { WORKFLOW_MORE_SPA_URL } = REQ_URLS;

//回去老版本moreurl
let oldMoreHref = "";
//tab的标题组件
class TitleContainer extends React.Component {
    componentDidMount() {
        const { eid, ebaseid } = this.props;
        if (WORKFLOW === ebaseid) oldMoreHref = $("#more_" + eid).attr("data-morehref");
        this.setMoreHref();
    }
    componentDidUpdate() {
        this.setMoreHref();
    }
    setMoreHref() {
        const { eid, ebaseid, more } = this.props;
        if (WORKFLOW === ebaseid) {
            if (more && JSON.parse(more).viewType !== "6") {
                $("#more_" + eid).attr("data-morehref", WORKFLOW_MORE_SPA_URL + escape(more));
            } else {
                $("#more_" + eid).attr("data-morehref", oldMoreHref);
            }
        }
    }
    onChangeTab(eid, params, tabid) {
        ecLocalStorage.set("currenttab", "tabid-" + eid, tabid, true);
        const { dispatch, ebaseid, sedata, currenttab, more } = this.props;
        let currtab = this.props.currtab ? this.props.currtab : currenttab;
        const specialEArr = [BLOGSTATUS, MAIL];
        if (specialEArr.contains(ebaseid)) {
            dispatch(handleChangeSETab(eid, tabid, sedata));
        } else {
            dispatch(handleChangeTab(eid, params, currtab, tabid));
        }
    }
    render() {
        const { eid, ebaseid, tabids, titles, counts, currenttab, currCount, toolbar, params, actions } = this.props;
        let currtab = ecLocalStorage.getStr("currenttab", "tabid-" + eid, true);
        if (!currtab) currtab = this.props.currtab ? this.props.currtab : currenttab;
        let tHtml = titles.map((title, i) => {
            if (!_isEmpty(counts) && counts.length === tabids.length) {
                if (WORKFLOW === ebaseid && '' !== counts[i]) {
                    if (tabids[i] === currtab) {
                        if (currCount) {
                            title += ' (' + currCount + ')';
                        }
                    } else {
                        title += ' (' + counts[i] + ')';
                    }
                }
                if ((TASK === ebaseid || BLOGSTATUS === ebaseid) && '0' !== counts[i]) {
                    title += ' (' + counts[i] + ')';
                }
            }
            const className = tabids[i] == currtab ? "tab2selected" : "tab2unselected";
            return <td title = { title }
            data-tabid = { tabids[i] }
            style = { { wordWrap: 'break-word', paddingTop: '5px', verticalAlign: 'top', height: '32px' } }
            className = { className }
            onClick = { this.onChangeTab.bind(this, eid, params, tabids[i]) }>{ title }</td>
        });

        let className = tabids.length <= 1 ? 'nodisplay' : '';
        var moveFn = null;
        var style = null;
        if (toolbar) {
            moveFn = handleDragStart.bind(this, toolbar.ele.item.header.onmousedown, false);
            style = { width: 'auto', position: 'relative', cursor: 'move' };
        }
        return <div id = { `titleContainer_${eid}` }
                    className = { `titlecontainer ${className}` }
                    style = { style }
                    onMouseDown = { moveFn }>
                    { /* <div id={`tabnavprev_${eid}`} className="picturebackhp"></div>*/ }
                    <div id = { `tabContainer_${eid}` }
                         className = "tabcontainer tab2">
                        <table style = { { tableLayout: "fixed", borderCollapse: 'collapse' } }
                               height = "32"
                               width = { 77 * tabids.length }>
                          <tbody height = "32">
                            <tr height = "32">{ tHtml } </tr> 
                          </tbody>
                        </table>
                    </div> 
                    { /*<div id={`tabnavnext_${eid}`} className="picturenexthp"></div>*/ } 
                    { toolbar ? <div className = "optoolbar">
                    <Toolbar eid = { eid } 
                             toolbar = { toolbar.toolbar }
                             ele = { toolbar.ele } /> 
                       </div>:null} 
              </div>
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
TitleContainer = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(TitleContainer);

const mapStateToProps = state => {
    const { econtent, specialelement } = state;
    return ({
            currtab: econtent.get("currtab"),
            speccurrenttab: specialelement.get("currenttab")
        })
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        currtab: stateProps.currtab.get(ownProps.eid),
        speccurrenttab: stateProps.speccurrenttab.get("cur_" + ownProps.eid),
        eid: ownProps.eid,
        ebaseid: ownProps.ebaseid,
        more: ownProps.more,
        tabids: ownProps.tabids,
        titles: ownProps.titles,
        currenttab: ownProps.currenttab,
        currCount: ownProps.currCount,
        toolbar: ownProps.toolbar,
        params: ownProps.params,
        counts: ownProps.counts,
        sedata: ownProps.sedata,
        dispatch: dispatchProps.dispatch
    };
}
export default connect(mapStateToProps, null, mergeProps)(TitleContainer);
