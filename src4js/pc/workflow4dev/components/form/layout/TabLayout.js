import MainLayout from './MainLayout'

import Immutable from 'immutable'
import {is} from 'immutable'

class TabLayout extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !is(this.props.mainData, nextProps.mainData)
                || !is(this.props.detailData, nextProps.detailData)
                || !is(this.props.variableArea, nextProps.variableArea)
                || !is(this.props.tab, nextProps.tab)
                || this.props.cellMark !== nextProps.cellMark
                || !is(this.props.params, nextProps.params)
                || this.props.conf.size !== nextProps.conf.size;
    }
    render() {
        const {actions,params,cellMark,tab,layout,conf,mainData,detailData,variableArea} = this.props;
        const style = conf.getIn(["cellInfo",`main_${cellMark}_stylejson`]);
        if(!style)
            return <div>Empty TabArea Style</div>

        let showid = 0;
        let tabArr = new Array();
        tab.map((v,k)=>{
            if(k.indexOf("order") === 0) {
                const arr = v?v.split(","):[];
                tabArr.push({
                    id:arr[0]?arr[0]:"",
                    name:arr[1]?arr[1]:""
                });
            }
            if(k === "defshow") {
                showid = v;
            }
        });
        if(variableArea.has(`tabarea_${cellMark}_showid`))
            showid = variableArea.get(`tabarea_${cellMark}_showid`);

        const tabAreaId = "tabarea_"+cellMark;
        return (
            <div className={tabAreaId}>
                <div className="tab_top">
                    <div className="tab_movebtn tab_turnleft" style={{display:"none"}}></div>
                    <div className="tab_head" style={{width:"100%"}}>
                        <div className="t_area xrepeat" 
                            style={{
                                backgroundImage:"url("+style.get("image_bg")+")",
                                width:"100%"
                            }}>
                            {
                                tabArr.map((v,k)=>{
                                    let tabArrInner = new Array();
                                    const sel = k===showid?"sel":"unsel";
                                    let middleStyle = {
                                        backgroundImage:"url('"+style.get(sel+"_bgmiddle")+"')",
                                        fontSize:style.get(sel+"_fontsize")+"px !important",
                                        color:style.get(sel+"_color")+" !important",
                                        fontFamily:style.get(sel+"_family")+" !important"
                                    };
                                    if(style && style.get(sel+"_bold") == "1")
                                        middleStyle["font-weight"] = "bold !important";
                                    if(style && style.get(sel+"_italic") == "1")
                                        middleStyle["font-style"] = "italic !important";
                                    tabArrInner.push(
                                        <div id={v.id} className={"t_"+sel} onClick={this.changeTab.bind(this,k)}>
                                            <div className={"t_"+sel+"_left norepeat"}
                                                style={{
                                                    backgroundImage:"url('"+style.get(sel+"_bgleft")+"')",
                                                    width:style.get(sel+"_bgleftwidth")+"px !important"
                                                }}></div>
                                            <div className={"t_"+sel+"_middle xrepeat lineheight30"} style={middleStyle}>
                                                <span>{v.name}</span>
                                            </div>
                                            <div className={"t_"+sel+"_right norepeat"}
                                                style={{
                                                    backgroundImage:"url('"+style.get(sel+"_bgright")+"')",
                                                    width:style.get(sel+"_bgrightwidth")+"px !important"
                                                }}></div>
                                        </div>
                                    );
                                    if(k!==tabArr.length-1) {
                                        tabArrInner.push(<div className="t_sep norepeat" style={{width:style.get("image_sepwidth")+"px !important"}}></div>);
                                    }
                                    return tabArrInner;
                                })
                            }
                        </div>
                    </div>
                    <div className="tab_movebtn tab_turnright" style={{display:"none"}}></div>
                </div>
                <div className="tab_bottom">
                    {
                        tabArr.map((v,k)=>{
                            const tabid = v.id;
                            return (
                                <div className="tab_content" id={tabid+"_content"} style={k===showid ? {} : {display:"none"}}>
                                    <MainLayout 
                                        actions={actions}
                                        params={params}
                                        symbol={tabid}
                                        layout={layout}
                                        conf={conf}
                                        mainData={mainData}
                                        detailData={detailData}  
                                        variableArea={variableArea} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
    changeTab(selectedTabId) {
        const {actions,cellMark} = this.props;
        actions.controlVariableArea({[`tabarea_${cellMark}_showid`]:selectedTabId});
    }
}

export default TabLayout