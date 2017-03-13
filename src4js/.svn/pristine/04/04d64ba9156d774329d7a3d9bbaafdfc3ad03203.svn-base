import React, {Component} from 'react';

import Header from './../../components/header';
import Tabs from './../../components/tabs';
import More from './../../components/more';
import Loading from './../../components/loading';

class Custom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                html: "",
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
                moreUrl: this.props.tabs[0].moreUrl,
                hpid: this.props.hpid,
                eid: this.props.eid,
                tabid: this.props.tabs[0].tabid
            };
            this.loadData(params);
        } else {
            this.setState({
                data: {
                    html: "",
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
                moreUrl: nextProps.tabs[0].moreUrl,
                hpid: nextProps.hpid,
                eid: nextProps.eid,
                tabid: nextProps.tabs[0].tabid
            };
            this.loadData(params);
        } else {
            this.setState({
                data: {
                    html: "",
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
        // 重新加载自定义页面 html
        this.refs["customArea"].innerHTML = this.state.data.html;

        if (window.hpScroll) {
            window.hpScroll.refresh();
        }
    }

    loadData(params) {
        let moreUrl = params.moreUrl,
            hpid = params.hpid,
            eid = params.eid,
            tabid = params.tabid;

        // 自定义元素根据是否存在 moreUrl 判断是否显示 more 链接
        if (moreUrl) {
            this.refs["more"].showMore();
        } else {
            this.refs["more"].hideMore();
        }
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

            if (this.refs["_loading"]) {
                this.refs["_loading"].hideLoading();
            }
        } else {
            this.setState({
                data: {
                    html: "",
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
            hpid = params.hpid,
            eid = params.eid,
            tabid = params.tabid;

        if (url.indexOf("?") != -1) {
            url += "&pageIndex=1";
        } else {
            url += "?pageIndex=1";
        }
        fetch(url + "&now=" + new Date().getTime(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                "X-Requested-With": "XMLHttpRequest"
            },
            credentials: "include"
        }).then((response) => {
            if (response.ok) {
                response.text().then((html) => {
                    // 更新当前门户下元素缓存数据
                    let objStr = localStorage.getItem("hp_" + hpid);
                    if (objStr) {
                        let obj = JSON.parse(objStr);
                        obj["e_" + eid + "_" + tabid] = {
                            html: html,
                            eid: eid,
                            tabid: tabid
                        };
                        localStorage.setItem("hp_" + hpid, JSON.stringify(obj));
                    }

                    if (this.state.more.moreUrl == moreUrl) {
                        this.setState({
                            data: {
                                html: html,
                                eid: eid,
                                tabid: tabid
                            },
                            more: {
                                moreUrl: moreUrl,
                                pageIndex: 1
                            }
                        });
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
        let eid = this.state.data.eid;
        let tabid = this.state.data.tabid;
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
                response.text().then((html) => {
                    // 更新当前门户下元素缓存数据
                    let objStr = localStorage.getItem("hp_" + hpid);
                    if (objStr) {
                        let obj = JSON.parse(objStr);
                        obj["e_" + eid + "_" + tabid] = {
                            html: html,
                            eid: eid,
                            tabid: tabid
                        };
                        localStorage.setItem("hp_" + hpid, JSON.stringify(obj));
                    }

                    if (this.state.more.moreUrl == _moreUrl) {
                        this.setState({
                            data: {
                                html: html,
                                eid: eid,
                                tabid: tabid
                            },
                            more: {
                                moreUrl: _moreUrl,
                                pageIndex: pageIndex
                            }
                        });
                    }

                    this.refs["more"].hideLoading();
                });
            } else {
                console.log("Looks like the response wasn't perfect, got status", response.status);
            }
        }).catch(e => console.log("Fetch failed!", e));
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
                    <div className="data">
                        <Loading ref="_loading"/>
                        <div ref="customArea" className="custom-area"></div>
                    </div>
                    <More ref="more" {...this.props} loadMoreDataFun={this.loadMoreData.bind(this)}/>
                </div>
            </div>
        );
    }
}

module.exports = Custom;
