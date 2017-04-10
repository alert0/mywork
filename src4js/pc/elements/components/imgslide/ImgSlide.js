import { Carousel } from 'antd';
//多图元素
class ImgSlideCom extends React.Component {
	componentWillUnmount(){
		try {
			clearInterval(_t);
		} catch (e) {

		}
	}
	componentDidMount() {
		const { eid, data } = this.props;
		const {imgsrclist,imgdesclist,height,displaydesc,cellwidth} = data;
		let rowcount = parseInt(data.rowcount);
		initSlide(eid, rowcount);
		var mleft = "-"+(18*rowcount/2)+'px';
		$('#banner_'+eid+' ul').css('margin-left',mleft);
	}
	render() {
		const { eid, data } = this.props;
		const {imgsrclist,imgdesclist,height,rowcount,displaydesc,cellwidth,isSetting} = data;


		var style = {fontFamily:'微软雅黑'};
		var style1 = {display:'none'};
		if(displaydesc != 1){
			style = {fontFamily:'微软雅黑',display:'none'};
			style1={};
		}
		var col1 = new Array;
		var col2 = new Array;
		for (var j=0; j<parseInt(rowcount)-1; j++) {
		    col1.push(<col width={`${cellwidth}%`}/>);
		    col2.push(<col width="1px"/>);
		}
		let liHtml = new Array;
		let aHtml = new Array;
		let dHtml = new Array;
		imgdesclist.map((item,i)=>{
				var astyle = {
					background:'url('+imgsrclist[i]+') center center no-repeat',
					backgroundSize:'100% 100%',
					 height:'100%'
				} 
	           	liHtml.push(<li className={i===0?'on':''} data-index={i+1}></li>);
	          	aHtml.push(<a>
		                <div className="slidebox_list_item" style={astyle}>
		                </div>
		            </a>);
             	dHtml.push(<td>
               		 <div className={`slidebox_info_item ${i === 0 ? 'slidebox_info_item_slt':''}`} data-index={i+1}>
                    {item}
	                </div>
	            </td>);
			});
			return <div id={`imgslide_${eid}`} style={{width: '100%',height:height}}>
				  <div id={`banner_${eid}`} className="slidebox_block" style={{height: '100%'}}>
				    { isSetting==='true' ? <div style={{position: 'absolute', height: '28px', width: '28px', zIndex: 999, top: '10px', right: '10px', cursor: 'pointer', display: 'none'}}>
				      <img src="/page/element/imgSlide/resource/image/ssetting.png" height="28px" width="28px" id={`settingico_${eid}`} title="设置" />
				    </div> : null}
				    <div id={`banner_info_${eid}`} className="slidebox_info" style={style}>
				      <table width="100%" height="100%" cellpadding="0" cellspacing="0">
				        <colgroup>
				          {col1}
				          {col2}
				          <col width="*" />
			          	</colgroup>
				        <tbody>
				          <tr>
				           {dHtml}
				          </tr>
				        </tbody>
				      </table>
				    </div>
				    <ul style={style1}>
				     {liHtml}
				    </ul>
				    <div id={`banner_list_${eid}`} className="slidebox_list" style={{height: '100%'}}>
					{aHtml}
				    </div>
				  </div>
				</div>
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
ImgSlideCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(ImgSlideCom);
export default ImgSlideCom;

global._t = 0;
global._n = 0;
global._count;

function initSlide(eid,rowcount) {
	try {
		clearInterval(_t);
	} catch (e) {

	}
	_count = $("#banner_list_"+eid+" a").length;
	$("#banner_list_"+eid+" a:not(:first-child)").hide();
	$("#banner_info_"+eid+"").click(function() {});
	$("#banner_"+eid+" li, #banner_info_"+eid+" .slidebox_info_item").click(function() {
		var i = $(this).attr("data-index") - 1; //
		_n = i;
		if (i >= _count) return;
		$("#banner_info_"+eid).unbind().click(function() {});
		$("#banner_list_"+eid+" a").filter(":visible").fadeOut(500).parent().children().eq(i).fadeIn(500);
		document.getElementById("banner_"+eid).style.background = "";
		$("#banner_"+eid+" li").eq(i).toggleClass("on");
		$("#banner_info_"+eid).find(".slidebox_info_item").removeClass("slidebox_info_item_slt");
		$("#banner_info_"+eid).find(".slidebox_info_item").eq(i).addClass("slidebox_info_item_slt");

		$(this).siblings().removeAttr("class");
	});
	if (rowcount > 1) {
		_t = setInterval(showAuto.bind(this,eid), 4000);	
	}
	$("#banner_"+eid).hover(function() {
		clearInterval(_t)
		$("#settingico_"+eid).parent().show();
	}, function() {
		if (rowcount > 1) {
			_t = setInterval(showAuto.bind(this,eid), 4000);
		}
		$("#settingico_"+eid).parent().hide();
	});
	$("#settingico_"+eid).hover(function () {
		$(this).attr("src", "/page/element/imgSlide/resource/image/ssetting_slt.png");	
	}, function () {
		$(this).attr("src", "/page/element/imgSlide/resource/image/ssetting.png");	
	});
	
	$("#settingico_"+eid).bind("click", function () {
		var dialog = new window.top.Dialog();
		dialog.currentWindow = window;
		dialog.URL = "/page/element/imgSlide/detailsetting.jsp?eid="+eid;
		dialog.Title = "详细设置";
		dialog.Width = 680;
		dialog.Height = 768;
		dialog.normalDialog = false;
		dialog.callbackfun = function (paramobj, id1) {
		
		};
		dialog.show();
	});
}
var showAuto=function(eid) {
	_n = _n >= (_count - 1) ? 0 : ++_n;
	$("#banner_"+eid+" li").eq(_n).trigger('click');
}
