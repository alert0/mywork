//天气元素
class WeatherCom extends React.Component {
	componentDidMount(){
		$("#weather_"+this.props.eid).attr("align","center");
		$("#asdad").attr("align","center");
	}
	render() {
		const { eid, data, esetting } = this.props;
		const { width, autoScroll } = esetting;
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
              <div className="wetCityName" id="curConditionDiv" style={{width:'80px',cursor:'pointer',height:'40px',lineHeight:'40px'}}>
                <p title={item.weather}>{item.weather}</p></div>
              <div style={{width: '80px',bottom:'10px'}}>
                {item.img === '' ? null : <img src={item.img} title={item.weather}/>}
              </div>
              <br/>{item.temperature}</td>);

			var wHtml = <table style={{textAlign:'center',margin:'0 auto'}} cellpadding="0" cellspace="0" border="0">
	                <tbody>
	                  <tr>
	                    <td id={`weather_${eid}_1`} className="valign" style={{float: 'left'}}>
	                      <table>
	                        <tbody>
	                          <tr>
	                          	{tdHtml}
	           					</tr>
	                        </tbody>
	                      </table>
	                    </td>
	                    <td id={`weather_${eid}_2`} className="valign"></td>
	                  </tr>
	                </tbody>
	              </table>;
			if (autoScroll === '1') {
				wHtml = <marquee direction="left" scrollamount="2" onMouseOver={stop()} onMouseOut={start()}>
					{wHtml}
				</marquee>
			}
			trHtml = <tr>
			      <td style={{verticalAlign:'middle',width:'35px'}}>
			        <div id={`weatherback_${eid}`} style={{cursor:'hand'}} className="" onClick={backWeatherMarquee(eid)}></div>
			      </td> 
			      <td id="asdad" style={{textAlign:'center'}}>
			        <div id={`weather_${eid}`} style={{textAlign:'center !important'}}>
			          <div id={`weather_${eid}_0`} style={{margin:'0 auto',overflow:'hidden',width:width+'px',textAlign:'center'}}>
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
WeatherCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(WeatherCom);
export default WeatherCom;

function backWeatherMarquee(eid) {
	$("weather_" + eid + "_0").attr("scrollLeft", parseInt($("weather_" + eid + "_0").attr("scrollLeft")) - 75);
}

function start() {}

function stop() {}

function nextWeatherMarquee(eid) {
	$("weather_" + eid + "_0").attr("scrollLeft", parseInt($("weather_" + eid + "_0").attr("scrollLeft")) + 75);
}