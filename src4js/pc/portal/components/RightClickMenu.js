import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import * as RightClickMenuAction from '../actions/rightclickmenu';
import { WeaErrorPage, WeaTools } from 'ecCom';
import {rightClickMenu} from '../util/rightclickmenu';
import{doPortalSynize} from'../apis/hpsetting';
import { Input, Modal,Popconfirm, message} from 'antd';
const { is, fromJS } = Immutable;

//门户组件
class RightClickMenu extends React.Component {
    componentWillMount(){
        const{actions} =this.props;
        actions.getRightClickMenu();
    }
    shouldComponentUpdate(nextProps){
        const { position, menu, show, visible } = this.props;
        return is(fromJS(position),fromJS(nextProps.position))
            || is(fromJS(menu),fromJS(nextProps.menu))
            || show !== nextProps.show || visible !== nextProps.visible
    }
    componentWillReceiveProps(nextProps){
        const { hpid, isSetting, actions } = this.props;
        if(hpid !== nextProps.hpid || isSetting !== nextProps.isSetting){
            actions.getRightClickMenu();
        }
    }
    handleOk() {
        const{actions} =this.props;
        actions.showLocationURL(false);
    }

    handleCancel() {
        const{actions} =this.props;
        actions.showLocationURL(false);
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
        onRightClickMenuClose();
    }

    iscancel() {
        onRightClickMenuClose();
    }
    render() {
        const { position, menu, show,visible } = this.props;
        let locateUrl=window.location.href;
        if(!show) return <div>
            <Modal title="当前页面地址" visible={visible}
                   onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
            >
                <Input defaultValue={locateUrl}/>
            </Modal></div>
        let menuArr = menu.toJSON().map((item)=>{
            if("synihp"==item.key||"synihpnormal"==item.key){
                return <div className="rightclickmenu-list"><img src={item.icon}/><Popconfirm title="同步后，用户在此门户中的个性化设置会丢失。确定要同步吗？"  onConfirm={this.isconfirm.bind(this,item.key)} onCancel={this.iscancel}><a href="javascript:void(0);" >{item.label}</a></Popconfirm></div>
            }
            return <div className="rightclickmenu-list"><img src={item.icon}/><a href="javascript:void(0);" onClick={rightClickMenu.bind(this,item.key)}>{item.label}</a></div>

        });

        return <div className="rightclickmenu" style={position.toJSON()}>
            <div>
                <Modal title="当前页面地址" visible={visible}
                       onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
                    <Input defaultValue={locateUrl}/>
                </Modal>
            </div>
            {menuArr}
        </div>
    }
}
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
        return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" }/>
        );
    }
}
RightClickMenu = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(RightClickMenu);
const mapStateToProps = state => {
    const { rightclickmenu } = state;
    return ({
        position: rightclickmenu.get("position"),
        menu: rightclickmenu.get("menu"),
        show: rightclickmenu.get("show"),
        visible:rightclickmenu.get("visible"),
        isvisible: rightclickmenu.get("isvisible")
    })
}

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(RightClickMenuAction, dispatch) }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    const { hpid, isSetting } = ownProps
    const key = hpid + '-' + isSetting;
    return {
        hpid: hpid,
        isSetting: isSetting,
        position: stateProps.position.get(key) || fromJS({top:0,left:0}),
        menu: stateProps.menu.get(key) || fromJS([]),
        show: stateProps.show.get(key) || false,
        visible: stateProps.visible.get(key) || false,
        isvisible: stateProps.isvisible.get(key) || false,
        actions: dispatchProps.actions
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(RightClickMenu);




