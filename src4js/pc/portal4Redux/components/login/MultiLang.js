import { connect } from 'react-redux'

import {changeMLDropDown,selectMLItem} from '../../actions/login'

class MultiLang extends React.Component {
    changeDropDown(event) {
        const {dispatch,visible} = this.props
        this.changeDropDdownClass(!visible)
        dispatch(changeMLDropDown(!visible))
    }
    selectLang(event) {
        const {dispatch,visible} = this.props
        let selText = $(event.target).text()
        let selLang = $(event.target).attr("lang")
        $(event.currentTarget).find(".selected").removeClass("selected")
        $(event.target).addClass("selected")
        this.changeDropDdownClass(!visible)
        dispatch(selectMLItem({
            selText,
            selLang,
            visible:!visible
        }))
    }
    changeDropDdownClass(visible) {
        if (visible) {
            $(".login-syslang-text").addClass("login-syslang-text-selected")
        } else {
            $(".login-syslang-text").removeClass("login-syslang-text-selected")
        }
    }
    render() {
        const {visible,selLang,selText} = this.props
        let selStyle = {
            "display": "none"
        }
        if (visible) {
            selStyle.display = "block"
        }
        return <div className="login-syslang">
            <input id="islangid" name="islangid" type="hidden" value={selLang}/>
            <span className="login-syslang-text" id="selectLan" onClick={this.changeDropDown.bind(this)}>
                <span>{selText}</span><i className="wevicon wevicon-login-select"/>
            </span>
            <div className="login-syslang-select">
                <ul style={selStyle} onClick={this.selectLang.bind(this)}>
                    <li lang="7" className="selected">简体中文</li>
                    <li lang="8">English</li>
                    <li lang="9">繁体中文</li> 
                </ul>
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    const {loginMLState}=state
    return loginMLState.toJSON()
}
module.exports = connect(mapStateToProps)(MultiLang)