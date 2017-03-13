import Immutable from 'immutable'

const bindRemark = (_uEditor) => {
	var remarkHide = function(e) {

		//转发页面不隐藏
		if(window.__isremarkPage == true) {
			return;
		}
		var banfold = jQuery("#fsUploadProgressfileuploaddiv").attr("banfold");
		if(e.which == 1 && jQuery(e.target).parents('.remarkDiv,.edui-popup,.edui-dialog,.filtercontainer, ._signinputphraseblockClass').length <= 0 && banfold != "1") {
			try {
				var _remarkTxt = _uEditor.getContentTxt();
				var _remarkHtmlstr = _uEditor.getContent().replace(/<p><\/p>/g, "");

				if((_remarkTxt == "" && _remarkHtmlstr.indexOf('<img src=') < 0) || _remarkHtmlstr == "") {
					//_uEditor.destroy();
					//change2NormalStyle();
					//jQuery("html").unbind('mouseup', remarkHide);
					//jQuery(".remarkDiv").hide();
					//jQuery("#remarkShadowDiv").show();

					window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.controlSignInput(false))
				}
			} catch(e) {}
			e.stopPropagation();
		}
	};
	jQuery(".wea-new-top-req-content").live('mousedown', remarkHide);
	_uEditor.ready(function() {
		jQuery(".edui-for-wfannexbutton").children("div").children("div").children("div").children(".edui-metro").addClass("wfres_1");
		jQuery(".edui-for-wfdocbutton").children("div").children("div").children("div").children(".edui-metro").addClass("wfres_2");
		jQuery(".edui-for-wfwfbutton").children("div").children("div").children("div").children(".edui-metro").addClass("wfres_3");
	});
}

window.bindRemark = bindRemark;

const onShowSignBrowser4signinput = (url, linkurl, inputname, spanname, type1, countEleID) => {
	//关闭表单签章显示,防止某些IE版本下,表单签章显示白色和弹窗冲突
	const formstate = window.store_e9_workflow.getState().workflowReq.getIn(['params', 'hiddenarea']);
	const requestid = formstate.get('requestid');
	const userid = formstate.get('f_weaver_belongto_userid');
	const isFormSignature = formstate.get('isFormSignature');
	if(top.Dialog._Array.length == 0) {
		jQuery("[id^=Consult]").hide();
	}
	var tmpids = jQuery("#" + inputname).val();
	var url;
	if(type1 === 37) {
		// url = "/systeminfo/BrowserMain.jsp?f_weaver_belongto_userid=<%=userid%>&f_weaver_belongto_usertype=<%=(Util.getIntValue(user.getLogintype()) - 1)%>&url=" + url + "?f_weaver_belongto_userid=<%=userid%>&f_weaver_belongto_usertype=<%=(Util.getIntValue(user.getLogintype()) - 1)%>&documentids=" + tmpids;
		url = "/systeminfo/BrowserMain.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=0&url=" + url + "?documentids=" + tmpids + escape("&f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=0");
	} else {
		url = "/systeminfo/BrowserMain.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=0&url=" + url + "?resourceids=" + tmpids + escape("&f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=0");
	}
	//alert(url);
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	dialog.callbackfunParam = null;
	dialog.URL = url;
	dialog.callbackfun = function(paramobj, id1) {
		if(id1) {
			if(wuiUtil.getJsonValueByIndex(id1, 0) != "" && wuiUtil.getJsonValueByIndex(id1, 0) != "0") {
				var resourceids = wuiUtil.getJsonValueByIndex(id1, 0);
				var resourcename = wuiUtil.getJsonValueByIndex(id1, 1);
				var sHtml = "";
				resourceids = resourceids.substr(0);
				resourcename = resourcename.substr(0);
				jQuery("#" + inputname).val(resourceids);
				var resourceidArray = resourceids.split(",");
				var resourcenameArray = resourcename.split(",");

				if(!!countEleID) {
					//jQuery("#" + countEleID).children("Table").find("TD[class=signcountClass_center]").html(resourceidArray.length);
					//resourcename = resourcename.replace(/\,/g,",  ");
					//jQuery("#" + countEleID).html("");
					//jQuery("#" + countEleID).show();
				}

				for(var _i = 0; _i < resourceidArray.length; _i++) {
					var curid = resourceidArray[_i];
					var curname = resourcenameArray[_i];
					//unselectable=\"off\" contenteditable=\"false\"
					if(type1 === 37) {
						//sHtml = sHtml + "<a href='javascript:void 0' onclick=\"parent.addDocReadTag('" + curid + "');parent.openFullWindowHaveBar('/docs/docs/DocDsp.jsp?id=" + curid + "&isrequest=1&requestid=<%="-1".equals(requestid) ? "{#[currentRequestid]#}" : requestid %>')\" title='" + curname + "'>" + curname + "</a>";
						sHtml = sHtml + "<a href='/docs/docs/DocDsp.jsp?id=" + curid + "&isrequest=1&requestid=" + requestid + "'  target='_blank' title='" + curname + "' style=\"color:#123885;\" >" + curname + "</a>&nbsp;&nbsp;";
						//sHtml += "<a href='/docs/docs/DocDsp.jsp?id="+curid+"&requestid=<%=requestid%>' target='_blank' style=\"color:#123885;\">"+curname+ "</a>&nbsp;&nbsp;"; 
					} else {
						//sHtml = sHtml + "<a href=" + linkurl + curid + " target='_blank'>" + curname + "</a> &nbsp; ";                	  
						sHtml += "<a href='/workflow/request/ViewRequest.jsp?f_weaver_belongto_userid=" + userid + "&f_weaver_belongto_usertype=0&requestid=" + curid + "&isrequest=1' target='_blank' style=\"color:#123885;\">" + curname + "</a>&nbsp;&nbsp;";
					}
				}
				jQuery("#" + countEleID).html(sHtml);
				var editorid = "remark";
				try {
					UE.getEditor(editorid).setContent(" &nbsp;" + sHtml, true);
				} catch(e) {}
				try {
					var _targetobj;
					var _targetobjimg = "";
					var _targetobjClass = "";
					if(type1 == 152) { //相关流程
						_targetobj = jQuery(".edui-for-wfwfbutton").children("div").children("div").children("div").children(".edui-metro");
						_targetobjClass = "wfres_3";
					} else {
						_targetobj = jQuery(".edui-for-wfdocbutton").children("div").children("div").children("div").children(".edui-metro");
						_targetobjClass = "wfres_2";
					}
					//alert(_targetobj.css("background"));
					if(resourceidArray.length != 0) {
						_targetobj.addClass(_targetobjClass + "_slt");
						_targetobj.removeClass(_targetobjClass);
					} else {
						_targetobj.addClass(_targetobjClass);
						_targetobj.removeClass(_targetobjClass + "_slt");
					}
				} catch(e) {}
			} else {
				jQuery("#" + inputname).val("");
				if(!!countEleID) {
					jQuery("#" + countEleID).children("Table").find("TD[class=signcountClass_center]").html("0");
					jQuery("#" + countEleID).hide();
				}

				try {
					var _targetobj;
					var _targetobjimg = "";
					var _targetobjClass = "";
					if(type1 == 152) { //相关流程
						_targetobj = jQuery(".edui-for-wfwfbutton").children("div").children("div").children("div").children(".edui-metro");
						_targetobjClass = "wfres_3";
					} else {
						_targetobj = jQuery(".edui-for-wfdocbutton").children("div").children("div").children("div").children(".edui-metro");
						_targetobjClass = "wfres_2";
					}
					//alert(_targetobj.css("background"));
					_targetobj.addClass(_targetobjClass);
					_targetobj.removeClass(_targetobjClass + "_slt");
				} catch(e) {}
			}
		}
	};
	dialog.Height = 620;
	if(type1 === 37) {
		//dialog.Title = "<%=SystemEnv.getHtmlLabelName(857,user.getLanguage())%>";
	} else {
		//dialog.Title = "<%=SystemEnv.getHtmlLabelName(1044,user.getLanguage())%>";
		if(jQuery.browser.msie) {
			dialog.Height = 570;
		} else {
			dialog.Height = 570;
		}
	}

	dialog.Drag = true;
	//dialog.maxiumnable = true;
	dialog.show();
	if(isFormSignature == '1') {
		//当有弹窗时关闭表单签章,否则显示白色底色和弹窗冲突
		if(top.Dialog._Array.length == 1) {
			var consTimer = window.setInterval(function() {
				if(top.Dialog._Array.length < dialognum) {
					jQuery("[id^=Consult]").show();
					clearInterval(this);
				} else {
					jQuery("[id^=Consult]").hide();
				}
			}, 300);
		}
	}
}

window.onShowSignBrowser4signinput = onShowSignBrowser4signinput;

const image_resize = (_this, ifrmID) => {
	var innerWidth = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth);
	var imgWidth = $(_this).width();
	var imgHeight = $(_this).height();
	var iframeWidth = 0;
	if(jQuery("iframe[name^=FCKsigniframe]").size() > 0)
		iframeWidth = (jQuery("iframe[name^=FCKsigniframe]").width()) * 0.6;
	else {
		//iframeWidth = ($(_this).closest("td[name='signContentTd']").width()*0.8)*0.6;
		iframeWidth = window.innerWidth * 0.25;
	}
	if(imgWidth >= iframeWidth) {
		var variable = imgWidth / iframeWidth;
		var variableWidth = imgWidth / variable;
		var variableHeight = imgHeight / variable;
		if(variableHeight >= 250) {
			var coefficient = variableHeight / 250;
			var coefficientWidth = variableWidth / coefficient;
			var coefficientHeight = variableHeight / coefficient;
			jQuery(_this).width(coefficientWidth);
			jQuery(_this).height(coefficientHeight);
			jQuery(_this).closest(".small_pic").width(coefficientWidth);
			jQuery(_this).closest(".small_pic").height(coefficientHeight);
		} else {
			jQuery(_this).width(variableWidth);
			jQuery(_this).height(variableHeight);
			jQuery(_this).closest(".small_pic").width(variableWidth);
			jQuery(_this).closest(".small_pic").height(variableHeight);
			//jQuery(_this).width(iframeWidth);
			//jQuery(_this).removeAttr("height");
			//jQuery(_this).css("height", "");
			//jQuery(_this).closest(".small_pic").width(iframeWidth);
		}
	} else {
		if(imgHeight >= 250) {
			var coefficient = imgHeight / 250;
			var coefficientWidth = imgWidth / coefficient;
			var coefficientHeight = imgHeight / coefficient;
			jQuery(_this).width(coefficientWidth);
			jQuery(_this).height(coefficientHeight);
			jQuery(_this).closest(".small_pic").width(coefficientWidth);
			jQuery(_this).closest(".small_pic").height(coefficientHeight);
		} else {
			jQuery(_this).width(imgWidth);
			jQuery(_this).height(imgHeight);
			jQuery(_this).closest(".small_pic").width(imgWidth);
			jQuery(_this).closest(".small_pic").height(imgHeight);
		}
	}
	if(!!document.getElementById(ifrmID))
		ifrResize(document.getElementById(ifrmID).contentWindow.document, ifrmID, 1);
	//jQuery(_this).parent().style.cursor = 'url(images/right.ico),auto;'
}

window.image_resize = image_resize;

const quoteClick = (data) => {
	let bodyhtml = '';
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+|\n+|\r+$/g, '');
	};
	var srcHtml__ = data.get('log_remarkHtml');
	/////////将引用的img过滤
	if(srcHtml__.indexOf("small_pic") > -1 || srcHtml__.indexOf("SMALL_PIC") > -1) {
		var firstnum = srcHtml__.indexOf("<div");
		if(firstnum == -1) {
			firstnum = srcHtml__.indexOf("<DIV");
		}
		var begin_srcHtml = srcHtml__.substring(0, firstnum);
		var cycle_begin = "";
		var new_srcHtml = "";
		var end_srcHtml = "";
		var divwords = "";

		//alert(srcHtml__);
		var cycleString = srcHtml__.substring(firstnum);
		while(cycleString.indexOf("<img") > -1 || cycleString.indexOf("<IMG") > -1) {
			//得到div图片之间的文字
			var j = cycleString.indexOf("</div");
			if(j == -1) {
				j = cycleString.indexOf("</DIV");
			}
			var divwordstemp = cycleString.substring(j + 6);
			var k = divwordstemp.indexOf("<div");
			if(k == -1) {
				k = divwordstemp.indexOf("<DIV");
			}
			divwords = divwordstemp.substring(0, k);
			begin_srcHtml += divwords;
			//第一个img
			var b = cycleString.indexOf("<img");
			if(b == -1) {
				b = cycleString.indexOf("<IMG");
			}
			cycleString = cycleString.substring(b);
			var e = cycleString.indexOf(">");
			cycleString = cycleString.substring(e + 1);
			//第二个img
			var m = cycleString.indexOf("<img");
			if(m == -1) {
				m = cycleString.indexOf("<IMG");
			}
			cycleString = cycleString.substring(m);
			var imgString = "";
			var n = cycleString.indexOf(">");
			imgString = cycleString.substring(0, n);
			cycleString = cycleString.substring(n + 1);
			imgString = imgString.replace("class=\"maxImg\"", "");
			begin_srcHtml += "<p> " + imgString + "/> </p>";
			end_srcHtml = cycleString;
		}
		var r = end_srcHtml.indexOf("</div>");
		if(r == -1) {
			r = end_srcHtml.indexOf("</DIV>");
		}
		end_srcHtml = end_srcHtml.substring(r + 6);
		begin_srcHtml += end_srcHtml;
		//alert(end_srcHtml);
		srcHtml__ = begin_srcHtml;
	}
	bodyhtml = srcHtml__;

	let title = '引用';
	if(data.get('isexsAgent')) {
		title += " <font color='#3F9AFF'>" + data.get('displaybyagentname') + "->" + data.get('displayname') + "</font> ";
	} else {
		title += " <font color='#3F9AFF'>" + data.get('displayname') + "</font> ";
	}

	title += data.get('displaydepname') + " " + data.get('log_operatedate') + " " + data.get('log_operatetime');

	let container__ = "<span><div style='text-indent:0px;padding-left:10px;font-family:微软雅黑;border:1px solid #ddeaf6;;padding-top:10px;background:#f9fcff;'>" +
		"    <span style='text-indent:0px;padding-left:10px;color:#6b6b6b;font-family:微软雅黑;font-size:12px'>" + title + "</span>" +
		jQuery("<div></div>").append(bodyhtml).html() +
		"</div></span>";

	content__ = container__.replace(/<p><br\/><\/p>/, "").replace(/&nbsp;/, "").replace(/\:/, "");
	var _editor__ = UE.getEditor('remark');
	_editor__.setContent(content__ + "<br>", true);
	_editor__.focus(true);
	_editor__.setContent("<br>", true);

	FCKEditorExt.updateContent('remark');
	_editor__.focus(true);

	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.controlSignInput(true));

	try {
		let remarktop  = parseInt(jQuery("#remark").offset().top);
		if(remarktop == 0){
			remarktop = parseInt(jQuery("#remarkShadowDiv").offset().top);
		}
		let scrolltop = 0;
		if(remarktop  < 200){
			if(remarktop < 0) remarktop = remarktop * -1;
			scrolltop = jQuery('.wea-new-top-req-content').scrollTop() - remarktop - jQuery('.wea-new-top-req').height() -100;
			jQuery('.wea-new-top-req-content').animate({ scrollTop: scrolltop + "px" }, 500);
		}
	} catch(e) {}
}

window.quoteClick = quoteClick;

//临时方案
const readCookie = (name) => {
	return 7;
}

window.readCookie = readCookie;

//重新load签字意见
const e9signReload = () => {
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.setLoglistTabKey(1,''));
	window.store_e9_workflow.dispatch(window.action_e9_workflow.WorkflowReqAction.setlogParams({pgnumber:1,firstload:false,atmet:''}));
}

window.e9signReload = e9signReload;

//打开位置
const openMap =(lng,lat,addr) =>{
	var dlg=new window.top.Dialog();//定义Dialog对象
	dlg.Model=true;
	dlg.Width=900;//定义长度
	dlg.Height=600;
	dlg.URL="/systeminfo/BrowserMain.jsp?url=" + escape("/workflow/ruleDesign/showLocateOnline.jsp?useType=2&lng=" + lng +"&lat=" + lat + "&addr=" + encodeURI(addr) );
	dlg.Title=SystemEnv.getHtmlNoteName(4083,readCookie("languageidweaver"));
	dlg.callback=function(data){}
	dlg.show();	
}

window.openMap = openMap;