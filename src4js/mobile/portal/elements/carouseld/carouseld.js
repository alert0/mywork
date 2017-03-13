import React, {Component} from 'react';

import Header from './../../components/header';
import Loading from './../../components/loading';

import 'antd-mobile/lib/carousel/style';
import Carousel from 'antd-mobile/lib/carousel';

class Carouseld extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            eid: 0,
            tabid: 0
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
                data: [],
                eid: this.props.eid,
                tabid: 0
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
                data: [],
                eid: this.props.eid,
                tabid: 0
            });
        }
    }

    componentDidUpdate() {
        if (window.hpScroll) {
            window.hpScroll.refresh();
        }
    }

    loadData(params) {
        let hpid = params.hpid,
            eid = params.eid,
            tabid = params.tabid;

        let localHp = JSON.parse(localStorage.getItem("hp_" + hpid));
        // 若门户缓存和元素缓存都存在，先加载缓存，再去刷新数据
        if (localHp && localHp["e_" + eid + "_" + tabid]) {
            let localEle = localHp["e_" + eid + "_" + tabid];
            this.setState(localEle);

            if (this.refs["_loading"]) {
                this.refs["_loading"].hideLoading();
            }
        } else {
            this.setState({
                data: [],
                eid: eid,
                tabid: tabid
            });

            if (this.refs["_loading"]) {
                this.refs["_loading"].showLoading();
            }
        }

        this._loadData(params);
    }

    _loadData(params) {
        let url = params.url,
            hpid = params.hpid;

        // 手机客户端访问只能访问 mobile 目录下的接口
        url = url.replace(/^\/page\//, "/mobile/plugin/homepagemobile/");
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

                    if (this.state.eid == _eid && this.state.tabid == _tabid) {
                        this.setState(data);
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

    render() {
        let eid = this.state.eid;
        let idName = "item_" + eid;

        let imgHtml = "";
        if (this.state.data.length > 1) {
            let _imgHtml = this.state.data.map(function (item, index) {
                let ua = window.navigator.userAgent.toLowerCase();
                //链接地址默认为空
                let href = "javascript:void(0);";
                if (ua.indexOf("mobile") != -1 && item.linkUrl != "") {
                    href = item.linkUrl;
                }
                return <div key={index}>
                    <a href={href}><img src={item.imgUrl} alt="" width="100%" height="auto"/></a>
                </div>
            });
            imgHtml = <Carousel autoplay="true" infinite="true">{_imgHtml}</Carousel>
        } else if (this.state.data.length == 1) {
            let item = this.state.data[0];
            let ua = window.navigator.userAgent.toLowerCase();
            //链接地址默认为空
            let href = "javascript:void(0);";
            if (ua.indexOf("mobile") != -1 && item.linkUrl != "") {
                href = item.linkUrl;
            }
            imgHtml = <div><a href={href}><img src={item.imgUrl} alt="" width="100%" height="auto"/></a></div>
        }

        return (
            <div id={idName}>
                <Header {...this.props}/>
                <div className="content">
                    <div className="data">
                        <Loading ref="_loading"/>
                        {imgHtml}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Carouseld;
