import {
	Component
} from 'react';
import {
	Table,
	Row,
	Col,
	Card,
	Carousel,
	Select,
	Icon,
	Input,
	Button,
	Tabs,
	Spin
} from 'antd';
import {
	formatData,
	loadRemind
} from '../../../util/formatdata';
const Option = Select.Option;
import classNames from 'classnames';
const InputGroup = Input.Group;
const TabPane = Tabs.TabPane;

export class WorkFlow extends Component {
	componentDidMount() {
		const esetting = this.props.esetting;
		if (esetting.scolltype) {
			loadMarqueeAttrs(this.props.eid, esetting.scolltype, this.props.data.tabsetting.height);
		}
	}
	render() {
		let html = <div></div>;
		const data = this.props.data;
		const list = data.data;
		const esetting = this.props.esetting;
		if (!_isEmptyObject(list)) {
			html = <Table columns={formatData(list[0], esetting)} showHeader={false} pagination={false} dataSource={list} size="small" />
			if (esetting.scolltype) {
				html = <marquee id={`MARQUEE_${this.props.eid}`}>
                       {html}
                    </marquee>
			}
		}
		return html;
	}
}
//微博动态元素
export const BlogStatus = ({
	list,
	esetting
}) => <div>{list.length !== 0 ? <Table columns={formatData(list[0], esetting)} showHeader={false} pagination={false} dataSource={list} size="small"/> : null}</div>


const SearchInput = React.createClass({
	getInitialState() {
		return {
			value: '',
			focus: false,
		};
	},
	handleInputChange(e) {
		this.setState({
			value: e.target.value,
		});
	},
	handleFocusBlur(e) {
		this.setState({
			focus: e.target === document.activeElement,
		});
	},
	handleSearch() {
		if (this.props.onSearch) {
			this.props.onSearch(this.state.value);
		}
	},
	render() {
		const {
			style,
			size,
			placeholder
		} = this.props;
		const btnCls = classNames({
			'ant-search-btn': true,
			'ant-search-btn-noempty': !!this.state.value.trim(),
		});
		const searchCls = classNames({
			'ant-search-input': true,
			'ant-search-input-focus': this.state.focus,
		});
		return (
			<div className="ant-search-input-wrapper" style={style}>
        <InputGroup className={searchCls}>
          <Input placeholder={placeholder} value={this.state.value} onChange={this.handleInputChange}
            onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch}
          />
          <div className="ant-input-group-wrap">
            <Button icon="search" className={btnCls} size={size} onClick={this.handleSearch} />
          </div>
        </InputGroup>
      </div>
		);
	},
});

//我的邮件
export const Mail = ({
	currTab,
	list,
	esetting,
	olist
}) => {
	const opershow = esetting.opershow;
	let operHtml = null;
	if (eval(opershow) && currTab === 'unread') {
		operHtml = <div className="mail-sparator"><font className="mail-sparator-font">邮件服务器上的新邮件:&nbsp;{olist.map(item=> <span>{item.name}({item.number})</span>)}&nbsp;<a href="javascript:void(0);" onClick={openLinkUrl.bind(this,"/email/new/MailFrame.jsp?" + new Date().getTime())}>进入我的邮件收取</a></font></div>;
	}
	return <div>
			{list.length !== 0 ? <Table columns={formatData(list[0], esetting)} showHeader={false} pagination={false} dataSource={list} size="small"/> : null}
			{operHtml}
          </div>
}



//天气元素
export const Weather = ({
	eid,
	data,
	esetting
}) => {
	const width = esetting.width;
	const autoScroll = esetting.autoScroll;
	const tabStyle = {
		overflow: 'hidden',
		backgroundColor: '#FFFFFF',
		width: '100%',
		tableLayout: 'fixed',
		textAlign: 'center'
	};
	var trHtml = <td width="*" align="top">
       			<span height='20' style={{paddingTop:'5px'}}>
				<img src='/images/icon_wev8.gif'/>&nbsp;&nbsp; 请确认服务器可以访问Google.com
				</span>
			</td>
	if (data.length !== 0) {
		let tdHtml = data.map((item, i) => <td width="80" style={{textAlign:'center'}}>
              <div className="wetCityName" style={{height:'20px'}}>{item.city}
              </div>
              <div className="wetCityName" id="curConditionDiv" style={{width:'80px',cursor:'pointer'}}>
                <p title={item.weather}>{item.weather}</p></div>
              <div style={{width: '80px',bottom:'10px'}}>
                {item.img === '' ? null : <img src={item.img} title={item.weather}/>}
              </div>
              <br/>{item.temperature}</td>);

		var wHtml = <table style={{textAlign:'center'}} cellpadding="0" cellspace="0" border="0">
	                <tbody>
	                  <tr>
	                    <td id={`weather_${eid}_1`} valign="top" style={{float: 'left'}}>
	                      <table>
	                        <tbody>
	                          <tr>
	                          	{tdHtml}
	           					</tr>
	                        </tbody>
	                      </table>
	                    </td>
	                    <td id={`weather_${eid}_2`} valign="top"></td>
	                  </tr>
	                </tbody>
	              </table>;
		if (autoScroll === '1') {
			wHtml = <marquee direction="left" scrollamount="2" onMouseOver={stop()} onMouseOut={start()}>
					{wHtml}
				</marquee>
		}
		trHtml = <tr>
			      <td valign="middle" style={{verticalAlign:'middle',width:'35px'}}>
			        <div id={`weatherback_${eid}`} style={{cursor:'hand'}} className="" onClick={backWeatherMarquee(eid)}></div>
			      </td>
			      <td style={{textAlign:'center'}}>
			        <div id={`weather_${eid}`} style={{textAlign:'center'}}>
			          <div id={`weather_${eid}_0`} style={{overflow:'hidden',width:width+'px'}}>
			           	{wHtml}
			          </div>
			        </div>
			      </td>
			      <td valign="middle" style={{verticalAlign:'middle',width:'35px'}}>
			        <div id={`weathernext_${eid}`} className="" style={{cursor:'hand'}} onClick={nextWeatherMarquee(eid)}></div>
			      </td>
			    </tr>;
	}
	return <table id={`weatherTable_${eid}`} style={tabStyle} onresize="">
			  <tbody>
			  {trHtml}
			  </tbody>
			</table>
}

function backWeatherMarquee(eid) {
	$("weather_" + eid + "_0").attr("scrollLeft", parseInt($("weather_" + eid + "_0").attr("scrollLeft")) - 75);
}

function start() {}

function stop() {}

function nextWeatherMarquee(eid) {
	$("weather_" + eid + "_0").attr("scrollLeft", parseInt($("weather_" + eid + "_0").attr("scrollLeft")) + 75);
}



//视频元素
export const Video = ({
	eid,
	data
}) => {
	let isie = true; //eval(data.isie)
	let height = data.height;
	let width = data.width;
	let quality = data.quality;
	let fullScreen = data.fullScreen;
	let url = data.url;
	let isAutoPlay = data.autoPlay === 'on';
	let html = isie ? <object id={`videoPlayer_${eid}`} height={height} width="100%" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">
		<param value="/page/element/Video/resource/js/player.swf" name="movie" />
		<param value="#FFFFFF" name="bgcolor" />
		<param value={quality} name="quality" />
		<param value={isAutoPlay} name="allowfullscreen" />
		<param value="always" name="allowscriptaccess" />
		<param name="wmode" value="transparent" />
		<param value={`file=${url}&autostart=${isAutoPlay}`} name="flashvars" />
		<embed src={`/page/element/Video/resource/js/player.swf?file=${url}&autostart=${isAutoPlay}`} mce_src="flash/top.swf"  wmode="transparent" menu="false" quality="high" width="100%" height={height} allowscriptaccess="sameDomain" type="application/x-shockwave-flash"  
		         pluginspage="http://www.macromedia.com/go/getflashplayer" />
		</object> : <video src={url} style={{width:'100%'}} height={height} autoplay={isAutoPlay ? 'autoplay':''} controls="controls"></video>
	return <div id={`video_play_${eid}`} style={{width:'100%',height:height}}>
		{html}
	</div>
}



//任务元素
export class Task extends Component {
	render() {
		const data = this.props.data;
		const esetting = this.props.esetting;
		const display = esetting.display;
		const list = data.data;
		const nlist = new Array;
		list.map(function(item) {
			let i = 0;
			var obj = new Object;
			for (var k in item) {
				if (display[i] === '1') {
					obj[k] = item[k];
				}
				i += 1;
			}
			nlist.push(obj);
		});
		return <Table columns={formatData(nlist[0], esetting)} pagination={false} dataSource={nlist} size="small"/>
	}
}



//股票元素
export const Stock = (props) => {
	const list = props.data;
	const esetting = props.esetting;
	let html = list.map(item => <div>
      <a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl,esetting.linkmode)}>
        <img style={{ width: esetting.width, height: esetting.height }} src={item.imgUrl}  border='0'/>
      </a>
    </div>);
	return <div style={{textAlign:'center'}}>{html}</div>
}



//幻灯片元素
export class Slide extends Component {
	componentDidMount() {
		const eid = this.props.eid;
		const esetting = this.props.esetting;
		const iconImgList = esetting.iconImgList;
		const iconImg_overList = esetting.iconImg_overList;
		const values = esetting.values;
		if (!_isEmptyObject(values)) {
			loadSlideCss(eid, iconImgList, iconImg_overList, values);
		}
	}
	render() {
		const eid = this.props.eid;
		const list = this.props.data;
		const esetting = this.props.esetting;
		const values = esetting.values;
		const sposition = _isEmptyObject(values) ? '0' : values['slide_t_position'];
		var sdStyle = {
			background: 'url(\"\") no-repeat',
			cursor: 'pointer'
		}
		var scStyle = {
			cursor: 'pointer'
		};
		let imgHtml = list.map((item, i) => <div className="slideDiv" data-index={i} alt={`${item.title}...`} style={sdStyle}>
	           		 <img width="100%" height="100%" onClick={openLinkUrl.bind(this,item.linkUrl,'3')} src={item.url}/>
	            <div className="slideDiv" onClick={openLinkUrl.bind(this,item.linkUrl,'3')} style={scStyle}></div>
	          </div>);
		let html = null;
		switch (sposition) {
			case '1':
				html = <tbody>
							<colgroup><col width="150px"/><col width="100%"/></colgroup>
							<tr>
								<td style={{width:'150px'}}>
									<div className="slideTitle">
										<div className="slideTitleFloat"></div>
										<div className="slideTitleNavContainer"></div>				
									</div>
								</td>
								<td  width="*">
									<div  className="slideContinar" style={scStyle}>
										{imgHtml}
									</div>
								</td>
							</tr>
						</tbody>
				break;
			case '2':
				html = <tbody>
						<colgroup>
							<col width="100%"/>
							<col width="150px"/>
						</colgroup>
						<tr>
							<td width="*">
								<div  className="slideContinar" style={scStyle}>
									{imgHtml}
								</div>
							</td>
							<td style={{width:'150px'}}>
								<div className="slideTitle">
									<div className="slideTitleFloat"></div>
									<div className="slideTitleNavContainer"></div>				
								</div>
							</td>
						</tr>
					</tbody>
				break;
			default:
				html = <tbody>
				    <tr>
				      <td>
				        <div className="slideContinar" style={scStyle}>
				        	{imgHtml}
				        </div>
				      </td>
				    </tr>
				    <tr>
				      <td>
				        <div className="slideTitle">
				          <div className="slideTitleFloat"></div>
				          <div className="slideTitleNavContainer"></div>
				        </div>
				      </td>
				    </tr>
				  </tbody>
				break;
		}
		return <table style={{width:'100%',height:'165px',tableLayout: 'fixed',borderSpacing:0}} id={`slideArea_${eid}`} border="0" >
	  			{html}
			</table>
	}
}

//幻灯片播放图片效果
const loadSlideCss = (eid, iconImgList, iconImg_overList, values) => {
	$('#slideArea_' + eid + ' .slideContinar').cycle({ //turnUp   //fade  //uncover
		fx: values['slide_t_changeStyle'], //blindX     * blindY    * blindZ    * cover    * curtainX    * curtainY    * fade    * fadeZoom    * growX    * growY    * none   * scrollUp    * scrollDown    * scrollLeft    * scrollRight    * scrollHorz    * scrollVert    * shuffle    * slideX    * lideY   * toss    * turnUp    * turnDown    * turnLeft    * turnRight    * uncover    * wipe    * zoom*/
		timeout: s2Int(values['slide_t_AutoChangeTime']),
		pager: '#slideArea_' + eid + ' .slideTitleNavContainer',
		pagerAnchorBuilder: pagerFactory,
		before: function(currSlideElement, nextSlideElement, options, forwardFlag) {
			var nextIndex = $(nextSlideElement).attr("data-index");
			var slidnavtitleArray = $("#slideArea_" + eid + " .slidnavtitle");
			var newTop = 0;
			var newLeft = 0;

			if (slidnavtitleArray.length != 0) {
				var nextSlidnavtitle = $($("#slideArea_" + eid + " .slidnavtitle")[nextIndex]);
				newTop = nextSlidnavtitle.position().top;
				if (values['slide_t_position'] === '2') {
					newLeft = nextSlidnavtitle.position().right;
				} else {
					newLeft = nextSlidnavtitle.position().left;
				}
			}
			var topvalue = values['slide_t_position'] === '3' ? newTop - 10 : newTop;
			if (values['slide_t_position'] === '2') {
				$("#slideArea_" + eid + " .slideTitleFloat").css({
					"display": "block",
					"top": topvalue,
					"right": newLeft,
					"background": "url(" + iconImg_overList[nextIndex] + ") no-repeat"
				});
			} else {
				$("#slideArea_" + eid + " .slideTitleFloat").css({
					"display": "block",
					"top": topvalue,
					"left": newLeft,
					"background": "url(" + iconImg_overList[nextIndex] + ") no-repeat"
				});
			}
		},
		fit: 1,
		width: '100%',
		height: '100%'
	});

	$('#slideArea_' + eid + '  .slideContinar').addClass("slideritem");
	$('#slideArea_' + eid + '  .slideContinar').css("width", "100%");
	$('#slideArea_' + eid + '  .slideContinar').css("overflow", "hidden");

	$('#content_view_id_' + eid).css("overflow", "hidden");

	function pagerFactory(idx, slide) {

		if (values['slide_t_position'] === '3') {
			var s = idx > 3 ? ' style="display:true"' : '';
		} else {}
		return '<div ' + s + ' class="slidnavtitle"  style="background:url(' + iconImgList[idx] + ') no-repeat;">&nbsp;</div>';
	};

	if (values['slide_t_position'] === '3') {
		$("#slideArea_" + eid).find(".slideTitleNavContainer").css({
			"margin": "0 auto"
		});
		$("#slideArea_" + eid + "   .slideTitleFloat").css({
			"margin": "0 auto",
			"top": 10 + Math.round($(".slideTitleFloat").offset().top) + "px"
		});
	}

	$('#slideArea_' + eid + '  .slideTitle').css("z-index", "1001");
	$('#slideArea_' + eid + '  .slideTitle').css("position", "relative");
	if (values['slide_t_position'] === '1') {
		$('#slideArea_' + eid + '  .slideTitle').css("width", "150px");
		$('#slideArea_' + eid + '  .slideTitle').css("float", "left");
	}
	if (values['slide_t_position'] === '2') {
		$('#slideArea_' + eid + '  .slideTitle').css("width", "150px");
		$('#slideArea_' + eid + '  .slideTitle').css("float", "right");
	}

	if (values['slide_t_position'] === '3') {
		$('#slideArea_' + eid + '  .slideTitle').css("height", "40px");
		$('#slideArea_' + eid + '  .slideTitle').css("padding-top", "10px");
		$('#slideArea_' + eid + '  .slideTitle').css("text-align", "center");
	}

	var slidnavtitle = $('#slideArea_' + eid + '  .slideTitle  .slidnavtitle');
	slidnavtitle.css("cursor", "pointer");
	if (values['slide_t_position'] === '3') {
		slidnavtitle.css("margin-right", "5px");
		slidnavtitle.css("height", "40px");
		slidnavtitle.css("width", "75px");
		slidnavtitle.css("float", "left");
	} else {
		slidnavtitle.css("height", "40px");
	}

	var slidnavtitle = $('#slideArea_' + eid + '  .slideTitleFloat');
	slidnavtitle.css("position", "absolute");
	slidnavtitle.css("display", "none");

	if (values['slide_t_position'] === '3') {
		slidnavtitle.css("height", "40px");
		slidnavtitle.css("width", "79px");
	} else {
		slidnavtitle.css("height", "40px");
		slidnavtitle.css("width", "165px");
	}
	var slideContinar = $('#slideArea_' + eid + '  .slideContinar');
	slideContinar.css("padding", "0");
	slideContinar.css("overflow", "hidden");
	slideContinar.css("table-layout", "fixed");
	slideContinar.css("width", "auto");
	slideContinar.css("margin", "0");

	if (values['slide_t_position'] === '3') {
		slideContinar.css("height", "220px");
	} else {
		slideContinar.css("height", "160px");
	}
	var slideTitleNavContainer = $("#slideArea_" + eid).find(".slideTitleNavContainer");
	if (values['slide_t_position'] === '3') {
		slideTitleNavContainer.css("display", "inline-block");
		slideTitleNavContainer.css("_display", "block");
	}
}

//搜索元素
export const SearchEngine = ({
	eid,
	data
}) => <div id={`searchengine_${eid}`} style={{paddingTop:'10px'}}>
			<SearchInput placeholder="请输入您要搜索的内容" onSearch={value => window.open(data.url+'&keyword='+value)} style={{ width: 300 }}/>
		</div>



//图表元素
export class ReportForm extends Component {
	componentDidMount() {
		//加载图标
		this.checkonLoad(this.props.eid, this.props.data);
	}
	checkonLoad(eid, data) {
		try {
			var container = $("#chartarea_" + eid);
			container.css("width", $("#reportformchart_" + eid).width() - 20);
			container.css("height", $("#reportformchart_" + eid).height() - 20);
			container.css("overflow", "hidden");
			generatorSimpechart(eid, data);
		} catch (e) {
			setTimeout(() => {
				this.checkonLoad.bind(this, eid, data);
			}, 500);
		}
	}
	render() {
		const eid = this.props.eid;
		const data = this.props.data;
		return (<div style={{width:data.width,height:data.height,margin:'0 auto'}} id={`reportformchart_${eid}`}>
                  <div id={`chartarea_${eid}`}></div>  
           </div>);
	}
}


//生成图表
const generatorSimpechart = (eid, chartdatas) => {
	var charttype = chartdatas.type;
	var dot = chartdatas.dot;
	var categorys = chartdatas.categories;
	var data = chartdatas.data;
	if ((categorys !== undefined && categorys.length === 0) || (data !== undefined && data.length === 0) || (charttype === '11' && data !== undefined && data.startval === undefined)) {
		var remindinfo = $("<div class='remindicon'>暂无数据!</div>");
		remindinfo.css("height", $("#chartarea_" + eid).height() + 'px');
		remindinfo.css("width", $("#chartarea_" + eid).width() + 'px');
		$("#chartarea_" + eid).append(remindinfo);
		return;
	}
	if (charttype === '11') {
		generatorGauge(eid, chartdatas);
		return;
	}
	if (charttype === '6' || charttype === '7' || charttype === '8') {
		generatorPieChart(eid, chartdatas);
		return;
	}

	var ctype = 'column';
	var is3d = false;
	switch (charttype) {
		case "1":
			ctype = 'column';
			break;
		case "2":
			ctype = 'column';
			is3d = true;
			break;
		case "3":
			ctype = 'line';
			break;
		case "4":
			ctype = 'area';
			break;
		case "5":
			ctype = 'bar';
			break;
	}
	//处理数据
	var series = chartdatas.series;
	for (var i = 0; i < series.length; i++) {
		var sdata = series[i].data;
		for (var j = 0; j < sdata.length; j++) {
			sdata[j] = parseFloat(sdata[j]);
		}
	}
	var chartitem = $("#chartarea_" + eid).highcharts({
		chart: {
			type: ctype,
			options3d: {
				enabled: is3d,
				alpha: 15,
				beta: 15,
				viewDistance: 25,
				depth: 40
			}
		},
		title: {
			text: ''
		},
		subtitle: {
			text: ''
		},
		xAxis: {
			categories: categorys,
			labels: {
				style: {
					font: '12px 微软雅黑'
				}
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: ''
			}
		},
		legend: {
			itemStyle: {
				fontFamily: "微软雅黑",
				fontSize: "12px"
			}
		},
		tooltip: {
			style: {
				fontFamily: '微软雅黑',
				fontSize: "12px"
			},
			pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				'<td style="padding:0"><b>{point.y:.' + dot + 'f}</b></td></tr>'
		},
		plotOptions: {
			series: {
				dataLabels: {
					enabled: false,
					formatter: function() {
						return Highcharts.numberFormat(this.point.y, ~~(dot || "0"));
					}
				}
			},
			column: {
				pointPadding: 0.2,
				borderWidth: 0,
				depth: 25
			}
		},
		series: series
	}).highcharts();

	if (is3d) {
		chartitem.options.chart.options3d.beta = 15;
		chartitem.redraw(false);
	}
}

//生成饼图
const generatorPieChart = (eid, chartdatas) => {
	var charttype = chartdatas.type;
	var dot = chartdatas.dot;
	var is3d = false;
	var innerSizeValue = 0;
	if (charttype === '7')
		is3d = true;
	if (charttype === '8')
		innerSizeValue = 40;
	var datas = chartdatas.series.data;
	var dataitem;
	for (var i = 0; i < datas.length; i++) {
		dataitem = datas[i];
		dataitem[1] = parseFloat(dataitem[1]);
	}
	$('#chartarea_' + eid).highcharts({
		chart: {
			type: 'pie',
			options3d: {
				enabled: is3d,
				alpha: 45,
				beta: 0
			}
		},
		title: {
			text: ''
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.' + dot + 'f}%</b>',
			style: {
				fontFamily: "微软雅黑",
				fontSize: "10px",
				lineHeight: "12px"
			}
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				depth: 35,
				dataLabels: {
					enabled: true,
					format: '{point.y}'
				},
				style: {
					lineHeight: "12px",
					fontSize: "12px",
					fontFamily: "微软雅黑"
				},
				innerSize: innerSizeValue
			}
		},
		series: [{
			type: 'pie',
			name: chartdatas.series.name,
			data: chartdatas.series.data
		}]
	});
}

//生成仪表盘
const generatorGauge = (eid, chartdatas) => {
	var dot = chartdatas.dot;
	var cdata = chartdatas.data;
	cdata.startval = parseFloat(Highcharts.numberFormat(cdata.startval, ~~dot, '.'));
	cdata.endval = parseFloat(Highcharts.numberFormat(cdata.endval, ~~dot, '.'));
	cdata.middleval = parseFloat(Highcharts.numberFormat(cdata.middleval, ~~dot, '.'));
	cdata.realval = parseFloat(Highcharts.numberFormat(cdata.realval, ~~dot, '.'));
	$('#chartarea_' + eid).highcharts({
		chart: {
			type: 'gauge',
			plotBackgroundColor: null,
			plotBackgroundImage: null,
			plotBorderWidth: 0,
			plotShadow: false
		},
		title: {
			text: ''
		},
		pane: {
			startAngle: -150,
			endAngle: 150,
			background: [{
				backgroundColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, '#FFF'],
						[1, '#333']
					]
				},
				borderWidth: 0,
				outerRadius: '109%'
			}, {
				backgroundColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, '#333'],
						[1, '#FFF']
					]
				},
				borderWidth: 1,
				outerRadius: '107%'
			}, {
				// default background
			}, {
				backgroundColor: '#DDD',
				borderWidth: 0,
				outerRadius: '105%',
				innerRadius: '103%'
			}]
		},
		// the value axis
		yAxis: {
			min: cdata.startval,
			max: cdata.endval,
			minorTickInterval: 'auto',
			minorTickWidth: 1,
			minorTickLength: 10,
			minorTickPosition: 'inside',
			minorTickColor: '#666',
			tickPixelInterval: 30,
			tickWidth: 2,
			tickPosition: 'inside',
			tickLength: 10,
			tickColor: '#666',
			labels: {
				step: 2,
				rotation: 'auto'
			},
			title: {},
			plotBands: [{
				from: cdata.startval,
				to: cdata.middleval,
				color: '#55BF3B' // green
			}, {
				from: cdata.middleval,
				to: cdata.endval,
				color: '#DF5353' // red
			}]
		},
		series: [{
			data: [cdata.realval],
			tooltip: {
				valueSuffix: ' ',
				style: {
					fontFamily: '微软雅黑',
					fontSize: "12px"
				}
			}
		}]
	});
}



//计划报告元素
export class Plan extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: props.data,
		}
	}
	changeYear(year) { //改变年份
		const data = this.state.data;
		let url = data.url + '&resourceid=' + data.resourceid + '&year=' + year + '&type1=' + data.type1;
		this.getPlanViewData(url);
	}
	changeType(type) { //选择周报或月报
		const data = this.state.data;
		let url = data.url + '&resourceid=' + data.resourceid + '&year=' + data.year + '&type1=' + type;
		this.getPlanViewData(url);
	}
	changeWeek(type) { //切换周数
		if (type === 1 && parseInt(this.state.data.inttype2) !== parseInt(this.state.data.maxWeekNum)) {
			this.changeType2(1);
		} else if (type === -1 && parseInt(this.state.data.inttype2) !== 1) {
			this.changeType2(-1);
		}
	}
	changeMonth(type) { //切换月数
		if (type === 1 && parseInt(this.state.data.inttype2) !== 12) {
			this.changeType2(1);
		} else if (type === -1 && parseInt(this.state.data.inttype2) !== 1) {
			this.changeType2(-1);
		}
	}
	changeType2(type) {
		const data = this.state.data;
		let inttype2 = parseInt(data.inttype2) + type;
		let url = data.url + '&resourceid=' + data.resourceid + '&year=' + data.year + '&type1=' + data.type1 + '&type2=' + inttype2;
		this.getPlanViewData(url);
	}
	getPlanViewData(url) {
		fetch(url, {
			headers:  {
				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
			},
			credentials: 'include'
		}).then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					this.setState({
						data: data,
					});
				});
			} else {
				console.log("Looks like the response wasn't perfect, got status", response.status);
			}
		}).catch(e => console.log("Fetch failed!", e));
	}
	render() {
		const data = this.state.data;
		if (data.type !== undefined) {
			return <div className="plan-view">
				<span style={{fontSize: '13px'}}>提示：<font style={{color:'red'}}>{data.mess}{ data.type === '2' ? <a href={data.url} target="_blank">设置</a> : null}</font></span>
			</div>
		}
		const isweek = parseInt(data.isweek);
		const ismonth = parseInt(data.ismonth);
		const showYear = data.showYear;
		const currentyear = parseInt(data.currentyear);
		const showType2 = data.showType2;
		const weekdate1 = data.weekdate1;
		const weekdate2 = data.weekdate2;
		const type1 = data.type1;
		const msg = data.msg;
		const inttype2 = parseInt(this.state.data.inttype2);
		const maxWeekNum = parseInt(this.state.data.maxWeekNum);
		let planShowhtml = <div>{msg}</div>;
		if (msg === '') {
			const planData = data.planData;
			if (undefined !== planData.msg) {
				planShowhtml = <div>{planData.msg}</div>
			} else {
				planShowhtml = <Table columns={formatData(planData.list[0], planData.esetting)} pagination={false} dataSource={planData.list} size="small"/>
			}
		}
		let html = null;
		if (type1 === '1') {
			html = <div className="month-sel">
					<span className={`week_btn1 ${inttype2 !== 1 ? 'week_prev' : ''}`} onClick={this.changeMonth.bind(this,-1)}></span>
					<span className={`week_month`}>{showType2+' 月'}</span>
					<span className={`week_btn2 ${inttype2 !== 12 ? 'week_next' : ''}`} onClick={this.changeMonth.bind(this,1)}></span>
				</div>
		} else if (type1 === '2') {
			html = <div className="month-sel">
					<span className={`week_btn1 ${inttype2 !== 1 ? 'week_prev' : ''}`} onClick={this.changeWeek.bind(this,-1)}></span>
					<span className={`week_month`}>{'第 '+showType2+' 周'}</span>
					<span className={`week_btn2 ${inttype2 !== maxWeekNum ? 'week_next' : ''}`} onClick={this.changeWeek.bind(this,1)}></span>
				</div>
		} else {
			html = <div className="tab2_panel" style={{width:' 1px',borderRight: '0px'}}></div>
		}
		let yearArr = new Array;
		for (var i = 2013; i < (currentyear + 4); i++) {
			yearArr.push(i);
		}
		return <div className="plan-view">
			<table>
				<tr>
					<td className="plan-title">
						<Select defaultValue={showYear} style={{ width: 70 }} onChange={this.changeYear.bind(this)}>
							{yearArr.map(y=><Option value={y}>{y}</Option>)}
					    </Select>
					</td>
					{isweek===1 ? <td className={`plan-title ${type1 === '2' ? 'selected' : ''}`} onClick={this.changeType.bind(this,2)}>周报</td>:null}
					{ismonth===1 ? <td className={`plan-title ${type1 === '1' ? 'selected' : ''}`} onClick={this.changeType.bind(this,1)}>月报</td>:null}
					<td className="plan-title sel-month-week">{html}</td>
				</tr>
			</table>
			<div id="planShow">{planShowhtml}</div>
			{/*<div id="planRemind">
							<iframe width="100%" id="remindIframe" frameborder="0" src="/page/element/plan/Remind.jsp"></iframe>
						</div>*/}
		</div>
	}
}
/*function changeHeight(height) {
	$("div.planRemind").height(height);
	var height = document.body.clientHeight - $("div.planTab").height() - height - 15;
	$("div.planShow").css("height", height);
}*/


//图片元素
export class Picture extends Component {
	componentDidMount() {
		const data = this.props.data;
		const esetting = this.props.esetting;
		initPictureJs(this.props.eid, esetting.width, esetting.speed, esetting.open);
	}
	render() {
		const eid = this.props.eid;
		var aStyle = {
			cursor: 'default'
		}
		var tdStyle = {
			verticalAlign: 'middle',
			width: '35px'
		}
		const data = this.props.data;
		const esetting = this.props.esetting;
		const showType = esetting.showType;
		const button = esetting.button;
		const open = esetting.open;
		const height = esetting.height;
		const width = esetting.width;
		let cursor = 'default';
		var imgStyle = {
			width: width + 'px',
			height: height + 'px'
		}
		var liStyle = {
			overflow: 'hidden',
			float: 'left',
			width: width + 'px',
			height: (parseInt(height) + 3) + 'px'
		}
		let html = null;
		if (showType === '1') {
			const item = data[0];
			let link = item.link;
			if ('' === link) {
				link = '#';
			} else {
				cursor = 'pointer';
			}
			let img = <img title={item.name} id={`resourceimg_${eid}`} src={item.url} border="0" style={imgStyle}/>;
			html = '1' === open ? <div className="jCarouselLite" id={`jCarouselLite_${eid}`}>
                    {'' !== item.url ? <a className="highslide" style={{cursor:cursor}} title={item.name} ref={item.link} id={`resourceimghref_${eid}`} href={item.url} target='_blank'> {img}</a> :
                    <a className="highslide" style={{cursor:cursor}} title={item.name} ref={item.link} id={`resourceimghref_${eid}`} >
                    {img}
                    </a>}
                  </div> : <div>{'#' !== link ? <a className="highslide" style={{cursor:cursor}} title={item.name} ref={item.link} id={`resourceimghref_${eid}`} href={link} target='_blank'> 
                    {img}</a> : <a className="highslide" style={{cursor:cursor}} title={item.name} ref={item.link} id={`resourceimghref_${eid}`} > 
                   {img}</a>}</div>
		} else {
			let btnBack = null;
			let btnNext = null;
			if ('1' === button) {
				btnBack = <td style={tdStyle}>
                  <div id={`pictureback_${eid}`} className="pictureback" style={{cursor:'hand'}} ></div>
              </td>
				btnNext = <td style={tdStyle}>
                  <div id={`picturenext_${eid}`} className="picturenext" style={{cursor:'hand'}} ></div>
               </td>
			}
			let liHtml = data.map(item => {
				const link = '' === item.link ? '#' : item.link;
				let img = <img title={item.name} id={`resourceimg_${eid}`} src={item.url} border="0" style={imgStyle}/>;
				return <li style={liStyle}>{'1' === open ? <div className="jCarouselLite" id={`jCarouselLite_${eid}`}>
                        {'' !== item.url ? <a className="highslide" style={{cursor:cursor}} title={item.name} ref={item.link} id={`resourceimghref_${eid}`} href={item.url} target='_blank'>{img}</a> :
                        <a className="highslide" style={{cursor:cursor}} title={item.name} ref={item.link} id={`resourceimghref_${eid}`} >
                        {img}
                        </a>}
                      </div> : <div>{'#' !== link ? <a className="highslide" style={{cursor:cursor}} title={item.name} ref={item.link} id={`resourceimghref_${eid}`} href={link} target='_blank'> 
                        {img}</a> : <a className="highslide" style={{cursor:cursor}} title={item.name} ref={item.link} id={`resourceimghref_${eid}`} > 
                       {img}</a>}</div>}</li>
			});
			html = <table width="100%" style={{borderSpacing:0}} border="0">
              <tbody>
                <tr>
                  {btnBack}
                   <td id={`picturetd_${eid}`} nowrap="nowrap" style={{overflow:'hidden',textAlign:'center'}} >
                    <div className="jCarouselLite" id={`jCarouselLite_${eid}`}>
                      <ul>
                      {liHtml}
                      </ul>
                    </div>
                  </td>
                  {btnNext}
                </tr>
              </tbody>
            </table>
		}
		return (<div id={`pictureTable_${eid}`} style={{backgroundColor: '#FFFFFF',height: height, width: '100%',margin:'0px',textAlign:'center'}}>
      {html}
    </div>)
	}
}

function initPictureJs(eid, picturewidth, autoShowSpeed, highopen) {
	var width = $("#jCarouselLite_" + eid).parent().width();
	var count = parseInt(width / picturewidth);
	if ($('#jCarouselLite_' + eid).find("ul").length > 0) {
		var auto = autoShowSpeed * 50;
		if ($('#jCarouselLite_' + eid).find("li").length < count) {
			auto = 0;
			count = $('#jCarouselLite_' + eid).find("li").length;
			$('#jCarouselLite_' + eid).jCarouselLite({
				btnPrev: '#pictureback_' + eid,
				btnNext: '#picturenext_' + eid,
				auto: auto,
				speed: 1000,
				visible: count,
				scroll: 1,
				circular: false
			});
			$("#pictureback_" + eid).hide();
			$("#picturenext_" + eid).hide();
			$("#picturetd_" + eid).attr("align", "center");
			var settingWidth = parseInt(count * picturewidth);
			$("#jCarouselLite_" + eid).width(settingWidth);
		} else {
			$('#jCarouselLite_' + eid).jCarouselLite({
				btnPrev: '#pictureback_' + eid,
				btnNext: '#picturenext_' + eid,
				auto: auto,
				speed: 1000,
				visible: count,
				scroll: 1,
				circular: true
			});
			$("#jCarouselLite_" + eid).width(width);
		}
	}
	if ("1" === highopen) {
		$('#jCarouselLite_' + eid).find("a").each(function() {
			var $img = $(this);
			$($img).fancybox({
				wrapCSS: 'fancybox-custom',
				closeClick: true,
				closeBtn: false,
				openEffect: 'none',
				helpers: {
					title: {
						type: 'inside'
					},
					overlay: {
						css: {
							'background': 'rgba(238,238,238,0.85)'
						}
					}
				},
				afterLoad: function() {
					if ($.trim(this.ref) != "#") {
						this.title = '<a href="' + this.ref + '" style="color:#000000!important;text-decoration:none!important;" target="_blank">' + this.title + '</a> ';
					}
				}
			});
		})
	}
}


//集成登录元素
export const OutterSys = ({
	data,
	esetting
}) => {
	const num = parseInt(esetting.displayLayout); //显示布局 几列
	const disouttyName = esetting.disouttyName;
	const disouttyimag = esetting.disouttyimag;
	const displaytype = esetting.displaytype;
	const linkmode = esetting.linkmode;
	const imgs = data.imgs;
	const list = data.data;
	const colArr = new Array;
	for (var i = 0; i < num; i++) {
		colArr.push(i);
	}
	let html = colArr.map((i) => {
		if ('1' === displaytype) { //左图式
			let dhtml = '1' === disouttyName ? list.map((obj, j) => {
				const n = i + j;
				const item = list[n];
				if (!_isEmptyObject(item)) {
					return <div style={{height:'36px',paddingTop:'6px'}}><a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl,linkmode)}>{item.name}</a></div>
				}
			}, num) : null;
			let ihtml = '1' === disouttyimag ? imgs.map((obj, j) => {
				const n = i + j;
				const item = list[n];
				const img = imgs[n];
				if (!_isEmptyObject(item)) {
					return <div><a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl,linkmode)}><img src={img.url}/></a></div>
				}
			}, num) : null;
			return <div>
				<Col span={1}>{ihtml}</Col>
          		<Col span={24/num - 1}>{dhtml}</Col>
      		</div>
		} else { //上图式
			let ohtml = list.map((obj, j) => {
				const n = i + j;
				const item = list[n];
				const img = imgs[n];
				let dHtml = !_isEmptyObject(item) && '1' === disouttyName ? <div style={{height:'36px',paddingTop:'6px'}}><a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl,linkmode)}>{item.name}</a></div> : null;
				let iHtml = !_isEmptyObject(img) && '1' === disouttyimag ? <div><a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl,linkmode)}><img src={img.url}/></a></div> : null;
				return <div>
						{iHtml}{dHtml}
					</div>
			}, num);
			return <div style={{textAlign:'center'}}>
          		<Col span={24/num}>{ohtml}</Col>
      		</div>
		}
	});
	return <Row>{html}</Row>
}

//公告栏元素
export class Notice extends Component {
	componentDidMount() {
		const data = this.props.data;
		$("#notice_marq" + this.props.eid).attr({
			direction: data.direction,
			onmouseout: 'this.start()',
			onmouseover: 'this.stop()',
			scrollAmount: '1',
			align: 'bottom',
			scrollDelay: data.scrollDelay,
			scrollleft: '0',
			scrolltop: '0'
		});
	}

	render() {
		const data = this.props.data;
		let chtml = data.onlytext === 'yes' ? <span>{data.content}</span> : <span dangerouslySetInnerHTML={{__html: data.content}}></span>
		let width = '95%';
		let thtml = null;
		if (!_isEmptyObject(data.title)) {
			width = '75%';
			thtml = <div style={{float:'left',marginLeft:'5px',width:'20%'}}>{data.title}</div>;
		}
		return <div>
				<div style={{float:'left',marginLeft:'5px'}}><img src={data.img}/></div>
				{thtml}
				<div style={{float:'right',marginLeft:'10px',width:width}}>
				<marquee id={`notice_marq${this.props.eid}`} >
				{chtml}
			</marquee></div>
			</div>

	}
}
/**/
//文档中心元素
export class News extends Component {
	render() {
		const eid = this.props.eid;
		const data = this.props.data;
		const esetting = this.props.esetting;
		const list = data.data;
		if (list.length === 0) return <div></div>;
		//tab设置信息
		const tabsetting = data.tabsetting;
		const height = tabsetting.height;
		const width = tabsetting.width;
		const showModeId = parseInt(tabsetting.showModeId);
		const imgs = tabsetting.imgs;
		let columns = [];
		let imgStyle = {
			width: width,
			height: height === '0' ? parseInt(width) * 0.8 : height
		}
		const style = {
			verticalAlign: 'top'
		};
		switch (showModeId) {
			case 2: //上图式
				imgStyle['margin'] = '0 auto';
				let lHtml = list.map((item, i) => {
					let imghtml = null;
					if (!_isEmptyObject(imgs)) {
						let img = imgs[i];
						if (img && img.indexOf("|") !== -1) {
							const imgArr = img.split("|");
							imghtml = <Carousel autoplay >
		               { imgArr.map(o=> <div><img style={imgStyle} src={o}/></div>) }
		             </Carousel>
						} else {
							imghtml = <img style={imgStyle} src={img}/>
						}
					}
					return <div id={`news_${eid}`}>
		             <div style={imgStyle}>{imghtml}</div>
		             <div style={{textAlign:'center',margin:'10px'}}>{loadRemind(item.docdocsubject.name, item.docdocsubject.link, esetting.linkmode, item.docdocsubject.img, esetting.isremind)}</div>
		             <div style={{textAlign:'center',marginBottom:'10px'}}>{item.doclastmoddate} {item.doclastmodtime}</div>
		           </div>
				});
				return <div>{lHtml}</div>
				break;
			case 3: //左图式
				let html = list.map((item, i) => {
					let imghtml = null;
					if (!_isEmptyObject(imgs)) {
						let img = imgs[i];
						if (img && img.indexOf("|") !== -1) {
							const imgArr = img.split("|");
							imghtml = <Carousel autoplay >
				               { imgArr.map(o=> <div><img style={imgStyle} src={o}/></div>) }
				             </Carousel>
						} else {
							imghtml = <img style={imgStyle} src={img}/>
						}
					}
					return <div style={{overflow:'auto',width:'100%',marginBottom:'10px'}}>
		               <div style={{float:'left',width:parseInt(width)+3}}> {imghtml}</div>
		               <div style={{float:'left'}}>
		                   <div style={{margin:'20px 0 0 20px'}}>{loadRemind(item.docdocsubject.name, item.docdocsubject.link, esetting.linkmode, item.docdocsubject.img, esetting.isremind)}</div>
		                   <div style={{margin:'20px 0 0 20px'}}>{item.doclastmoddate} {item.doclastmodtime}</div>
		               </div>
		           </div>
				});
				return <div>{html}</div>
				break;
			case 4: //列表式2
				let html4 = null;
				let imghtml = null;
				if (!_isEmptyObject(imgs)) {
					let ihtml = list.map((item, i) => {
						let img = imgs[i];
						if (img && img.indexOf("|") !== -1) img = img.split("|")[0];
						return <div><img style={imgStyle} src={img}/></div>
					});
					imghtml = <div id={`news_silde_${eid}`} className="news-silde" style={imgStyle}>
			             <Carousel autoplay>
			               {ihtml}
			             </Carousel>
		             </div>
				}
				columns = formatData(list[0], esetting);
				style['paddingTop'] = '6px';
				html4 = <table><tr>
		           <td style={style}>
		          {imghtml}
		           </td>
		           <td width="100%" className="valign"><Table columns={columns} showHeader={false} pagination={false} dataSource={list} size="small"/></td>
		           </tr></table>;

				return <div>{html4}</div>
				break;
			case 5: //双列式
				columns = formatData(list[0], esetting);
				const evenData = new Array;
				const oddData = new Array;
				list.map((item, i) => {
					if (i % 2 === 0) {
						evenData.push(item);
					} else {
						oddData.push(item);
					}
				});
				return <div><Row>
		                     <Col span={12} order={1}>
		                       <Table columns={columns} showHeader={false} pagination={false} dataSource={evenData} size="small"/>
		                     </Col>
		                     <Col span={12} order={2}> 
		                       <Table columns={columns} showHeader={false} pagination={false} dataSource={oddData} size="small"/>
		                     </Col>
	                 </Row>
	                </div>
				break;
			case 1: //列表式
			default:
				columns = formatData(list[0], esetting);
				return <Table columns={columns} showHeader={false} pagination={false} dataSource={list} size="small"/>
				break;
		}
	}
}

//公告元素
export const NewNotice = ({
	eid,
	data,
	esetting
}) => {
	let html = data.map(item => {
		return <tr style={{cursor:'pointer',verticalAlign: 'middle'}} name={`newnoticeitem_${eid}`}>
				<td>
					<div style={{height:'66px',width:'97px',position:'relative',border:'1px solid #d7d8e0',background:'url('+item.imgUrl+') center center no-repeat',backgroundSize:'100% 100%'}}>
					</div>
					<input type="hidden" name="" value={item.id}/>
				</td>
				<td>
				</td>
				<td style={{verticalAlign: 'middle'}}>
					<div className="siteminputblock">
						<div className="noticeinfoline" style={{height:'11px !important'}}></div>
						<div className="noticeitemtitle">{item.name}</div>
						<div className="noticeinfoline"></div>
						<div className="noticeitemdesc">
						{item.content}
						</div>
					</div>
				</td>
			</tr>
	});
	return <div>
      	<table id={`newNoticeViewTalbe_${eid}`} width="100%" height="100%" style={{borderSpacing:0,tableLayout:'fixed'}}>
			<colgroup><col width="97px"/><col width="18px"/><col width="*"/></colgroup>
			{html}
		</table>
		{esetting.esharelevel === '2' ? <div className="noticeitemnew">
			<div style={{position:'absolute',height:'24px',width:'24px',zIndex:10000,top:'50%',left:'50%',cursor:'pointer'}}>
				<a href="javascript:void(0);" onClick={addItem.bind(this,eid)}><img src="/page/element/newNotice/resource/image/new.png" height="24px" width="24px" style={{marginTop:'-12px',marginLeft:'-12px'}} title="添加公告"/></a>
			</div>
		</div>: null}
      </div>
}
const addItem = eid => {
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	dialog.URL = "/page/element/newNotice/detailsetting.jsp?eid=" + eid;
	dialog.Title = "新建公告";
	dialog.Width = 600;
	dialog.Height = 768;
	dialog.normalDialog = false;
	dialog.maxiumnable = true;
	dialog.callbackfun = function(paramobj, id1) {};
	dialog.show();
}

const showNewNotice = (eid, id) => {
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	dialog.URL = "/page/element/newNotice/detailviewTab.jsp?eid=" + eid + "&id=" + id;
	dialog.Title = "查看公告";
	dialog.Width = 600;
	dialog.Height = 768;
	dialog.normalDialog = false;
	dialog.maxiumnable = true;
	dialog.callbackfun = function(paramobj, id1) {};
	dialog.show();
}

//多新闻中心元素
export const MoreNews = ({
	data,
	esetting
}) => {
	let html = data.map(item => {
		const columns = formatData(item.data[0], esetting);
		return <div style={{marginBottom:'8px'}}>
			{item.img !== '' ? <div style={{border:'1px solid #000000',float:'left'}}><img height="142" width="142" src={item.img}/></div>:null}
			<Table columns={columns} showHeader={false} pagination={false} dataSource={item.data} size="small"/>
		</div>

	});
	return <div>{html}</div>
}

//期刊中心
export const Magazine = props => <div>{props.data.map(item => <MagazineItem item={item} esetting={props.esetting}/>)}</div>
class MagazineItem extends Component {
	constructor(props) {
		super(props)
		this.state = {
			id: props.item.isselect,
		}
	}
	handleChange(id) {
		this.setState({
			id: id,
		});
	}
	render() {
		const item = this.props.item;
		const esetting = this.props.esetting;
		let selHtml = item.selList.map(sel => <Option value={sel.id}>{sel.label}</Option>);
		return <div>
      {item.strImg === '' ? null : <div style={{float:'left',width:parseInt(esetting.width)+2,height:parseInt(esetting.height)+2,border:'1px solid #000000'}}>
        <img style={{width:esetting.width,height:esetting.height}} src={item.strImg}/>
      </div>}
      <div style={{float:'left'}}>
        <div style={{margin:'5px 0 0 10px'}}>
          <span><a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl+item.isselect,esetting.linkmode)}>{item.title}</a></span>
        </div>
        <div style={{margin:'5px 0 0 10px'}}>
          <span>{item.strBrief}</span>
        </div>
       <div style={{margin:'5px 0 0 10px'}}>
        <Select id="bbbbbbbbb" defaultValue={item.isselect} style={{width:400}} onChange={this.handleChange.bind(this)}>
          {selHtml}
          </Select>&nbsp;<a href="javascript:void(0);" onClick={openLinkUrl.bind(this,item.linkUrl+this.state.id,esetting.linkmode)}><img style={{marginBottom:'-5px'}} src={item.img}/></a>
        </div>
      </div>
  </div>
	}
}


//多图元素
export class ImgSlide extends Component {
	clickDots() {

	}
	componentDidMount() {
		const eid = this.props.eid;
		var stdom = $("#imgslide_" + eid + " .setting");
		$("#imgslide_" + eid).hover(
			() => $(stdom).css("display", "block"),
			() => $(stdom).css("display", "none")
		);
		/*    const data = this.props.data;

		    const imgdesclist = data.imgdesclist;
		    if (data.displaydesc === '1') {
		      imgdesclist.map((t, i) => {
		        console.log("dom : ", $("#imgslide_" + this.props.eid + " > ul > li:eq(" + i + ")"));
		        $("#imgslide_" + this.props.eid + " > ul > li:eq(" + i + ")").attr("title", t);
		      });

		    }*/
	}
	render() {
		const eid = this.props.eid;
		const data = this.props.data;
		const imgsrclist = data.imgsrclist;
		// autoplay
		return <div className={'imgslide'} id={`imgslide_${eid}`}>
    <div className="carousel"><Carousel>
      {imgsrclist.map(src=> <div style={{height:'260px',overflow:'hidden'}}><img style={{textAlign:'center'}} src={src}/></div>)}
  </Carousel></div>
      <div className="setting">
      <img src="/page/element/imgSlide/resource/image/ssetting.png" height="28px" width="28px" onClick={openImgSlideSettingWin.bind(this,eid)} title="设置"/>
    </div>
    </div>
	}
}
const openImgSlideSettingWin = (eid) => {
		var dialog = new window.top.Dialog();
		dialog.currentWindow = window;
		dialog.URL = "/page/element/imgSlide/detailsetting.jsp?eid=" + eid;
		dialog.Title = "详细设置";
		dialog.Width = 680;
		dialog.Height = 768;
		dialog.normalDialog = false;
		dialog.callbackfun = function(paramobj, id1) {

		};
		dialog.show();
	}
	/*	//自定义页面元素
	export class CustomPage extends Component {
		componentDidMount() {
			const eid = this.props.eid;
			const data = this.props.data;
			$("#ifrm_" + eid).attr({
				frameborder: "no",
				scrolling: "auto",
				noresize: "noresize",
				border: "0"

			});
			setTimeout(function() {
				$("#iframe_loading_" + eid).remove();
				if ($("#ifrm_" + eid).attr("src") === "about:blank") {
					$("#ifrm_" + eid).attr({
						src: data.url,
						height: data.height
					});
				}
			}, 500);
		}
		render() {
			const eid = this.props.eid;
			const data = this.props.data;
			var style = {
				textAlign: 'center',
				height: (parseInt(data.height) - 15) + 'px',
				fontSize: '40px',
				paddingTop: (parseInt(data.height) / 2 - 25) + 'px'
			}
			return <div><div id={`iframe_loading_${eid}`} style={style}><Icon type="loading"/></div><iframe height="0" id={`ifrm_${eid}`} src="about:blank" style={{borderCollapse: 'collapse'}} name={`ifrm_${eid}`} width="100%"></iframe></div>

		}
	}*/


/*const loadIframe = (eid, height, url) => {
	var dom = document.getElementById("custompage_" + eid);
	var iframe = document.createElement("iframe");
	$(iframe).attr("frameborder", 0);
	$(iframe).attr("scrolling", "auto");
	$(iframe).attr("noresize", "noresize");
	$(iframe).attr("border", 0);
	$(iframe).attr("id", "ifrm_" + eid);
	$(iframe).css("width", "100%");
	$(iframe).css("height", height);
	var $iframe = $(iframe);
	//dom.appendChild(iframe);
	var msie = /msie/.test(navigator.userAgent.toLowerCase()); //jQuery1.9以上版本检测是否为IE浏览器
	var iframeInfo = {
		$iframe: $iframe,
		msie: msie,
		count: 0
	};
	//count为计数器,必须使用对象引用再第二次加载时数值才有效
	$iframe.on("load", iframeInfo, function(e) {
		if (0 == e.data.count) { //检查是否为首次加载
			e.data.$iframe.contents().empty();
			e.data.$iframe.attr("src", url);
			++e.data.count;
			return;
		}
		if (null == e.data.$iframe.attr("src")) { //检查是否为释放iframe
			e.data.$iframe.contents().empty();
			e.data.$iframe.removeAttr('src');
			e.data.$iframe.remove();
			if (e.data.msie)
				CollectGarbage();
			e.data.$popupdlg.wijdialog("close"); //这一句可选,这里是关闭对话框  
			return;
		}
		//IE会执行两次
		if (e.data.msie && 1 == e.data.count) {
			++e.data.count;
			return;
		}

		//最后才是正常处理的代码,根据实际需要编写代码
		var $divContainer = $(e.data.$iframe[0].contentWindow.document.getElementById("custompage_" + eid));
		$divContainer.show();
	});
}*/


//建模查询中心元素
export class FormModeCustomSearch extends Component {
	componentDidMount() {
		const tabsetting = this.props.data.tabsetting;
		const rolltype = tabsetting.rolltype;
		let attrs = {
			direction: tabsetting.rolltype,
			onmouseover: 'this.stop()',
			onmouseout: 'this.start()',
			scrolldelay: '200'
		};
		if (rolltype === 'up' || rolltype === 'down') {
			attrs['width'] = '100%';
			attrs['height'] = tabsetting.height;
		}
		$("#MARQUEE_" + this.props.eid).attr(attrs);
	}
	render() {
		const eid = this.props.eid;
		const data = this.props.data;
		if (data.isRight === "false") {
			return <div style={{height:'40px',lineHeight:'40px',textAlign:'center'}}>{data.data}</div>
		}
		const esetting = this.props.esetting;
		const tabsetting = data.tabsetting;
		const list = data.data;
		esetting['widths'] = tabsetting.widths;
		esetting['titles'] = tabsetting.titles;
		let html = null;
		let showHeader = true;
		var index = 0;
		for (var k in list[0]) {
			index += 1;
		}
		if (index === 1) {
			showHeader = false;
		}
		if (list.length > 0) {
			if (tabsetting.rolltype) {
				html = <marquee id={`MARQUEE_${eid}`}>
	              <Table columns={formatData(list[0], esetting)} showHeader={showHeader} pagination={false} dataSource={list} size="small"/>
	          </marquee>
			} else {
				html = <Table columns={formatData(list[0], esetting)} showHeader={showHeader} pagination={false} dataSource={list} size="small"/>
			}
		}
		return <div>{html}</div>;
	}
}


//Flash元素
export const Flash = ({
	eid,
	data
}) => <div id={`flash_play_${eid}`} style={{width:'100%',height:data.height +'px',overflowY:'hidden'}}>
	<embed width="100%" height={data.height +'px'} wmode="opaque" name="plugin" src={data.url} type="application/x-shockwave-flash"/>
</div>

//个人数据元素
export class DataCenter extends Component {
	componentDidMount() {
		const openlink = this.props.esetting.linkmode;
		$(".module").hover(function(dom) {
			$(this).css("background-image", "none");
			$(this).find(".mtitle").show().css("padding-top", "52px");
			$(this).css("opacity", '0.8')
		}, function() {
			$(this).css("background-image", "url(/images/homepage/portalcenter/" + $(this).attr("data-type") + "_wev8.png)");
			$(this).find(".mtitle").hide();
			$(this).css("opacity", '1')
		})
		$(".module").click(function() {
			if ("2" == openlink) window.open($(this).attr("data-url"));
			else parent.window.open($(this).attr("data-url"), "_self");
		})
	}
	render() {
		const list = this.props.data;
		let html = null;
		switch (list.length) {
			case 1:
			case 2:
			case 3:
				html = list.map(item => <Col span={24/list.length}>
              <Module item={item} height='240'/>
        </Col>);
				break;
			case 4:
				html = list.map(item => <Col span={12}>
              <Module item={item} height='120'/>
        </Col>);
				break;
			case 5:
				html = list.map((item, i) => {
					switch (i) {
						case 0:
							return <Col span={8}>
                  <Module item={item} height='120'/>
                  <Module item={list[i+3]} height='120'/>
                </Col>
						case 1:
							return <Col span={8}>
                      <Module item={item} height='240'/>
                  </Col>
						case 2:
							return <Col span={8}>
                  <Module item={item} height='120'/>
                  <Module item={list[i+2]} height='120'/>
                </Col>
						default:
							return <div></div>;
					}
				});
				break;
			case 6:
				html = list.map((item, i) => {
					return <Col span={8}>
             <Module item={item} height='120'/>
        </Col>
				});
				break;
			case 7:
				html = list.map((item, i) => {
					switch (i) {
						case 1:
							return <Col span={8}>
                  <Row><Col span={12}>
                     <Module item={item} height='120'/>
                  </Col>
                  <Col span={12}>
                      <Module item={list[i+1]} height='120'/>
                  </Col>
                </Row>
               </Col>
						case 2:
							return <div></div>;
						default:
							return <Col span={8}>
              <Module item={item} height='120'/>
        </Col>
					}
				});
				break;
			case 8:
				html = list.map((item, i) => {
					switch (i) {
						case 1:
						case 4:
							return <Col span={8}>
                  <Row><Col span={12}>
                     <Module item={item} height='120'/>
                  </Col>
                  <Col span={12}>
                      <Module item={list[i+1]} height='120'/>
                  </Col>
                </Row>
               </Col>
						case 2:
						case 5:
							return <div></div>;
						default:
							return <Col span={8}>
              <Module item={item} height='120'/>
        </Col>
					}
				});
				break;
			case 9:
				html = list.map((item, i) => {
					switch (i) {
						case 1:
						case 4:
						case 7:
							return <Col span={8}>
                  <Row><Col span={12}>
                     <Module item={item} height='120'/>
                  </Col>
                  <Col span={12}>
                      <Module item={list[i+1]} height='120'/>
                  </Col>
                </Row>
               </Col>
						case 2:
						case 5:
						case 8:
							return <div></div>;
						default:
							return <Col span={8}>
              <Module item={item} height='120'/>
        </Col>
					}
				});
				break;
		}
		return <Row>{html}</Row>
	}
}
const Module = ({
	item,
	height
}) => <div className={`module ${item.model}`} data-type={item.model} data-url={item.url} style={{backgroundColor:item.color,height:height}}>
        <div className="num">{item.value}</div>
        <div className="mtitle">{item.label}</div>
      </div>



//自定义菜单元素
export const CustomMenu = ({
	eid,
	data,
	esetting
}) => {
	let style = {};
	if (esetting.menuType === 'menuh') {
		style = {
			float: 'left',
			listStyle: 'none'
		};
	}
	return <div>{handleCustomMenuData(data, esetting.linkmode, style)}</div>
}
const handleCustomMenuData = (data, linkmode, style) => <ul>{data.map(item => <li style={style}><a href={openLinkUrl.bind(this,item.linkUrl,linkmode)}>{item.name}</a>{handleCustomMenuData(item.children)}</li>)}</ul>


//音频元素
export const Audio = ({
	eid,
	data,
	esetting
}) => {
	let isIe = false;
	let html = null;
	let style = {
		width: '100%',
		height: esetting.height
	}
	if (eval(esetting.isIe)) {
		html = <object id = {`audioplayer_${eid}`} classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
				codebase = "http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" style={{height:esetting.height,textAlign:'middle',width:'100%'}}>
				<param name="quality" value="best"/>
				<param name="SAlign" value="LT"/>
			    <param name="allowScriptAccess" value="never"/>
			    <param name="wmode" value="transparent"/>
			    <param name="movie" value={`"${esetting.ePath}resource/js/audio-player.swf?audioUrl=${data.url}&${esetting.autoPlay === 'on'?'autoPlay=true':''}`}/>
			    <embed src={`"${esetting.ePath}resource/js/audio-player.swf?audioUrl=${data.url}&${esetting.autoPlay  === 'on'?'autoPlay=true':''}`} mce_src="flash/top.swf"  wmode="transparent" menu="false" quality="high"  
			          width="100%" height={esetting.height} allowscriptaccess="sameDomain" type="application/x-shockwave-flash"  
			         pluginspage="http://www.macromedia.com/go/getflashplayer" />
			</object>

	} else {
		html = <audio  src={data.url} style={{width: '100%'}} height={esetting.height} autoplay={esetting.autoPlay === 'on' ? 'autoplay':''} controls='controls'></audio>
	}
	return (<div id = {`audio_play_${eid}`} style ={style}>
		{html}
</div>)
}


//新建流程元素
export const AddWf = ({
	data,
	esetting
}) => {
	const list = data.data;
	const columns = formatData(list[0], esetting);
	var dlist = new Array;
	for (var i; i < list.length; i++) {
		if (i < 6) {
			dlist.push(list[i]);
		}
	}
	if ("1" === esetting.displayLayout) {
		return <Table columns={columns} showHeader={false} pagination={false} dataSource={dlist} size="small"/>
	}
	const evenData = new Array;
	const oddData = new Array;
	list.map((item, i) => {
		oddData.push(item);
		if (list[i + 1] !== undefined) {
			evenData.push(list[i + 1]);
		}
	}, 2);
	return <Row>
         	 <Col span={12} order={1}>
				<Table columns={columns} showHeader={false} pagination={false} dataSource={oddData} size="small"/>
              </Col>
              <Col span={12} order={2}> 
                <Table columns={columns} showHeader={false} pagination={false} dataSource={evenData} size="small"/>
              </Col>
          </Row>

}