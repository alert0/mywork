import {connect} from 'react-redux'

import {WeaScroll} from 'weaCom';
import {FreqUseMenuItem} from '../FreqUseMenuItem';

import {loadFreqUseMenu} from '../../../../../actions/head'

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
    shouldComponentUpdate(nextProps, nextState) {
        return canUpdateComponent(nextState, nextProps, this.state, this.props)
    }
    render() { 
        var maxNum = 10;
        var items = [];
        const {freqUseMenuList} = this.props
        freqUseMenuList.toJSON().forEach((item) => {
            var tempLen = countCharLengthInByte(item.menuname)
            if (tempLen > maxNum) {
                maxNum = tempLen;
            }
            items.push(<FreqUseMenuItem className="css-topmenu-frequse-item" key={item.infoid} name={item.menuname} url={item.url} menuid={item.infoid} type={item.target == "_blank"?"0":"2"} {...this.props}/>)
        });
        if (maxNum > 20) {
            maxNum = 20;
        }
        var widthStyle = {
            "width": (110 + (maxNum - 10) * 5) + "px"
        }
        return <div className="css-topmenu-frequse-show" style={widthStyle}>
                <WeaScroll typeClass="scrollbar-macosx" className="css-topmenu-frequse-pop"  conClass="css-topmenu-frequse-pop" conHeightNum={0}>
                    <ul className="css-topmenu-frequse-ul">{items}</ul>
                </WeaScroll>
                <div className="css-topmenu-frequse-setting" data-url="" data-type="3" title="设置" onClick={this.addMenu.bind(this)}>
                    <i className="wevicon wevicon-accounts-Set-up" />设置
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