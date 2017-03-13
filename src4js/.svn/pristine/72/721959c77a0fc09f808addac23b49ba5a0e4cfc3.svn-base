import React, {Component} from 'react';

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
    }

    componentWillMount() {
        let hpid = this.props.params.hpid;
        let subCompanyId = this.props.params.subCompanyId;
        this.loadData(hpid, subCompanyId);
    }

    componentDidMount() {
    }

    loadData(hpid, subCompanyId) {
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
                    this.setState({
                        data: data
                    });
                });
            } else {
                console.log("Looks like the response wasn't perfect, got status", response.status);
            }
        }).catch(e => console.log("Fetch failed!", e));
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
                >
                    {elementType}
                </div>
            )
        });

        return (
            <div id="homepage-container">
                <div id="itemList">
                    {elementHtml}
                </div>
            </div>
        );
    }
}

module.exports = HomepageSetting;
