import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import * as CustomPageAction from '../../../actions/custompage';
//自定义页面元素
class CustomPage extends React.Component {
    componentDidMount() {
        const { actions } = this.props;
        actions.setFrameData(this.props);
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
    componentWillReceiveProps(nextProps) {
        if (this.props.data.url != nextProps.data.url || window.ifCustomPageRefresh) {
            const { actions } = nextProps;
            actions.setFrameData(nextProps);
            window.ifCustomPageRefresh = false;
        }
    }
    render() {
        const { eid, data, actions } = this.props;
        let loaded = this.props.loaded;
        let html = <iframe frameBorder = "no" className = "custompageIframe" height = { data.height } id = { `ifrm_${eid}` } src = "about:blank" style = {{ borderCollapse: 'collapse' }} name = { `ifrm_${eid}` } width = "100%"></iframe>
        if (!loaded) {
            html = <Spin>{ html }</Spin>
        }
        return <div>{ html }</div>
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

CustomPage = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(CustomPage);
const mapStateToProps = state => {
    const { custompage } = state;
    return ({
        loaded: custompage.get("loaded")
    })
}

const mapDispatchToProps = dispatch => {
    return { actions: bindActionCreators(CustomPageAction, dispatch) }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        loaded: stateProps.loaded.get("frm_" + ownProps.eid) || false,
        eid: ownProps.eid,
        data: ownProps.data,
        currenttab: ownProps.currenttab,
        actions: dispatchProps.actions,
    };
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CustomPage);
