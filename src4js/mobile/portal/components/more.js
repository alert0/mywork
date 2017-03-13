import React, {Component} from 'react';

import Loading from './loading';

class More extends Component {
    showMore() {
        this.refs["more"].style.display = "block";
    }

    hideMore() {
        this.refs["more"].style.display = "none";
    }

    showLoading() {
        this.refs["iconMore"].style.display = "none";
        this.refs["_loading"].showLoading();
    }

    hideLoading() {
        this.refs["iconMore"].style.display = "block";
        this.refs["_loading"].hideLoading();
    }

    render() {
        //不存在标签页隐藏 more
        let moreStyle = this.props.tabs.length > 0 ? {} : {display: "none"};

        return (
            <div ref="more"
                 className="more"
                 style={moreStyle}
                 onClick={() => {
                     this.props.loadMoreDataFun();
                 }}
                 onTouchStart={() => {
                     this.refs["more"].style.backgroundColor = "#eee";
                 }}
                 onTouchEnd={() => {
                     this.refs["more"].style.backgroundColor = "#fff";
                 }}
            >
                <Loading ref="_loading"/>
                <div ref="iconMore" className="icon-more"></div>
            </div>
        );
    }
}

module.exports = More;