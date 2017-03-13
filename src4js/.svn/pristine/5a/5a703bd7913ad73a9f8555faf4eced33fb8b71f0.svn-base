import { WeaTools } from 'weaCom';

import { SYNERGY_URL, SYNERGY_ROUTER_MAPPING_URL } from '../constants/ActionTypes';

import Portal from './Portal';

class Synergy extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hpid: 0,
            isuse: false
        }
    }

    componentWillMount() {
        const {
            pathname,
            workflowid,
            requestid
        } = this.props;
        const urlObj = SYNERGY_ROUTER_MAPPING_URL[pathname];
        let path = '';
        let viewScope = '';
        if (urlObj) {
            path = urlObj.path || '';
            viewScope = urlObj.viewScope || '';
        }
        WeaTools.callApi(SYNERGY_URL, 'POST', {
            path: path,
            viewScope: viewScope,
            workflowid: workflowid,
            requestid: requestid
        }, 'json').then((result) => {
            this.setState({
                hpid: result.hpid,
                isuse: result.isuse
            });
        }, (result) => {
            console.log(result);
        });
    }

    isShowSynergy(isshow) {
        this.refs['synergy'].style.display = isshow ? 'block' : 'none';
        this.refs['synergyHide'].style.display = isshow ? 'block' : 'none';
        this.refs['synergyShow'].style.display = isshow ? 'none' : 'block';
    }

    changeImgUrl(type, event) {
        if ('hideOver' == type) {
            event.target.attributes['src'].value = '/wui/theme/ecology9/image/left-hide-hover.png';
        } else if ('showOver' == type) {
            event.target.attributes['src'].value = '/wui/theme/ecology9/image/left-show-hover.png';
        } else if ('hideOut' == type) {
            event.target.attributes['src'].value = '/wui/theme/ecology9/image/left-hide.png';
        } else if ('showOut' == type) {
            event.target.attributes['src'].value = '/wui/theme/ecology9/image/left-show.png';
        }
    }

    render() {
        let isuse = this.state.isuse;
        let hpid = this.state.hpid || 0;
        //let pathname = this.props.pathname;
        let workflowid = this.props.workflowid || -1;
        let requestid = this.props.requestid || -1;
        let sWidth = '430px';
        let btnRight = '413px';
        // 公司正式系统，费用报销流程，特殊处理协同区宽度
        if ('60' == workflowid) {
            sWidth = '860px';
            btnRight = '843px';
        }

        if (isuse) {
            return (
                <div style={{position: 'absolute', top: 0, right: 0, height: '100%'}}>
                    <div ref="synergy" style={{display: 'none', position: 'absolute', top: 0, right: 0, zIndex: 998, width: sWidth, height: '100%', padding: '10px', overflow: 'auto', background: '#f6f7f9', boxShadow: '0 0 5px #ddd'}}>
                        <Portal hpid={hpid} workflowid={workflowid} requestid={requestid} />
                    </div>
                    <div ref="synergyHide" style={{display: 'none', position: 'absolute', top: '50%', right: btnRight, zIndex: 999, cursor: 'pointer'}} title="隐藏协同区" onClick={this.isShowSynergy.bind(this, false)}>
                        <img src="/wui/theme/ecology9/image/left-hide.png" alt="" onMouseOver={this.changeImgUrl.bind(this, 'hideOver')} onMouseOut={this.changeImgUrl.bind(this, 'hideOut')} />
                    </div>
                    <div ref="synergyShow" style={{position: 'absolute', top: '50%', right: 0, zIndex: 999, cursor: 'pointer'}} title="显示协同区" onClick={this.isShowSynergy.bind(this, true)}>
                        <img src="/wui/theme/ecology9/image/left-show.png" alt="" onMouseOver={this.changeImgUrl.bind(this, 'showOver')} onMouseOut={this.changeImgUrl.bind(this, 'showOut')} />
                    </div>
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}

module.exports = Synergy;