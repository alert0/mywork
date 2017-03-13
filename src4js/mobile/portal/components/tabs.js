import React, {Component} from 'react';

class Tabs extends Component {
    componentDidMount() {
        let tabWidth = this.refs["tabUl"].scrollWidth;
        this.refs["tabScroller"].style.width = tabWidth + "px";

        new iScroll('tabWrapper_' + this.props.eid, {
            hScroll: true,
            vScroll: false,
            hScrollbar: false,
            vScrollbar: false,
            bounce: false
        });
    }

    render() {
        let self = this;
        let hpid = this.props.hpid;
        let eid = this.props.eid;
        let tabid = this.props.tabid;

        let wrapper = "tabWrapper_" + eid;
        let scroller = "tabScroller_" + eid;

        //标签页只有一个则隐藏
        let tabStyle = this.props.tabs.length > 1 ? {} : {display: "none"};

        let liHtml = this.props.tabs.map(function (item, index) {
            let className = item.tabid == tabid ? "active" : "";
            return (
                <li key={index}
                    className={className}
                    onClick={ ()=> {
                        let params = {
                            url: item.url,
                            moreUrl: item.moreUrl,
                            hpid: hpid,
                            eid: eid,
                            tabid: item.tabid
                        };
                        self.props.loadDataFun(params);
                    } }
                >
                    {item.title}
                </li>
            )
        });

        return (
            <div className="tab" id={wrapper} style={tabStyle}>
                <div ref="tabScroller" id={scroller}>
                    <ul ref="tabUl" className="tab-ul">
                        {liHtml}
                    </ul>
                </div>
            </div>
        );
    }
}

module.exports = Tabs;