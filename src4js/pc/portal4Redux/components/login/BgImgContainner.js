import {connect} from 'react-redux'

import {loginSetBgSrc,changeVisible,scrollToLeft} from '../../actions/login'

var overWidth = 0;
var dragStart = 0;
var dragEnd = 0;
class BgImgContainner extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.bgsrc.length != this.props.bgsrc.length) {
            const {bgsrc} = nextProps
            overWidth = (5 - bgsrc.length) * (54 + 10)
            if (overWidth > 0) {
                overWidth = 0
            }
        }
    }
    changeSkinImgVisible() {
        const {dispatch,visible} = this.props
        dispatch(changeVisible(!visible))
    }
    changeBgSrc(event) {
        const {dispatch} = this.props
        dispatch(loginSetBgSrc($(event.target).attr("src")))
        $(".login-bgslide-skinimg img").removeClass("login-skin-selected")
        $(event.target).addClass("login-skin-selected")
    }
    drangImgSlide(event) {
        dragStart = event.pageX;
        this.changeCursorStyle('in')
    }
    drangImgSlideEnd(event) {
        dragEnd = event.pageX;
        event.preventDefault();
        event.stopPropagation();

        const {dispatch,scrollLeft} = this.props
        let newScrollLeft = scrollLeft + dragEnd - dragStart;
        dragStart = dragEnd
        if (newScrollLeft > 0) {
            newScrollLeft = 0;
        } else if (newScrollLeft < overWidth) {
            newScrollLeft = overWidth
        }
        dispatch(scrollToLeft(newScrollLeft))
    }
    changeCursorStyle(type, event) {
        if (type == 'in') {
            $(".login-bgslide-skinimg>div").addClass("login-drag")
        } else {
            var pos = event.pageX
            event.preventDefault();
            event.stopPropagation();
            if (pos == 0) {
                $(".login-bgslide-skinimg>div").removeClass("login-drag")
            }
        }
    }

    render() {
        const {bgsrc,currentbgsrc,scrollLeft,visible} = this.props
        let skinImgStyle = {
            "display": "none"
        }
        let marginStyle = {
            "marginLeft": scrollLeft + "px"
        }
        let images = [];

        var selected = false;
        let index = 0
        bgsrc.map((item) => {
            images.push(<img key={++index} className={!selected && currentbgsrc==item ?"login-skin-selected":""} onClick={this.changeBgSrc.bind(this)} src={item}/>);
            if (currentbgsrc == item) {
                selected = true
            }
        }) 
        if (visible) {
            skinImgStyle.display = "block"
        }
        return <div  className="login-bgslide">
            <div className="login-bgslide-btn" onClick={this.changeSkinImgVisible.bind(this)}>
                <div className="login-form-shadow"></div>
                <div className="login-bgslide-btn-content">
                    <i className="wevicon wevicon-login-bgslide"/>
                </div>
            </div>
            <div  className="login-bgslide-skinimg" style={skinImgStyle} onMouseLeave={this.changeSkinImgVisible.bind(this)}>
                <div className="login-form-shadow"></div>
                <div className="login-bgslide-imgs" style={marginStyle} onDragStart={this.drangImgSlide.bind(this)}  
                onDragOver={this.drangImgSlideEnd.bind(this)}  onDragLeave={this.changeCursorStyle.bind(this,'out')}>
                    {images}
                </div>
            </div>
        </div>
    }
}
const mapStateToProps = state => {
    const { loginPageSetting,loginBgSelecter}=state
    return {
        visible: loginBgSelecter.get("visible"),
        scrollLeft: loginBgSelecter.get("scrollLeft"),
        currentbgsrc:loginPageSetting.get("currentbgsrc"),
        bgsrc:loginPageSetting.get("bgsrc")
    }
}
module.exports = connect(mapStateToProps)(BgImgContainner)