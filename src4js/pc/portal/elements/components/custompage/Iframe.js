import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import * as IframeAction from '../../actions/custompage/iframe';
//自定义页面元素
class Iframe extends React.Component {
    componentDidMount() {
        const { actions } = this.props;
        actions.setFrameData(this.props);
    }
    shouldComponentUpdate(nextProps){
        const { eid, data, tabid, loaded } = this.props;
        const { height, url, moreUrl } = data;
        return eid !== nextProps.eid || tabid !== nextProps.tabid || loaded !== nextProps.loaded || height !== nextProps.data.height || url !== nextProps.data.url || moreUrl !== nextProps.data.moreUrl
    }
    componentWillUnmount() {
        var ifrms = jQuery(".custompageIframe");
        if (ifrms) {
            ifrms.each(function(i, ifrm) {
                var $this = jQuery(this);
                $this.attr({ src: "about:blank" });
            });
        }
    }
    render() {
        const { eid, data, tabid, loaded, actions } = this.props;
        let html = <iframe frameBorder = "no" className = "custompageIframe" height = { data.height } id = { `ifrm_${eid}` } src = "about:blank" style = {{ borderCollapse: 'collapse' }} name = { `ifrm_${eid}` } width = "100%"></iframe>
        if (!loaded) html = <Spin>{ html }</Spin>
        return <div>{ html }</div>
    }
}

import { WeaErrorPage, WeaTools } from 'ecCom';
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
            return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" } />
        );
    }
}

Iframe = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Iframe);
const mapStateToProps = state => {
    const { ecustompageiframe } = state;
    return ({
        loaded: ecustompageiframe.get("loaded")
    })
}

const mapDispatchToProps = dispatch => {
    return { actions: bindActionCreators(IframeAction, dispatch) }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    const key = ownProps.eid + "-" + ownProps.tabid;
    return {
        loaded: stateProps.loaded.get(key) || false,
        eid: ownProps.eid,
        data: ownProps.data,
        tabid: ownProps.tabid,
        actions: dispatchProps.actions,
    };
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Iframe);
