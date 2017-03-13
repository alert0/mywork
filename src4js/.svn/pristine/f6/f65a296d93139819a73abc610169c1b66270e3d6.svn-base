import React, {Component} from 'react';

import Dragula from 'react-dragula';

import Workflow from './elements/workflow/workflow.js';
import Doc from './elements/doc/doc.js';
import Custom from './elements/custom/custom.js';
import Carouseld from './elements/carouseld/carouseld.js';
import Charts from './elements/charts/charts.js';

class HomepageSetting extends Component {
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

        // 用于标识门户元素是否排序过，若排序过，则清除数据刷新
        window.hpIsSort = false;
    }

    componentWillMount() {
        let hpid = this.props.params.hpid;
        let subCompanyId = this.props.params.subCompanyId;
        this.loadData(hpid, subCompanyId, null);
    }

    componentDidMount() {
        // 提供外部调用 reloadHomepage 方法刷新门户方法
        window.reloadHomepage = this.reloadHomepage.bind(this);
        let self = this;
        let container = this.refs["drag-container"];
        Dragula([container]).on("out", function () {
            window.hpIsSort = true;
            let items = document.getElementsByClassName("item");
            let eidArr = [];
            for (let i = 0; i < items.length; i++) {
                let eid = items[i].getAttribute("data-eid");
                eidArr.push(eid);
            }

            let eids = eidArr.join(",");

            let hpid = self.state.data.hpid;
            let subCompanyId = self.state.data.subCompanyId;

            MoveEleData(hpid, subCompanyId, eids);
        });
    }

    loadData(hpid, subCompanyId, callbackFuc) {
        //let url = "/homepagemobile/json/PageUtil" + hpid + ".json?hpid=" + hpid + "&subCompanyId=" + subCompanyId;
        let url = "/page/interfaces/mobile/homepageInterface.jsp?hpid=" + hpid + "&subCompanyId=" + subCompanyId;

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
                    // 更新当前门户缓存
                    let objStr = localStorage.getItem("hp_" + _hpid);
                    if (!objStr) {
                        localStorage.setItem("hp_" + _hpid, JSON.stringify({hpInfo: data}));
                    } else {
                        let obj = JSON.parse(objStr);
                        obj["hpInfo"] = data;
                        localStorage.setItem("hp_" + _hpid, JSON.stringify(obj));
                    }

                    this.setState({
                        data: data
                    });

                    if (callbackFuc && typeof callbackFuc === "function") {
                        callbackFuc();
                    }
                });
            } else {
                console.log("Looks like the response wasn't perfect, got status", response.status);
            }
        }).catch(e => console.log("Fetch failed!", e));
    }

    reloadHomepage(hpid, subCompanyId, callbackFuc) {
        if (window.hpIsSort) {
            window.hpIsSort = false;

            this.setState({
                data: {
                    hpid: hpid,
                    subCompanyId: subCompanyId,
                    hpCss: "",
                    areaElements: []
                }
            });
        }

        let localHp = JSON.parse(localStorage.getItem("hp_" + hpid));
        if (localHp) {
            this.setState({
                data: localHp.hpInfo
            });
        }
        this.loadData(hpid, subCompanyId, callbackFuc);
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
                        <Carouseld ref={"item_" + eid} hpid={hpid} eid={eid} item={item.item} header={item.header}
                                   tabs={item.tabs}/>;
                    break;
                case "29": //自定义
                    elementType =
                        <Custom ref={"item_" + eid} hpid={hpid} eid={eid} item={item.item} header={item.header}
                                tabs={item.tabs}/>;
                    break;
                case "7": //文档中心
                    elementType = <Doc ref={"item_" + eid} hpid={hpid} eid={eid} item={item.item} header={item.header}
                                       tabs={item.tabs}/>;
                    break;
                case "8": //流程中心
                    elementType =
                        <Workflow ref={"item_" + eid} hpid={hpid} eid={eid} item={item.item} header={item.header}
                                  tabs={item.tabs}/>;
                    break;
                case "reportForm": //图表
                    elementType =
                        <Charts ref={"item_" + eid} hpid={hpid} eid={eid} item={item.item} header={item.header}
                                tabs={item.tabs}/>;
                    break;
                default:
                    break;
            }

            return (
                <div key={index}
                     className="item"
                     data-eid={eid}
                     onClick={(e) => {
                         e.stopPropagation();
                         onSetting(eid, ebaseid);
                     }}
                >
                    {elementType}
                    <div className="item-close"
                         title="删除元素"
                         onClick={ (e) => {
                             e.stopPropagation();
                             onDel(eid);
                         }}
                    ></div>
                </div>
            )
        });

        return (
            <div id="homepage-container">
                <div id="itemList" ref="drag-container">
                    {elementHtml}
                </div>
            </div>
        );
    }
}

module.exports = HomepageSetting;
