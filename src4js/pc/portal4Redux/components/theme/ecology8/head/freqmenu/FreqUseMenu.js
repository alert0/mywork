import {connect} from 'react-redux'

import {WeaScroll} from 'weaCom';
import {FreqUseMenuItem} from '../FreqUseMenuItem';

import {loadFreqUseMenu,clearFreqUseMenu} from '../../../../../actions/head'

class FreqUseMenu extends React.Component {
    addMenu(event) {
        const {dispatch,userid} = this.props
        //  var addUrl = "/wui/theme/ecology9/page/userCommonMenu/userCommonMenu.jsp"
        var addUrl = "/wui/theme/ecology8/page/commonmenuSetting.jsp?type=left&isCustom=true&resourceType=3&resourceId=" + userid
        var title = "设置"
        this.props.onClick(event);
        showDialog(addUrl, title, 700, 600, () => {
            dispatch(loadFreqUseMenu())
        })
    }
    clearMenu(event) {
        const {dispatch} = this.props
        this.props.onClick(event);
        top.Dialog.confirm("确定要清空常用菜单吗？", () => {
            dispatch(clearFreqUseMenu())
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        return canUpdateComponent(nextState, nextProps, this.state, this.props)
    }
    render() { 
        var items = [];
        const {freqUseMenuList} = this.props
        freqUseMenuList.toJSON().forEach((item) => {
            items.push(<FreqUseMenuItem className="css-topmenu-frequse-item" key={item.infoid} name={item.menuname} url={item.url} menuid={item.infoid} type={item.target == "_blank"?"0":"2"} {...this.props}/>)
        });
        return <div className="css-topmenu-frequse-show">
            <WeaScroll typeClass="scrollbar-macosx" className="css-topmenu-frequse-pop" conClass="css-topmenu-frequse-pop" conHeightNum={0}>
                <ul className="css-topmenu-frequse-ul">{items}</ul>
            </WeaScroll>
            <div className="css-topmenu-frequse-setting">
                <span style={{"float":"left"}} data-url="" data-type="3" title="添加" onClick={this.addMenu.bind(this)}>添加</span>
                <span style={{"float":"right"}} data-url="" data-type="3" title="删除" onClick={this.clearMenu.bind(this)}>删除</span>
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    const {PortalHeadStates}=state
    return {
        freqUseMenuList:PortalHeadStates.get("freqUseMenuList"),
        userid:PortalHeadStates.get("userid")
    }
}
module.exports = connect(mapStateToProps)(FreqUseMenu)