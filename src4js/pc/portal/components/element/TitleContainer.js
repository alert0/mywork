/* -------- 元素数据tab标题组件 -------- */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import OpToolbar from './OpToolbar';
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
        const { eid, ebaseid,tabids,toolbar } = this.props;
        if (WORKFLOW === ebaseid) oldMoreHref = $("#more_" + eid).attr("data-morehref");
        this.setMoreHref();
        initheight(eid,tabids.length,toolbar,ebaseid);
    }
    componentDidUpdate() {
        this.setMoreHref();
        const { eid,tabids,toolbar,ebaseid } = this.props;
        initheight(eid,tabids.length,toolbar,ebaseid);
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
        const tdStyle = { wordWrap: 'break-word', paddingTop: '5px', verticalAlign: 'top', height: '32px' };
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
                    if(TASK === ebaseid){
                        title += ' (<font style="color:red">' + counts[i] + '</font>)';
                    }else{
                        title += ' (' + counts[i] + ')';
                    }
                }
            }
            const className = tabids[i] == currtab ? "tab2selected" : "tab2unselected";
            if(TASK === ebaseid){
                return <td title = { title } data-tabid = { tabids[i] } style = {tdStyle} className = { className } onClick = { this.onChangeTab.bind(this, eid, params, tabids[i]) } dangerouslySetInnerHTML={{__html:title}}></td>
            }else{
                return <td title = { title } data-tabid = { tabids[i] } style = {tdStyle} className = { className } onClick = { this.onChangeTab.bind(this, eid, params, tabids[i]) }>{ title }</td>
            }
        });

        let className = tabids.length <= 1 ? 'nodisplay' : '';
/*        var moveFn = null;
        if (toolbar) {
            moveFn = handleDragStart.bind(this,eid, toolbar.ele.item.header.onmousedown, false);
            className +=' movestyle';
        }*/
        return <div id = { `titleContainer_${eid}` } className = {`titlecontainer ${className}`}>
                {<div id={`tabnavprev_${eid}`} className="picturebackhp" onClick={backMarqueeDiv8.bind(this,eid)}></div>}
                <div id = { `tabContainer_${eid}` } className = "tabcontainer tab2">
                    <table style = { { tableLayout: "fixed", borderCollapse: 'collapse'} } height = "32" width = { 77 * tabids.length }>
                      <tbody height = "32">
                        <tr height = "32">
                            { tHtml } 
                        </tr> 
                      </tbody>
                    </table>
                </div> 
                {<div id={`tabnavnext_${eid}`} className="picturenexthp" onClick={nextMarqueeDiv8.bind(this,eid)}></div>} 
                {toolbar ? <OpToolbar eid = { eid } ebaseid = {ebaseid} toolbar = { toolbar.toolbar } ele = { toolbar.ele } clsname={className}/> : null} 
              </div>
      }
}
import { WeaErrorPage, WeaTools } from 'weaCom';
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
        return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" } />
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


function backMarqueeDiv8(eid){
    $("#tabContainer_"+eid).scrollTo( {top:'0px',left:($("#tabContainer_"+eid).get(0).scrollLeft - 77 + 'px')}, 500 );
}

function nextMarqueeDiv8(eid){
    $("#tabContainer_"+eid).scrollTo( {top:'0px',left:($("#tabContainer_"+eid).get(0).scrollLeft + 77 + 'px')}, 500 );
}

var initheight = function(eid,length,toolbar,ebaseid){
    let divWidth = length*77+36;
    let hpWidth = $("#content_"+eid).width();
    var titleWidth = hpWidth-10;
    if(toolbar){
         hpWidth = hpWidth - $("#content_"+eid).find(".optoolbar").width() - 15;
    }
    if(parseFloat(divWidth) > parseFloat(hpWidth)) {
        $("#tabnavprev_"+eid).css("display","block");
        $("#tabnavnext_"+eid).css("display","block");
        if(length>1){
            if(toolbar){
                $("#tabContainer_"+eid).css("width", hpWidth - 55);
                $("#tabnavnext_"+eid).css("right","110px");
            }else{
                $("#tabContainer_"+eid).css("width", hpWidth - 55);
                $("#titleContainer_"+eid).css("width", hpWidth);
            }
            $("#tabContainer_"+eid).css("display", ""); 
            $("#tabContainer_"+eid).css("margin-left", "0px");
            $("#tabContainer_"+eid).css("margin-right", "0px"); 
          }else{
            $("#tabnavprev_"+eid).css("display","none");
            $("#tabnavnext_"+eid).css("display","none");
            $("#tabContainer_"+eid).css("display", "none"); 
          }
        
    }else{
        $("#tabnavprev_"+eid).css("display","none");
        $("#tabnavnext_"+eid).css("display","none");
        if(length>1){
            if(toolbar){
                $("#tabContainer_"+eid).css("width", hpWidth-50 );
            }else{
                $("#tabContainer_"+eid).css("width", hpWidth);
            }
            $("#tabContainer_"+eid).css("display", ""); 
            $("#tabContainer_"+eid).css("margin-left", "0");
            $("#tabContainer_"+eid).css("margin-right", "0"); 
        }else{
         $("#tabContainer_"+eid).css("display", "none"); 
        }
    }
}
