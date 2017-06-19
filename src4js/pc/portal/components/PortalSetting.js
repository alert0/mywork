import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import * as HpSettingAction from '../actions/hpsetting';
import {WeaErrorPage, WeaTools} from 'ecCom';
import Portal from './Portal';
import {Button, Input, Modal,Popconfirm, message} from 'antd';
import HpBaseElement from './HpBaseElement';
import {rightClickMenu} from '../util/rightclickmenu';
import{doPortalSynize} from'../apis/hpsetting';
//门户组件
class PortalSetting extends React.Component {
    handleMaxHpSetting() {
        const {max, refreshElement, actions} = this.props;
        actions.maxCustomHpSetting(!max);
        if(max && refreshElement) {
            var eids = global_all_eids[window.global_hpid];
            if(global_all_eids && eids){
                for(var eid in eids){
                    onRefresh(eid);
                }
            }
        }
    }
    handleCloseHpSetting() {
        const {actions} = this.props;
        onRightClickMenuClose();
        actions.closeCustomHpSetting(true);
        global_isSetting = false;
    }
    isconfirm(type) {
        const params = {
            hpid: global_hpid,
            subCompanyId: global_subCompanyId,
            method:type,
        }
        doPortalSynize(params).then((data) => {
             if (data.hasRight) {
                 message.success('操作成功！');
             } else {
                 message.error("操作失败！");
             }
         });

    }

    iscancel() {
    }
    render() {
        const {hpid, hpname, subCompanyId, data, max, close} = this.props;
        let locateUrl = window.location.href;
        if (!hpid || close) return <div></div>
        let style = {height: '100%', width: '100%'};
        //底部菜单
        let hpsettingmenus = data.toJSON().hpsettingmenu;
        // console.log(hpsettingmenus);
        //左边基础元素数组
        let baseElementsList = data.toJSON().hpbaseelements;
        //左边基础元素div高度
        let leftStyle = {minHeight: 40.4 * (baseElementsList.length + 1) + 'px', height: 'auto'};
        //将数组逆序，以便按钮右浮动
        let menuList = [];
        for (let i = 0; i < hpsettingmenus.length; i++) {
            menuList[hpsettingmenus.length - i - 1] = hpsettingmenus[i];
        }
        let buttonHtml = menuList.map((menuInfo, i) => {
            let result = <Button></Button>;
            if ("more" == menuInfo.key) {
                result = <Button key={menuInfo.key} id={"hpsetting_" + menuInfo.key} type="ghost"
                                 style={{color: 'grey', marginTop: '10px', marginRight: '20px', float: 'right'}}
                                 onClick={rightClickMenu.bind(this, menuInfo.key)}>{menuInfo.label}</Button>
            }else if("synihp"==menuInfo.key||"synihpnormal"==menuInfo.key){
                result = <Popconfirm title="同步后，用户在此门户中的个性化设置会丢失。确定要同步吗？" onConfirm={this.isconfirm.bind(this,menuInfo.key)} onCancel={this.iscancel}><Button onClick={onRightClickMenuClose} key={menuInfo.key} id={"hpsetting_" + menuInfo.key} type="primary"
                                 style={{marginTop: '10px', marginRight: '20px', float: 'right'}}
                                >{menuInfo.label}</Button></Popconfirm>;
            }
            else {
                result = <Button key={menuInfo.key} id={"hpsetting_" + menuInfo.key} type="primary"
                                 style={{marginTop: '10px', marginRight: '20px', float: 'right'}}
                                 onClick={rightClickMenu.bind(this, menuInfo.key)}>{menuInfo.label}</Button>;
            }
            return result;
        });
        let borderTopStyle = {};
        let borderBottomStyle = {};
        let maxIcon = '/spa/portal/images/recovery_wev9.png';
        if (!max) {
            style = {
                height: '90%',
                width: '90%',
                top: '5%',
                left: '5%',
                borderRadius: '6px'
            }
            borderTopStyle = {
                borderTopLeftRadius: '6px', borderTopRightRadius: '6px'
            }
            borderBottomStyle = {
                borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px'
            }
            maxIcon = '/spa/portal/images/max_wev9.png';
        }
        return <div>
            <div className="e9portal-setting"></div>
            <div className="portal-setting" style={style}>
                <div className="portal-setting-header" style={borderTopStyle}>
                    <div style={{width: '100%', height: '48px'}}>
                        <div style={{marginLeft: '1%', float: 'left'}}>
                            <div style={{float: 'left', marginRight: '5px', marginTop: '5px'}}><img
                                src="/spa/portal/images/mnav7_wev9.png"/></div>
                            <div style={{display: 'table-cell', height: '40px', verticalAlign: 'middle'}}>
                                <span style={{fontSize: '14px'}}>{hpname}</span>
                            </div>
                        </div>
                        <div style={{float: 'right', width: '100px', height: '80%'}}>
                            <div style={{float: 'left', marginTop: '10px', marginLeft: '30px', marginRight: '5px'}}>
                    <span className="portal-setting-header-title-icon"><img onClick={this.handleMaxHpSetting.bind(this)}
                                                                            src={maxIcon}/></span>
                            </div>
                            <div style={{float: 'left', marginTop: '10px'}}>
                    <span className="portal-setting-header-title-icon"><img
                        onClick={this.handleCloseHpSetting.bind(this)}
                        src="/spa/portal/images/16_close_wev9.png"/></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="portal-setting-content">
                    <div className="portal-setting-left" style={leftStyle}>
                        <HpBaseElement list={baseElementsList}/>
                    </div>
                    <div className="portal-setting-right" style={leftStyle}>
                        <Portal _fromURL={'ElementSetting'} customSetting={true} from={'addElement'} hpid={hpid} isSetting={true} subCompanyId={subCompanyId}/>
                    </div>
                </div>
                <div className="portal-setting-foot" style={borderBottomStyle}>
                    <div style={{height: '100%', float: 'right', paddingTop: '2px'}}>
                        {/*<Button type="ghost" style={{color:'grey',marginTop:'10px',marginRight:'20px',float:'right'}}>更多<Icon type="double-right" /></Button><Button type="primary" style={{marginTop:'10px',marginRight:'20px',float:'right'}}>隐藏元素库</Button><Button type="primary" style={{marginTop:'10px',marginRight:'20px',float:'right'}}>全部收缩</Button><Button type="primary" style={{marginTop:'10px',marginRight:'20px',float:'right'}}>同步首页</Button>*/}
                        {buttonHtml}
                    </div>
                </div>
            </div>
        </div>
    }
}
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
        return ( <WeaErrorPage msg={ hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" }/>
        );
    }
}
PortalSetting = WeaTools.tryCatch(React, MyErrorHandler, {error: ""})(PortalSetting);

const mapStateToProps = state => {
    const {hpsetting} = state;
    return ({
        hpid: hpsetting.get("hpid"),
        hpname: hpsetting.get("hpname"),
        data: hpsetting.get("data"),
        subCompanyId: hpsetting.get("subCompanyId"),
        max: hpsetting.get("max"),
        close: hpsetting.get("close"),
        refreshElement: hpsetting.get("refreshElement")
    })
}
const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(HpSettingAction, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(PortalSetting);





