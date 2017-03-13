import React, {Component} from 'react';

import Workflow from './elements/workflow/workflow.js';
import Doc from './elements/doc/doc.js';
import Custom from './elements/custom/custom.js';
import Carouseld from './elements/carouseld/carouseld.js';
import Charts from './elements/charts/charts.js';

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                hpid: 0,
                subCompanyId: 1,
                hpCss: "",
                areaElements: []
            }
        };

        window.hpRefresh = false;
    }

    componentWillMount() {
        let hpid = this.props.params.hpid;
        let subCompanyId = this.props.params.subCompanyId;
        this.loadData(hpid, subCompanyId, false);
    }

    componentWillReceiveProps(nextProps) {
        let hpid = nextProps.params.hpid;
        let subCompanyId = nextProps.params.subCompanyId;
        this.loadData(hpid, subCompanyId, false);
    }

    componentDidMount() {
        this.refreshPage();
    }

    componentDidUpdate() {
        this.refreshPage();
    }

    loadData(hpid, subCompanyId, isRefresh) {
        let date = new Date();
        localStorage.setItem("hp_" + hpid + "_LastRefreshDate", (date.getHours() > 9 ? date.getHours() : "0" + date.getHours()) + ":" + (date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()));

        let localHp = JSON.parse(localStorage.getItem("hp_" + hpid));
        if (!localHp) {
            this.setState({
                data: {
                    hpid: hpid,
                    subCompanyId: subCompanyId,
                    hpCss: "",
                    areaElements: []
                }
            });

            this._loadData(hpid, subCompanyId);
        } else {
            if (!isRefresh) {
                this.setState({
                    data: localHp.hpInfo
                });
            }

            this._loadData(hpid, subCompanyId);
        }
    }

    _loadData(hpid, subCompanyId) {
        //let url = "/homepagemobile/json/PageUtil" + hpid + ".json?hpid=" + hpid + "&subCompanyId=" + subCompanyId;
        //let url = "/page/interfaces/mobile/homepageInterface.jsp?hpid=" + hpid + "&subCompanyId=" + subCompanyId;
        let url = "/mobile/plugin/homepagemobile/interfaces/mobile/homepageInterface.jsp?hpid=" + hpid + "&subCompanyId=" + subCompanyId;

        fetch(url + "&" + new Date().getTime(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                "X-Requested-With": "XMLHttpRequest"
            },
            credentials: "include"
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    let _hpid = data.hpid;
                    if (_hpid) {
                        // 更新当前门户缓存
                        let objStr = localStorage.getItem("hp_" + _hpid);
                        if (!objStr) {
                            localStorage.setItem("hp_" + _hpid, JSON.stringify({hpInfo: data}));
                        } else {
                            let obj = JSON.parse(objStr);
                            obj["hpInfo"] = data;
                            localStorage.setItem("hp_" + _hpid, JSON.stringify(obj));
                        }

                        // 当前状态的门户是请求数据的门户则更新数据
                        let self = this;
                        setTimeout(function () {
                            if (self.state.data.hpid == _hpid && !window.hpRefresh) {
                                self.setState({
                                    data: data
                                });
                            }
                        }, 500);
                    }
                });
            } else {
                console.log("Looks like the response wasn't perfect, got status", response.status);
            }
        }).catch(e => console.log("Fetch failed!", e));
    }

    refreshPage() {
        let navbarHeight = document.getElementById("navbar-container").offsetHeight;
        document.getElementById("hpWrapper").style.top = navbarHeight + "px";

        let self = this;
        if (window.hpScroll) {
            window.hpScroll.destroy();
            window.hpScroll = null;
        }

        let pullDownEle = document.getElementById("pullDown");
        let pullDownOffset = pullDownEle.offsetHeight;
        let hpScroll = new iScroll("hpWrapper", {
            x: 0,
            y: -40,
            hScroll: false,
            vScroll: true,
            hScrollbar: false,
            vScrollbar: true,
            topOffset: pullDownOffset,
            onRefresh: function () {
                if (pullDownEle.className.match("loading")) {
                    pullDownEle.className = "";
                }
            },
            onScrollMove: function () {
                window.refresh = true;
                pullDownEle.style.visibility = "visible";
                if (this.y > 5 && !pullDownEle.className.match("flip")) {
                    pullDownEle.className = "flip";
                    pullDownEle.querySelector(".pullDownIcon").style.display = "block";
                    pullDownEle.querySelector(".pullDownLabel").innerHTML = "<p>松开立即刷新</p><p>最后更新时间：今天 " + localStorage.getItem("hp_" + self.state.data.hpid + "_LastRefreshDate") + "</p>";
                    this.minScrollY = 0;
                } else if (this.y < 5 && pullDownEle.className.match("flip")) {
                    pullDownEle.className = "";
                    pullDownEle.querySelector(".pullDownIcon").style.display = "block";
                    pullDownEle.querySelector(".pullDownLabel").innerHTML = "<p>下拉可以刷新</p><p>最后更新时间：今天 " + localStorage.getItem("hp_" + self.state.data.hpid + "_LastRefreshDate") + "</p>";
                    this.minScrollY = -pullDownOffset;
                }
            },
            onScrollEnd: function () {
                if (pullDownEle.className.match("flip")) {
                    pullDownEle.className = "loading";
                    pullDownEle.querySelector(".pullDownIcon").style.display = "none";
                    pullDownEle.querySelector(".pullDownLabel").innerHTML = "<div class=\"spinner\"> <div class=\"bounce1\"></div> <div class=\"bounce2\"></div> <div class=\"bounce3\"></div> </div>";

                    let hpid = self.state.data.hpid;
                    let subCompanyId = self.state.data.subCompanyId;
                    self.loadData(hpid, subCompanyId, true);
                } else {
                    pullDownEle.style.visibility = "hidden";
                    pullDownEle.querySelector(".pullDownIcon").style.display = "block";
                    pullDownEle.querySelector(".pullDownLabel").innerHTML = "<p>下拉可以刷新</p><p>最后更新时间：今天 " + localStorage.getItem("hp_" + self.state.data.hpid + "_LastRefreshDate") + "</p>";
                }
            },
            onTouchEnd: function () {
                window.hpRefresh = false;
            }
        });
        window.hpScroll = hpScroll;

        setTimeout(function () {
            window.hpScroll.refresh();
        }, 300);
    }

    render() {
        // 门户样式
        let hpCss = this.state.data.hpCss;
        document.getElementById("hpStyle").innerHTML = hpCss;

        let hpid = this.state.data.hpid;
        let elementHtml = this.state.data.areaElements.map(function (item, index) {
            let elementType;
            let eid = item.item.eid;
            let ebaseid = item.item.ebaseid;
            switch (ebaseid) {
                case "mobilePicture": //图片轮播
                    elementType =
                        <Carouseld hpid={hpid} eid={eid} item={item.item} header={item.header} tabs={item.tabs}/>;
                    break;
                case "29": //自定义
                    elementType =
                        <Custom hpid={hpid} eid={eid} item={item.item} header={item.header} tabs={item.tabs}/>;
                    break;
                case "7": //文档中心
                    elementType = <Doc hpid={hpid} eid={eid} item={item.item} header={item.header} tabs={item.tabs}/>;
                    break;
                case "8": //流程中心
                    elementType =
                        <Workflow hpid={hpid} eid={eid} item={item.item} header={item.header} tabs={item.tabs}/>;
                    break;
                case "reportForm": //图表
                    elementType =
                        <Charts hpid={hpid} eid={eid} item={item.item} header={item.header} tabs={item.tabs}/>;
                    break;
                default:
                    break;
            }

            return (
                <div key={index}
                     className="item"
                     data-eid={eid}
                     style={ item.item.ebaseid == "mobilePicture" ? {marginBottom: 0} : {}}
                >
                    {elementType}
                </div>
            )
        });

        let lastRefreshDate = localStorage.getItem("hp_" + this.state.data.hpid + "_LastRefreshDate");
        return (
            <div id="hpWrapper" ref="hpWrapper">
                <div id="hpScroller" ref="hpScroller">
                    <div id="pullDown">
                        <div className="pullDownIcon"></div>
                        <div className="pullDownLabel">
                            <p>下拉可以刷新</p>
                            <p>最后更新时间：今天 {lastRefreshDate}</p>
                        </div>
                    </div>
                    <div id="itemList">
                        {elementHtml}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Homepage;
