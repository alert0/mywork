//门户刷新函数
var onRightClickMenuShow = function(position){
	window.store_e9_element.dispatch(window.action_e9_element.RightClickMenuAction.showRightClickMenu(position));
}
window.onRightClickMenuShow = onRightClickMenuShow;

//门户刷新函数
var onRightClickMenuClose = function(type){
	window.store_e9_element.dispatch(window.action_e9_element.RightClickMenuAction.closeRightClickMenu(type));
}
window.onRightClickMenuClose = onRightClickMenuClose;

var bindRightClickEvent = function(){
	//屏蔽浏览器右键
	$(".homepage").unbind("mousedown").bind("contextmenu", function (e) {
	    e.preventDefault();
	    return false;
	});
	//屏蔽浏览器右键
	$(".homepage").unbind("mousedown").bind("mousedown", function (event) {
	    if (event.which == 3) {
	    	const position = {
	    		left: event.pageX - $(".homepage").offset().left,
	    		top: event.pageY- $(".homepage").offset().top
	    	}
	    	const pos = {
	    		height : window.innerHeight - event.pageY,
	    		width : window.innerWidth - event.pageX,
	    		position : position
	    	}
	        onRightClickMenuShow(pos);
	    }else if(event.which == 1){
	    	var e = event || window.event;
			var ele = e.srcElement || e.target;
			var rcdom = $(ele).parents(".rightclickmenu");
			if(!rcdom[0]){//鼠标点击的范围不在指定范围内
			    onRightClickMenuClose();
			}
	    }
	});
}
window.bindRightClickEvent = bindRightClickEvent;

//门户刷新函数
var refreshPortal = function(){
	const paramsObj = window.store_e9_element.getState().portal.get("params").toJSON();
	const params = paramsObj[window.global_hpid+"-"+window.global_isSetting];
	window.isRefreshPortal = true;
	window.store_e9_element.dispatch(window.action_e9_element.PortalAction.getPortalDatas(params));
}
window.refreshPortal = refreshPortal;


//门户刷新函数
var getHpName = function(){
	const hpNameObj = window.store_e9_element.getState().portal.get("hpdata").toJSON();
	const hpdata = hpNameObj[window.global_hpid+"-"+window.global_isSetting];
	var hpname = "";
	if(hpdata && hpdata.hpinfo){
		hpname = hpdata.hpinfo.hpname;
	}
	return hpname;
}
window.getHpName = getHpName;

//重写map函数，实现间隔遍历
Array.prototype.map = function(fn, mul = 1) {
	var a = [];
	for (var i = 0; i < this.length; i += mul) {
		var value = fn(this[i], i);
		if (value == null) {
			continue; //如果函数fn返回null，则从数组中删除该项
		}
		a.push(value);
	}
	return a;
};

//数组contains函数
Array.prototype.contains = function (element) {  
	for (var i = 0; i < this.length; i++) { 
		if (this[i] == element) {  
			return true; 
		}
	}
	return false; 
} 


//获取当前时间戳(以s为单位)
Date.prototype.format = function(format) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
}

jQuery.curCSS = function( elem, name ) {
  var ret = '0px';
  var style = elem.style;
  if(window.getComputedStyle){
      var computed = window.getComputedStyle( elem, null );
      if ( computed ) {
          //getPropertyValue兼容ie9获取filter:Alpha(opacity=50)
          ret = computed.getPropertyValue( name ) || computed[ name ];
          //如果是动态创建的元素，则使用style方法获取样式
          if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
              ret = jQuery.style( elem, name );
          }
      }
  }
  return ret;
};
window.wemail;
window.whrm;
window.wmess;
window.wmsm;
window.W = 0; //È¡µÃÆÁÄ»·Ö±æÂÊ¿í¶È
window.H = 0; //È¡µÃÆÁÄ»·Ö±æÂÊ¸ß¶È
window.userid = "";
window.tousername;
//»ñµÃ´°¿Ú¿í¶È 
function getWin() {
	if (window.innerWidth) {
		W = window.innerWidth;
	} else if ((document.body) && (document.body.clientWidth)) {
		W = document.body.clientWidth;
	}
	// »ñµÃ´°¿Ú¸ß¶È 
	if (window.innerHeight) {
		H = window.innerHeight;
	} else if ((document.body) && (document.body.clientHeight)) {
		H = document.body.clientHeight;
	}
	if (document.documnetElement && document.documnetElement.clientHeight && document.documnetElement.clientWidth) {
		W = document.documnetElement.clientWidth;
		H = document.documnetElement.clientHeight;
	}

}
window.getWin = getWin;

window.oIframe = document.createElement('iframe');
window.message_table_Div = document.createElement("div");
window.content = null;

if (M('mainsupports') != null) {
	content = M('mainsupports').innerHTML;
}

function M(id) {
	var result = document.getElementById(id);
	if (result == null) {
		result = parent.document.getElementById(id);
	}
	if (result == null) {
		result = parent.parent.document.getElementById(id);
	}
	if (result == null) {
		result = parent.parent.parent.document.getElementById(id);
	}
	return result;
}

window.M = M;

function MC(t) {
	return document.createElement(t);
};
window.MC = MC;

function isIE() {
	return (document.all && window.ActiveXObject && !window.opera) ? true : false;
}

window.isIE = isIE;

window.bodySize = [];
window.clickSize = [];

function getBodySize() {
	return bodySize;
}

window.getBodySize = getBodySize;

function getClickSize() {
	return clickSize;
}

window.getClickSize = getClickSize;

function pointerXY(event, doc) {
	/*if(event.pageX||event.pageY)
	{
		bodySize[0] = event.pageX;
		bodySize[1] = event.pageY;
		clickSize[0] = event.pageX;
		clickSize[1] = event.pageY;
	}
	else
	{
		bodySize[0] = event.clientX + document.body.scrollLeft+document.documentElement.clientWidth;
		bodySize[1] = event.clientY + document.body.scrollTop+document.documentElement.clientHeight;
		clickSize[0] = event.clientX;
		clickSize[1] = event.clientY;
	}*/
	var evt = event || window.event;
	bodySize[0] = jQuery(window).width();
	bodySize[1] = jQuery(window).height();
	var targ = evt.srcElement ? evt.srcElement : evt.target;
	clickSize[0] = jQuery(targ).offset().left;
	clickSize[1] = jQuery(targ).offset().top;
	clickSize[2] = jQuery(targ).height();
	alert(bodySize[0]+"::"+bodySize[1]+":::"+clickSize[0]+"::"+clickSize[1]);
}

window.pointerXY = pointerXY;

function pointerXYByWfSign(event, doc) {
	var id = jQuery(doc.body).attr("class");
	var offset = jQuery(document).find("#" + id).offset();
	var left = offset.left;
	var top = offset.top;

	if (event.pageX || event.pageY) {
		bodySize[0] = event.pageX + left;
		bodySize[1] = event.pageY + top;
		clickSize[0] = event.pageX + left;
		clickSize[1] = event.pageY + top;
	} else {
		bodySize[0] = event.clientX + document.body.scrollLeft + document.documentElement.clientWidth + left;
		bodySize[1] = event.clientY + document.body.scrollTop + document.documentElement.clientHeight + top;
		clickSize[0] = event.clientX + left
		clickSize[1] = event.clientY + top;
	}
}

window.pointerXYByWfSign = pointerXYByWfSign;

function pointerXYByWfSign2(event, doc) {
	var id = jQuery(doc.body).attr("class");
	var offset = jQuery(document).find("#" + id).offset();
	var left = offset.left;
	var top = offset.top;

	if (event.pageX || event.pageY) {
		bodySize[0] = event.pageX + left;
		bodySize[1] = event.pageY + top;
		clickSize[0] = event.pageX + left;
		clickSize[1] = event.pageY + top;
	} else {
		bodySize[0] = event.clientX + document.body.scrollLeft + document.documentElement.clientWidth + left;
		bodySize[1] = event.clientY + document.body.scrollTop + document.documentElement.clientHeight + top;
		clickSize[0] = event.clientX + left
		clickSize[1] = event.clientY + top;
	}
}

window.pointerXYByWfSign2 = pointerXYByWfSign2;

function pointerXYByObj(obj) {

	var p = $(obj).position()
	bodySize[0] = p.left;
	bodySize[1] = p.top;
	clickSize[0] = p.left;
	clickSize[1] = p.top;

}
window.pointerXYByObj = pointerXYByObj;

//ÈÃ²ãÏÔÊ¾Îª¿é 
function openResource() {
	var submitURL = "/hrm/resource/simpleHrmResourceTemp.jsp?userid=" + userid + "&date=" + new Date();
	postXmlHttp(submitURL, "showResource()", "loadEmpty()");
}

window.openResource = openResource;

function loadEmpty() {
	void(0);
}

window.loadEmpty = loadEmpty;

function showResource() {
	var userinfo = _xmlHttpRequestObj.responseText;
	var re = /\$+([^\$]+)/ig; // ´´½¨ÕýÔò±í´ïÊ½Ä£Ê½¡£ 
	var arr;
	var i = 0;
	var language = readCookie("languageidweaver");

	var lastname = "";
	var mobile = "";
	var telephone = "";
	var email = "";
	var jobtitle = "";
	var departmentname = "";
	var location = "";


	while ((arr = re.exec(userinfo)) != null) {
		var result = arr[1];

		if (result == "noright") {
			var noright = SystemEnv.getHtmlNoteName(3420, languageid);
			/*if(language==7||language==9){
				noright = "¶Ô²»Æð£¬ÄúÔÝÊ±Ã»ÓÐÈ¨ÏÞ£¡";
			} else {
				noright = "Sorry,you haven''t popedom temporarily!";
			}*/
			M("message_table").innerHTML = "<div style=\"border:1px solid #aaaaaa;width:100%;height:100%;\"><div style=\"float:right; clear:both; width:100%; text-align:right; margin:5px 0 0 0\"><IMG style=\"COLOR: #262626; CURSOR: hand\" id=closetext onclick=javascript:closediv(); src=\"http://localhost:8080/images/messageimages/temp/closeicno_wev8.png\" width=34 height=34></div><div style=\"text-indent:1.5pc; line-height:21px \"><b>" + noright + "</b></div></div>";
			return;
		}
		if (result == ',') {
			result = "";
			M("result" + i).innerHTML = result;
		} else {
			if (result == 'Mr.' || result == 'Ms.') {
				if (language == 7 || language == 9) {
					if (result == 'Mr.') {

						M("result" + i).innerHTML = "£¨" + SystemEnv.getHtmlNoteName(3421, languageid) + "£©";
					} else if (result == 'Ms.') {
						M("result" + i).innerHTML = "£¨" + SystemEnv.getHtmlNoteName(3422, languageid) + "£©";
					}
				} else {
					M("result" + i).innerHTML = result;
				}
			} else if (result.indexOf("imageid=") != -1) {
				var resourceimageid = result.substring(8, result.length);
				if (resourceimageid != "" && resourceimageid != "0") {
					M("resourceimg").src = "/weaver/weaver.file.FileDownload?fileid=" + resourceimageid;
					M("resourceimghref").href = "/weaver/weaver.file.FileDownload?fileid=" + resourceimageid;
				} else {
					if (M("result2").innerHTML == "£¨" + SystemEnv.getHtmlNoteName(3421, languageid) + "£©" || M("result2").innerHTML == "Mr.") {
						M("resourceimg").src = "/images/messageimages/temp/man_wev8.png";
					} else {
						M("resourceimg").src = "/images/messageimages/temp/women_wev8.png";
					}
					M("resourceimghref").href = "javascript:void(0);"
				}
			} else if (result.indexOf("ip=") != -1) {
				var isonline = result.substring(3, result.length);
				if (isonline == ',') {
					M("isonline").src = "/images/messageimages/temp/offline_wev8.png";
					if (language == 7 || language == 9) {
						M("isonline").title = SystemEnv.getHtmlNoteName(3423, languageid);
					} else {
						M("isonline").title = SystemEnv.getHtmlNoteName(3423, languageid);
					}
					M("result0").innerHTML = "";
				} else {
					M("isonline").src = "/images/messageimages/temp/online_wev8.png";
					if (language == 7 || language == 9) {
						M("isonline").title = SystemEnv.getHtmlNoteName(3424, languageid);
					} else {
						M("isonline").title = SystemEnv.getHtmlNoteName(3423, languageid);
					}
					M("result0").innerHTML = isonline;
				}
			} else if (result.indexOf("messager") != -1) {
				try {
					M("showMessagerTrForSimpleHrm").style.display = "";
				} catch (e) {}
			} else {
				if (M("result" + i) != null) {
					if (i == 1) {
						M("result" + i).innerHTML = "<a href=\"javascript:void(0)\" style='color: #008df6;' onclick=\"openhrmresource()\">" + result + "</a>";
					} else {
						M("result" + i).innerHTML = result;
					}

					if (i == 1) {
						lastname = result;
					} else if (i == 3) {
						mobile = result;
					} else if (i == 4) {
						telephone = result;
					} else if (i == 5) {
						email = result;
					} else if (i == 9) {
						jobtitle = result;
					} else if (i == 6) {
						departmentname = result;
					} else if (i == 12) {
						location = result;
					}
				}
			}
		}
		i++;
	}
	tousername = M('result1').innerHTML;

	createHrmQRCode(lastname, mobile, telephone, email, jobtitle, departmentname, location);
}

window.showResource = showResource;

function changehrm() {
	var mainsupports = M("mainsupports");
	var bodySize = getBodySize();
	var clickSize = getClickSize();
	/*var wi = W-clickSize[0];
 var hi = H-clickSize[1];
 if(wi<372)
 {
 		wi=bodySize[0]+wi-372;
 }
 else
 {
 		wi = bodySize[0]
 }
 if(hi<230)
 {
 		hi=bodySize[1]+hi-230;
 }
 else
 {
 		hi = bodySize[1];
 }
 

 if(!window.ActiveXObject) {
	   var msfTop = document.body.clientHeight - (bodySize[1] - document.body.scrollTop) - 230;
	   if (msfTop < 0) {
		   hi = bodySize[1] + msfTop;
	   } else {
		   hi = bodySize[1];
	   }
 }*/
	var wi = clickSize[0];
	var hi = clickSize[1] + clickSize[2];
	if (bodySize[0] > 0 && bodySize[0] - wi < 463) {
		wi = clickSize[0] - 463;
	}
	if (bodySize[1] > 0 && bodySize[1] - hi < 300) {
		hi = clickSize[1] - 300;
	}
	if (!hi || hi < 0) hi = 10;
	if (!wi || wi < 0) wi = 10;
	showIframe(mainsupports, hi, wi);
}

window.changehrm = changehrm;

function showIframe(div, hi, wi) {
	div.style.width = 463 + "px";
	div.style.height = 300 + "px";
	div.style.left = wi + "px";
	div.style.top = hi + "px";
	div.style.display = 'block';
	if (content == undefined || content == null) {
		content = M('mainsupports').innerHTML;
	}
	div.innerHTML = "";
	oIframe.id = 'HelpFrame';
	div.appendChild(oIframe);
	oIframe.frameborder = 0;
	oIframe.scrolling = "no";
	//oIframe.src = "#";
	oIframe.style.filter = 'Alpha(Opacity=0);Opacity:0';
	oIframe.style.position = 'absolute';
	oIframe.style.zIndex = 9;

	oIframe.style.width = 463 + "px";
	oIframe.style.height = 300 + "px";
	oIframe.style.top = 'auto';
	oIframe.style.left = 'auto';
	oIframe.style.display = 'block';
	message_table_Div.id = "message_table";
	message_table_Div.className = "xTable_message1";
	div.appendChild(message_table_Div);

	message_table_Div.innerHTML = content;
	message_table_Div.style.position = "absolute"
	message_table_Div.style.width = 455 + "px";
	message_table_Div.style.height = 293 + "px";
	message_table_Div.style.padding = "0px";
	message_table_Div.style.margin = "0px";
	message_table_Div.style.border = "0px";
	message_table_Div.style.zIndex = 10;
	message_table_Div.style.display = "block";
	message_table_Div.style.top = "3px";
	message_table_Div.style.left = "4px";
}

window.showIframe = showIframe;

//´ò¿ªDIV²ã
function openhrm(tempuserid) {
	userid = tempuserid;
	getWin();
	openResource();
	changehrm();
	void(0);
}

window.openhrm = openhrm;

function setUserId(tempuserid) {
	userid = tempuserid;
}

window.setUserId = setUserId;

function openemail() {
	window.open("/email/MailAdd.jsp?isInternal=1&internalto=" + userid);
}

window.openemail = openemail;

function openhrmresource() {
	openFullWindowForXtable("/hrm/HrmTab.jsp?_fromURL=HrmResource&id=" + userid);
}

window.openhrmresource = openhrmresource;

function openmessage() {
	openFullWindowForXtable("/sms/SmsMessageEdit.jsp?hrmid=" + userid);
}

window.openmessage = openmessage;

function doAddWorkPlan() {
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	var url = "/workplan/data/WorkPlan.jsp?resourceid=" + userid + "&add=1";
	dialog.Title = "ÐÂ½¨ÈÕ³Ì";
	dialog.Width = 800;
	dialog.Height = 500;
	dialog.Drag = true;
	dialog.maxiumnable = true;
	dialog.URL = url;
	dialog.show();

}

window.doAddWorkPlan = doAddWorkPlan;

function doAddCoWork() {
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	var url = "/cowork/AddCoWork.jsp?hrmid=" + userid;
	dialog.Title = "ÐÂ½¨Ð­×÷";
	dialog.Width = 800;
	dialog.Height = 500;
	dialog.Drag = true;
	dialog.maxiumnable = true;
	dialog.URL = url;
	dialog.show();
}

window.doAddCoWork = doAddCoWork;

//¹Ø±ÕDIV²ã
function closediv() {
	M('mainsupports').style.display = "none";
	//M('HelpFrame').style.display = 'none';
	M('message_table').style.display = "none";

	void(0);
}

window.closediv = closediv;

function createHrmQRCode(lastname, mobile, telephone, email, jobtitle, departmentname, location) {
	//Éú³É¶þÎ¬Âë	
	var txt = "BEGIN:VCARD \n" +
		"VERSION:3.0 \n" +
		"N:" + lastname + " \n" +
		"TEL;CELL;VOICE:" + mobile + " \n" +
		"TEL;WORK;VOICE:" + telephone + " \n" +
		"EMAIL:" + email + " \n" +
		"TITLE:" + jobtitle + " \n" +
		"ROLE:" + departmentname + " \n" +
		"ADR;WORK:" + location + " \n" +
		"END:VCARD";

	jQuery('#showSQRCodeDiv').qrcode({
		render: 'canvas',
		background: "#ffffff",
		foreground: "#000000",
		msize: 0.3,
		size: 120,
		mode: 0,
		//mode 1,2 ¶þÎ¬ÂëÖÐ²åÈëlable¡¢mode=3»ò4 ¶þÎ¬ÂëÖÐ²åÈë ²åÈë£¬×¢ÒâIE8¼°ÒÔÏÂ°æ±¾²»Ö§³Ö²åÍ¼¼°labelmodeÉèÖÃÎÞÐ§
		label: lastname,
		image: "/images/hrm/weixin_wev8.png",
		text: utf16to8(txt)
	});
	jQuery("#showSQRCodeDiv").hide();
}

window.createHrmQRCode = createHrmQRCode;

function utf16to8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}

window.utf16to8 = utf16to8;

//ÔÚÏßÁÄÌì
function showHrmChat() {
	try {
		top.Page.showMessage(userid);
		/*var docobj="top.hrmChat";
		while (!eval(docobj)) {
		    docobj="opener."+docobj;  
		}
		eval(docobj).sendChatFun(objid);*/
	} catch (e) {
		//alert(e);
	}
}

window.showHrmChat = showHrmChat;


function registerDragEvent(tableId, eid) {
	var fixHelper = function(e, ui) {
		ui.children().each(function() {
			$(this).width($(this).width()); // 在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了

			$(this).height($(this).height());
		});
		return ui;
	};

	var copyTR = null;
	var startIdx = 0;

	var idStr = "#" + tableId + eid;

	jQuery(idStr + " tbody tr").bind("mousedown", function(e) {
		copyTR = jQuery(this).next("tr.Spacing");
	});

	jQuery(idStr + " tbody").sortable({ // 这里是talbe tbody，绑定 了sortable
		helper : fixHelper, // 调用fixHelper
		axis : "y",
		start : function(e, ui) {
			ui.helper.addClass("e8_hover_tr") // 拖动时的行，要用ui.helper
			if (ui.item.hasClass("notMove")) {
				e.stopPropagation && e.stopPropagation();
				e.cancelBubble = true;
			}
			if (copyTR) {
				copyTR.hide();
			}
			startIdx = ui.item.get(0).rowIndex;
			return ui;
		},
		stop : function(e, ui) {
			ui.item.removeClass("e8_hover_tr"); // 释放鼠标时，要用ui.item才是释放的行
			if (ui.item.get(0).rowIndex < 1) { // 不能拖动到表头上方

				if (copyTR) {
					copyTR.show();
				}
				return false;
			}
			if (copyTR) {
				if (ui.item.prev("tr").attr("class") == "Spacing") {
					ui.item.after(copyTR.clone().show());
				} else {
					ui.item.before(copyTR.clone().show());
				}
				copyTR.remove();
				copyTR = null;
			}
			return ui;
		}
	});
}

window.registerDragEvent = registerDragEvent;
