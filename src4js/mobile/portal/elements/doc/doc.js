import React, {Component} from 'react';

import Header from './../../components/header';
import Tabs from './../../components/tabs';
import More from './../../components/more';
import Loading from './../../components/loading';

import 'antd-mobile/lib/carousel/style';
import Carousel from 'antd-mobile/lib/carousel';

class Doc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                data: [],
                showType: 1,
                eid: 0,
                tabid: 0
            },
            more: {
                moreUrl: "",
                pageIndex: 1
            }
        };
    }

    componentDidMount() {
        if (this.props.tabs && this.props.tabs.length > 0) {
            // 默认加载第一个标签页
            let params = {
                url: this.props.tabs[0].url,
                moreUrl: this.props.tabs[0].url,
                hpid: this.props.hpid,
                eid: this.props.eid,
                tabid: this.props.tabs[0].tabid
            };
            this.loadData(params);
        } else {
            this.setState({
                data: {
                    data: [],
                    showType: 1,
                    eid: this.props.eid,
                    tabid: 0
                },
                more: {
                    moreUrl: "",
                    pageIndex: 1
                }
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tabs && nextProps.tabs.length > 0) {
            // 默认加载第一个标签页
            let params = {
                url: nextProps.tabs[0].url,
                moreUrl: nextProps.tabs[0].url,
                hpid: nextProps.hpid,
                eid: nextProps.eid,
                tabid: nextProps.tabs[0].tabid
            };
            this.loadData(params);
        } else {
            this.setState({
                data: {
                    data: [],
                    showType: 1,
                    eid: this.props.eid,
                    tabid: 0
                },
                more: {
                    moreUrl: "",
                    pageIndex: 1
                }
            });
        }
    }

    componentDidUpdate() {
        if (window.hpScroll) {
            window.hpScroll.refresh();
        }
    }

    loadData(params) {
        let url = params.url,
            hpid = params.hpid,
            eid = params.eid,
            tabid = params.tabid;

        // 手机客户端访问只能访问 mobile 目录下的接口
        let moreUrl = url = url.replace(/^\/page\//, "/mobile/plugin/homepagemobile/");
        params.url = url + "?pageIndex=1";
        params.moreUrl = moreUrl;

        this.refs["more"].hideMore();
        this.refs["more"].hideLoading();

        let localHp = JSON.parse(localStorage.getItem("hp_" + hpid));
        // 若门户缓存和元素缓存都存在，先加载缓存，再去刷新数据
        if (localHp && localHp["e_" + eid + "_" + tabid]) {
            let localEle = localHp["e_" + eid + "_" + tabid];
            this.setState({
                data: localEle,
                more: {
                    moreUrl: moreUrl,
                    pageIndex: 1
                }
            });

            if (localEle.data.length > 0) {
                this.refs["more"].showMore();
            }
            if (this.refs["_loading"]) {
                this.refs["_loading"].hideLoading();
            }
        } else {
            this.setState({
                data: {
                    data: [],
                    showType: 1,
                    eid: eid,
                    tabid: tabid
                },
                more: {
                    moreUrl: moreUrl,
                    pageIndex: 1
                }
            });

            if (this.refs["_loading"]) {
                this.refs["_loading"].showLoading();
            }
        }

        this._loadData(params);
    }

    _loadData(params) {
        let url = params.url,
            moreUrl = params.moreUrl,
            hpid = params.hpid;

        fetch(url + "&now=" + new Date().getTime(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                "X-Requested-With": "XMLHttpRequest"
            },
            credentials: "include"
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    let _eid = data.eid;
                    let _tabid = data.tabid;

                    // 更新当前门户下元素缓存数据
                    let objStr = localStorage.getItem("hp_" + hpid);
                    if (objStr) {
                        let obj = JSON.parse(objStr);
                        obj["e_" + _eid + "_" + _tabid] = data;
                        localStorage.setItem("hp_" + hpid, JSON.stringify(obj));
                    }

                    if (this.state.data.eid == _eid && this.state.data.tabid == _tabid) {
                        this.setState({
                            data: data,
                            more: {
                                moreUrl: moreUrl,
                                pageIndex: 1
                            }
                        });
                    }

                    if (data.data.length > 0) {
                        this.refs["more"].showMore();
                    } else {
                        this.refs["more"].hideMore();
                    }
                    if (this.refs["_loading"]) {
                        this.refs["_loading"].hideLoading();
                    }
                });
            } else {
                console.log("Looks like the response wasn't perfect, got status", response.status);
            }
        }).catch(e => console.log("Fetch failed!", e));
    }

    loadMoreData() {
        this.refs["more"].showLoading();

        let hpid = this.props.hpid;
        let oldData = this.state.data.data;
        let moreUrl = this.state.more.moreUrl;
        let _moreUrl = moreUrl;
        let pageIndex = this.state.more.pageIndex + 1;
        if (moreUrl.indexOf("?") != -1) {
            moreUrl += "&pageIndex=" + pageIndex;
        } else {
            moreUrl += "?pageIndex=" + pageIndex;
        }
        fetch(moreUrl + "&now=" + new Date().getTime(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                "X-Requested-With": "XMLHttpRequest"
            },
            credentials: "include"
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    let _eid = data.eid;
                    let _tabid = data.tabid;

                    // 更新当前门户下元素缓存数据
                    let objStr = localStorage.getItem("hp_" + hpid);
                    let newData = oldData.concat(data.data);
                    if (objStr) {
                        let obj = JSON.parse(objStr);
                        obj["e_" + _eid + "_" + _tabid] = {
                            data: newData,
                            showType: data.showType,
                            eid: _eid,
                            tabid: _tabid
                        };
                        localStorage.setItem("hp_" + hpid, JSON.stringify(obj));
                    }

                    if (this.state.data.eid == _eid && this.state.data.tabid == _tabid) {
                        this.setState({
                            data: {
                                data: newData,
                                showType: data.showType,
                                eid: _eid,
                                tabid: _tabid
                            },
                            more: {
                                moreUrl: _moreUrl,
                                pageIndex: pageIndex
                            }
                        });
                    }

                    this.refs["more"].hideLoading();
                    if (data.data.length < 5) {
                        this.refs["more"].hideMore();
                    }
                });
            } else {
                console.log("Looks like the response wasn't perfect, got status", response.status);
            }
        }).catch(e => console.log("Fetch failed!", e));
    }

    getDatas() {
        let self = this;
        let showType = this.state.data.showType;

        if ("3" == showType) { //左图式
            let liHtml = [];
            if (this.state.data.data && this.state.data.data.length > 0) {
                liHtml = this.state.data.data.map(function (item, index) {
                    let ua = window.navigator.userAgent.toLowerCase();
                    //链接地址默认为空
                    let href = "javascript:void(0);";
                    if (ua.indexOf("e-mobile") != -1) {
                        href = "/docs/docs/DocDsp.jsp?id=" + item.docId;
                    } else if (ua.indexOf("mobile") != -1) {
                        href = "/mobile/plugin/2/view.jsp?detailid=" + item.docId;
                    }

                    let flagHtml = item.isRead == "true" ? "" : <div className="flag1"></div>;
                    let titleWidth = item.isRead == "true" ? {maxWidth: "100%"} : {};
                    let titleClass = item.summary && item.summary != "" ? "title" : "no-summary-title";

                    return (
                        <li key={index}
                            ref={"doc_" + item.docId}
                            className="clear left-img-list"
                            onTouchStart={ () => {
                                self.refs["doc_" + item.docId].style.backgroundColor = "#eee";
                            } }
                            onTouchEnd={ () => {
                                self.refs["doc_" + item.docId].style.backgroundColor = "#fff";
                            } }
                        >
                            <a href={href}>
                                <div className="left-img">
                                    <div style={{
                                        backgroundImage: "url(" + item.imgUrl.split("|")[0] + ")",
                                        backgroundSize: "100% 100%"
                                    }}/>
                                </div>
                                <div className="right-list">
                                    <div className="title-div">
                                        <div className={titleClass} style={titleWidth}>{item.docTitle}</div>
                                        {flagHtml}
                                    </div>
                                    <div className="summary-div">
                                        {item.summary}
                                    </div>
                                    <div className="info-div">
                                        <div className="clear">
                                            <div className="username">{item.creater}</div>
                                            <div className="date">{item.doclastmoddate}</div>
                                            <div className="time">{item.doclastmodtime}</div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </li>
                    );
                });
            }

            return (
                <div className="data">
                    <Loading ref="_loading"/>
                    <ul className="data-ul">
                        {liHtml}
                    </ul>
                </div>
            );
        } else if ("2" == showType) { // 上图式
            let liHtml = [];
            let imgHtml = [];
            if (this.state.data.data && this.state.data.data.length > 0) {
                liHtml = this.state.data.data.map(function (item, index) {
                    let ua = window.navigator.userAgent.toLowerCase();
                    //链接地址默认为空
                    let href = "javascript:void(0);";
                    if (ua.indexOf("e-mobile") != -1) {
                        href = "/docs/docs/DocDsp.jsp?id=" + item.docId;
                    } else if (ua.indexOf("mobile") != -1) {
                        href = "/mobile/plugin/2/view.jsp?detailid=" + item.docId;
                    }

                    let flagHtml = item.isRead == "true" ? "" : <div className="flag1"></div>;
                    let titleWidth = item.isRead == "true" ? {maxWidth: "100%"} : {};
                    let singleTitleCss = {};
                    // 定义列表只有标题样式
                    if (!item.summary && !item.creater && !item.doclastmoddate && !item.doclastmodtime) {
                        singleTitleCss = {
                            height: "30px",
                            lineHeight: "30px"
                        }
                    }
                    return (
                        <li key={index}
                            ref={"doc_" + item.docId}
                            onTouchStart={ () => {
                                self.refs["doc_" + item.docId].style.backgroundColor = "#eee";
                            } }
                            onTouchEnd={ () => {
                                self.refs["doc_" + item.docId].style.backgroundColor = "#fff";
                            } }
                        >
                            <a href={href}>
                                <div className="title-div" style={singleTitleCss}>
                                    <div className="title" style={titleWidth}>{item.docTitle}</div>
                                    {flagHtml}
                                </div>
                                <div className="info-div">
                                    <div className="clear">
                                        <div className="username">{item.creater}</div>
                                        <div className="date">{item.doclastmoddate}</div>
                                        <div className="time">{item.doclastmodtime}</div>
                                    </div>
                                </div>
                            </a>
                        </li>
                    );
                });

                this.state.data.data.map(function (item, index) {
                    let ua = window.navigator.userAgent.toLowerCase();
                    //链接地址默认为空
                    let href = "javascript:void(0);";
                    if (ua.indexOf("e-mobile") != -1) {
                        href = "/docs/docs/DocDsp.jsp?id=" + item.docId;
                    } else if (ua.indexOf("mobile") != -1) {
                        href = "/mobile/plugin/2/view.jsp?detailid=" + item.docId;
                    }
                    if (item.imgUrl.split("|")[0]) {
                        imgHtml.push(<div key={index}><a href={href}><img src={item.imgUrl.split("|")[0]} alt="" width="100%" height="auto"/></a></div>);
                    }
                });
            }

            return (
                <div className="data">
                    <Loading ref="_loading"/>
                    <Carousel autoplay="true" infinite="true">
                        {imgHtml}
                    </Carousel>
                    <ul className="data-ul">
                        {liHtml}
                    </ul>
                </div>
            );
        } else { // 列表式
            let liHtml = [];
            if (this.state.data.data && this.state.data.data.length > 0) {
                liHtml = this.state.data.data.map(function (item, index) {
                    let ua = window.navigator.userAgent.toLowerCase();
                    //链接地址默认为空
                    let href = "javascript:void(0);";
                    if (ua.indexOf("e-mobile") != -1) {
                        href = "/docs/docs/DocDsp.jsp?id=" + item.docId;
                    } else if (ua.indexOf("mobile") != -1) {
                        href = "/mobile/plugin/2/view.jsp?detailid=" + item.docId;
                    }

                    let flagHtml = item.isRead == "true" ? "" : <div className="flag1"></div>;
                    let titleWidth = item.isRead == "true" ? {maxWidth: "100%"} : {};
                    let singleTitleCss = {};
                    // 定义列表只有标题样式
                    if (!item.summary && !item.creater && !item.doclastmoddate && !item.doclastmodtime) {
                        singleTitleCss = {
                            height: "30px",
                            lineHeight: "30px"
                        }
                    }
                    return (
                        <li key={index}
                            ref={"doc_" + item.docId}
                            onTouchStart={ () => {
                                self.refs["doc_" + item.docId].style.backgroundColor = "#eee";
                            } }
                            onTouchEnd={ () => {
                                self.refs["doc_" + item.docId].style.backgroundColor = "#fff";
                            } }
                        >
                            <a href={href}>
                                <div className="title-div" style={singleTitleCss}>
                                    <div className="title" style={titleWidth}>{item.docTitle}</div>
                                    {flagHtml}
                                </div>
                                <div className="info-div">
                                    <div className="clear">
                                        <div className="username">{item.creater}</div>
                                        <div className="date">{item.doclastmoddate}</div>
                                        <div className="time">{item.doclastmodtime}</div>
                                    </div>
                                </div>
                            </a>
                        </li>
                    );

                });
            }

            return (
                <div className="data">
                    <Loading ref="_loading"/>
                    <ul className="data-ul">
                        {liHtml}
                    </ul>
                </div>
            );
        }
    }

    render() {
        let eid = this.state.data.eid;
        let idName = "item_" + eid;
        let tabid = this.state.data.tabid;

        return (
            <div id={idName}>
                <Header {...this.props}/>
                <div className="content">
                    <Tabs {...this.props} tabid={tabid} loadDataFun={this.loadData.bind(this)}/>
                    {this.getDatas()}
                    <More ref="more" {...this.props} loadMoreDataFun={this.loadMoreData.bind(this)}/>
                </div>
            </div>
        );
    }
}

module.exports = Doc;
