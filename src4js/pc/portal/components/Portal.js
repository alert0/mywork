import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Homepage from './Homepage';
import * as HomepageAction from '../actions/';
//门户组件
class Portal extends React.Component {
    componentDidMount() {
        const { actions, hpid, requestid } = this.props;
        let params = this.props.params;
        if (hpid) params = { hpid, requestid }
        actions.getHpData(params);
        $("#btnWfCenterReload").attr("onclick", "elmentReLoad('8')");
    }
    componentDidUpdate() {
        const { actions, hpid, requestid } = this.props;
        let params = this.props.params;
        if (hpid) params = { hpid, requestid }
        actions.getHpData(params);
        $("#btnWfCenterReload").attr("onclick", "elmentReLoad('8')");
    }
    render() {
        const { params, hpid } = this.props;
        if (params || hpid) {
            if (params) {
                window.global_hpid = params.hpid;
                window.global_subCompanyId = params.subCompanyId;
            } else if (hpid) {
                window.global_hpid = hpid;
                window.global_subCompanyId = "-1";
            }
            return <Homepage />;
        } else {
            return <div></div>
        }
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

Portal = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Portal);

const mapStateToProps = state => {
    return {}
}
const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(HomepageAction, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Portal);
