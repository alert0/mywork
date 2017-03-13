import React, {Component} from 'react';

import Header from './../../components/header';
import Tabs from './../../components/tabs';
import More from './../../components/more';
import Loading from './../../components/loading';

class Workflow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                data: [],
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
                            eid: _eid,
                            tabid: _tabid
                        };
                        localStorage.setItem("hp_" + hpid, JSON.stringify(obj));
                    }

                    if (this.state.data.eid == _eid && this.state.data.tabid == _tabid) {
                        this.setState({
                            data: {
                                data: newData,
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

        let liHtml = "";
        if (this.state.data.data && this.state.data.data.length > 0) {
            liHtml = this.state.data.data.map(function (item, index) {
                let ua = window.navigator.userAgent.toLowerCase();
                //链接地址默认为空
                let href = "javascript:void(0);";
                if (ua.indexOf("e-mobile") != -1) {
                    href = "/workflow/request/ViewRequest.jsp?requestid=" + item.requestid;
                } else if (ua.indexOf("mobile") != -1) {
                    href = "/mobile/plugin/1/view.jsp?detailid=" + item.requestid;
                }

                let flagHtml = "";
                let titleHtml = "";
                let importantleveHtml = "";

                if (item.flagType == 1) { // 未读
                    flagHtml = <div className="flag1"></div>;
                } else if (item.flagType == 2) { // 反馈
                    flagHtml = <div className="flag2"></div>;
                } else if (item.flagType == 3) { // 超时
                    flagHtml = <div className="flag3"></div>;
                }

                if (item.importantleve) {
                    titleHtml = <span className="title" style={{maxWidth: "85%"}}>{item.requestname}</span>;
                    importantleveHtml = <span className="importantleve">{item.importantleve}</span>;
                } else {
                    titleHtml = <span className="title" style={{maxWidth: "95%"}}>{item.requestname}</span>;
                }
                return (
                    <li key={index}
                        ref={"wf_" + item.requestid}
                        onTouchStart={ () => {
                            self.refs["wf_" + item.requestid].style.backgroundColor = "#eee";
                        } }
                        onTouchEnd={ () => {
                            self.refs["wf_" + item.requestid].style.backgroundColor = "#fff";
                        } }
                    >
                        <a href={href}>
                            <div className="title-div">
                                {titleHtml}
                                {flagHtml}
                                {importantleveHtml}
                            </div>
                            <div className="info-div">
                                <div className="clear">
                                    <div className="username">{item.creater}</div>
                                    <div className="date">{item.receivedate}</div>
                                    <div className="time">{item.receivetime}</div>
                                </div>
                                <div className="clear">
                                    <div className="dept">{item.createrDept}</div>
                                    <div className="createdate">{item.createdate}</div>
                                </div>
                                <div className="clear">
                                    <div className="workflowtype">{item.workflowtype}</div>
                                    <div className="workflowcode">{item.workflowcode}</div>
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

module.exports = Workflow;


