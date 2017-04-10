import Immutable from 'immutable';
//图表元素
class HighChart extends React.Component {
	componentDidMount() {
		//加载图标
		const { eid, data } = this.props;
		this.checkonLoad(eid, data);
	}
	componentDidUpdate(preProps) {
		const { eid, data } = this.props;
		if(!Immutable.is(data,preProps.data)){
			//加载图标
			this.checkonLoad(eid, data);
		}
	}
	checkonLoad(eid, data) {
		try {
			var container = $("#chartarea_" + eid);
			container.css("width", $("#reportformchart_" + eid).width() - 20);
			container.css("height", $("#reportformchart_" + eid).height() - 20);
			container.css("overflow", "hidden");
			generatorSimpechart(eid, data);
		} catch (e) {

		}
	}
	render() {
		const { eid, data } = this.props;
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



import { WeaErrorPage, WeaTools } from 'ecCom';
class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return (
			<WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
		);
	}
}
HighChart = WeaTools.tryCatch(React, MyErrorHandler, {
	error: ""
})(HighChart);

export default HighChart;