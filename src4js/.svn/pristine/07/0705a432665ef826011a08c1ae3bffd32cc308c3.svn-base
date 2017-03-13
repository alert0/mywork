import React, {Component} from 'react';

import Header from './../../components/header';
import Tabs from './../../components/tabs';
import Loading from './../../components/loading';

import ReactHighcharts from 'react-highcharts';

class Charts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
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
                data: {},
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
                data: {},
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
                data: {},
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
        let tabid = this.state.tabid;

        let type = this.state.data.type;
        // column(柱状图), line(线形图), area(面积图), bar(条形图), pie(饼图设置innerSize: 0, 圆环图设置innerSize: 60)
        let _type = {
                "1": "column",
                "3": "line",
                "4": "area",
                "5": "bar",
                "6": "pie",
                "8": "pie"
            }[type] || "column";
        let innerSize = "8" === type ? 60 : 0; // 将饼图设置为圆环图的参数
        let height = this.state.data.height;
        let title = this.state.data.title;
        let dot = this.state.data.dot;
        let categories = this.state.data.categories;
        let series = this.state.data.series;
        let reactHighcharts = "";
        if (type && series) {
            let seriesArr = [];
            let seriesItem;
            let dataArr = [];
            // data 字符串转为数字类型
            if ("6" === type || "8" === type) {
                dataArr = series["data"];
                for(let j=0; j < dataArr.length; j++){
                    let dataItem = dataArr[j];
                    dataItem[1] = parseFloat(dataItem[1]);
                }
                seriesArr.push(series);
            } else {
                for(let i=0; i < series.length; i++) {
                    seriesItem = series[i];
                    dataArr = seriesItem["data"];
                    for(let j=0; j < dataArr.length; j++){
                        dataArr[j] = parseFloat(dataArr[j]);
                    }
                    seriesArr.push(seriesItem);
                }
            }
            reactHighcharts = <ReactHighcharts config={{
                chart: {
                    type: _type,
                    height: height
                },
                title: {
                    text: title,
                    style: {fontSize: "14px", fontFamily: "Microsoft YaHei", color: "#58657b"}
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: categories,
                    labels: {style: {fontSize: "12px", fontFamily: "Microsoft YaHei", color: "#58657b"}}
                },
                yAxis: {
                    title: {text: ""}
                },
                legend: {
                    itemStyle: {fontSize: "12px", fontFamily: "Microsoft YaHei", color: "#58657b"}
                },
                tooltip: {
                    style: {fontSize: "12px", fontFamily: "Microsoft YaHei", color: "#58657b"},
                    pointFormat: "{series.name}: <b>{point.y:." + dot + "f}</b>"
                },
                plotOptions: {
                    series: {
                        animation: false
                    },
                    pie: {
                        allowPointSelect: true,
                        dataLabels: {
                            enabled: true,
                            format: "{point.y:." + dot + "f}"
                        },
                        showInLegend: true,
                        innerSize: innerSize
                    }
                },
                series: seriesArr
            }}></ReactHighcharts>
        }

        return (
            <div id={idName}>
                <Header {...this.props}/>
                <div className="content">
                    <Tabs {...this.props} tabid={tabid} loadDataFun={this.loadData.bind(this)}/>
                    <div className="data">
                        <Loading ref="_loading"/>
                        {reactHighcharts}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Charts;
