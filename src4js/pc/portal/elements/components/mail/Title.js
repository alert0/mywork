import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MailTitleAction from '../../actions/mail/title';
import OpToolbar from '../common/OpToolbar';
import Immutable from 'immutable';
import { backMarqueeDiv8, nextMarqueeDiv8 } from '../Common';

//tab的标题组件
class TitleContainer extends React.Component {
    componentDidMount() {
        const { config, tabids }=this.props;
        const { eid, header } = config.item;
        handleETitleWidth(eid,tabids.length,header.canHeadbar);
    }
    componentDidUpdate() {
        const { config, tabids }=this.props;
        const { eid, header } = config.item;
        handleETitleWidth(eid,tabids.length,header.canHeadbar);
    }
    handleOnChangeTab(tabid) {
        const { config, actions, dispatch } = this.props;
        actions.onChangeTab(config.item.eid, tabid);
    }
    render() {
        const tdStyle={ wordWrap: 'break-word', paddingTop: '5px', verticalAlign: 'top', height: '32px' };
        const { tabid, config, tabids, titles, actions, handleRefresh } = this.props;
        const { eid, ebaseid } = config.item;
        let tHtml=titles.map((title, i)=> {
            const className = tabids[i] == tabid ? "tab2selected" : "tab2unselected";
            return <td title={title} data-tabid={tabids[i]} style={tdStyle} className={className} onClick={this.handleOnChangeTab.bind(this,tabids[i])}>{title}</td>
        });
        let className = tabids.length <= 1 ? 'nodisplay' : '';
        return <div id={ `titleContainer_${eid}` } className={`titlecontainer ${className}`}>
                {<div id={`tabnavprev_${eid}`} className="picturebackhp" onClick={backMarqueeDiv8.bind(this,eid)}></div>}
                <div id={ `tabContainer_${eid}` } className="tabcontainer tab2">
                    <table style={ { tableLayout: "fixed", borderCollapse: 'collapse'} } height="32">
                      <tbody height="32">
                        <tr height="32">
                            { tHtml } 
                        </tr> 
                      </tbody>
                    </table>
                </div> 
                {<div id={`tabnavnext_${eid}`} className="picturenexthp" onClick={nextMarqueeDiv8.bind(this,eid)}></div>} 
                {config.item.header.canHeadbar === 'false' ? <OpToolbar config={config} clsname={className} handleRefresh={handleRefresh}/> : null} 
              </div>
      }
}
import { WeaErrorPage, WeaTools } from 'ecCom';
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg=this.props.error && this.props.error !=="";
            return ( <WeaErrorPage msg={ hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" } />
        );
    }
}
TitleContainer = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(TitleContainer);

const mapStateToProps = state => {
    const { emailtitle } = state;
    return ({
        tabid: emailtitle.get("tabid")
    })
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(MailTitleAction, dispatch)
    }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    const { eid } = ownProps.config.item;
    return {
        tabid: stateProps.tabid.get(eid) || ownProps.tabid,
        tabids: ownProps.tabids,
        config: ownProps.config,
        titles: ownProps.titles,
        handleRefresh:ownProps.handleRefresh,
        actions: dispatchProps.actions
    };
}
export default connect(mapStateToProps, mapDispatchToProps,mergeProps)(TitleContainer);
