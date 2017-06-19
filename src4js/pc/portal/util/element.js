/** --------- 通用js函数 -----------**/
//是否加载iframe元素
var _isLoadIframe = function(){
	const paramsObj = window.store_e9_element.getState().portal.get("params").toJSON();
	const params = paramsObj[window.global_hpid+"-"+window.global_isSetting];
	if(params) return params.loadIframe !== 'false';
	return true;
}
window._isLoadIframe = _isLoadIframe;

//获取html自定义属性名称
var _handleAttrName = function(attr){
	var arr = ['1','2','3','4','5']; 
	if(arr.contains(global_bLayoutid)){
		return "data-"+attr;
	}else{
		return attr;
	}
}
window._handleAttrName = _handleAttrName;
//生成随机数
var _uuid = function() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23]; // s[8] = s[13] = s[18] = s[23] = "-";
	var uuid = s.join("");
	return uuid;
}

window._uuid = _uuid;

//判断是否为空
var _isEmpty = function(value) {
	var type;
	if (value == null) { // 等同于 value === undefined || value === null
		return true;
	}
	type = Object.prototype.toString.call(value).slice(8, -1);
	switch (type) {
		case 'String':
			return !$.trim(value);
		case 'Array':
			return !value.length;
		case 'Object':
			return $.isEmptyObject(value); // 普通对象使用 for...in 判断，有 key 即为 false
		default:
			return false; // 其他对象均视作非空
	}
}
window._isEmpty = _isEmpty;

var _isHtml = function(htmlStr) {  
  if(!htmlStr) return false;
  var reg = /<[^>]+>/g;  
  return reg.test(htmlStr) || htmlStr.indexOf("&")>-1;  
} 

window._isHtml = _isHtml;

//字符串转int并判断是不是字符串，否则返回默认值
var _s2Int = function(s) {
	return _str2Int(s, -1);
}

window._s2Int = _s2Int;

var _str2Int = function(s, def) {
	return isNaN(parseInt(s)) ? (isNaN(parseInt(def)) ? -1 : parseInt(def)) : parseInt(s);
}
window._str2Int = _str2Int;

var openLinkUrl = function(url, linkmode,event) {
	if (event != undefined) {
        var domobj = event.currentTarget;
        var imgObj = $(domobj).closest('span').find("img");
        var fontObj = $(domobj).closest('span').find("font");
        $(imgObj).css("display", "none");
    }
    if (!url) return;
    var index = url.indexOf("/main/workflow/req");
    if(index !== -1){
        openSPA4Single(url);
        return;
    }
    if (index === -1) {
        linkmode = '2';
    }
    switch (linkmode) {
        case '1':
            if (index !== -1)
                weaHistory.push({
                    pathname: url
                });
            else
                window.location.href = url;
            break;
        case '2':
            var redirectUrl = url;
            var width = screen.availWidth;
            var height = screen.availHeight;
            var szFeatures = "top=0,";
            szFeatures += "left=0,";
            if (url.indexOf("ebaseid=15") != -1) {
                //td61285
                //szFeatures +="width=800," ;
                szFeatures += "width=" + (width - 10) + ",";
            } else {
                szFeatures += "width=" + (width - 10) + ",";
            }
            szFeatures += "height=" + (jQuery.browser.msie ? height : (height - 60)) + ",";
            szFeatures += "directories=no,";
            szFeatures += "status=yes,";
            szFeatures += "menubar=no,";
            szFeatures += "scrollbars=yes,";
            szFeatures += "resizable=yes";
            window.open(redirectUrl, "", szFeatures);
            break;
        default:
            window.open(url);
            break;
    }
}

window.openLinkUrl = openLinkUrl;

function elmentReLoad(ebaseid){
	$(".item[data-ebaseid="+ebaseid+"]").attr('data-needRefresh','true');
	var config = window.store_e9_element.getState().elements.get("config").toJSON();
	for(var eid in config){
		var ele = config[eid];
		if(ele.item.ebaseid === '8'){
		    var params = ele.params;
			if(!window.global_isremembertab){
			    var tabidObj = window.store_e9_element.getState().eworkflowtab.get("tabid").toJSON();
			    var tabid = tabidObj[eid];
			    params['tabid'] = tabid;
				window.store_e9_element.dispatch(window.action_e9_element.EWorkflowTabAction.getWorkflowTabDatas(params));
			}else{
				window.store_e9_element.dispatch(window.action_e9_element.EWorkflowAction.handleRefresh(params));
			}
		}
	}
	$(".item[data-ebaseid="+ebaseid+"] ").find(".td-span").each(function(){
		var img = $(this).find("img").css("display","");
  });
}
window.elmentReLoad = elmentReLoad;

/** --------- 通用js函数 -----------**/

window.currentSelectDate = new Date().format("yyyy-MM-dd");
function dateCellRender(eid, data, value){
	var dataStr1 = new Date(value.time).format('yyyy-M-d');
	var dateStr = new Date(value.time).format('yyyy-MM-dd');
	var dateevents = data.dateevents;
	var events = data.events;
	var isRender = false;
	for (var dateKey in dateevents) {
		if (dateKey === dateStr) {
			var attrs = {
				size: dateevents[dateKey].length
			};
			var html = dateevents[dateKey].map(function(dKey, v){
				var dData = events[dKey];
				attrs['event' + v] = dData[0] + "-split-" + dData[2] + "-split-" + dData[4] + "-split-" + dData[5];
			});
			$("#calendar_" + eid + " .ant-fullcalendar-cell[title='" + dataStr1 + "'] .ant-fullcalendar-value").attr(attrs).addClass("ant-fullcalendar-event");
			isRender = true; 
		}
	}
	if(dateStr===currentSelectDate){
		$("#calendar_" + eid + " .ant-fullcalendar-cell[title='" + dataStr1 + "'] .ant-fullcalendar-value").addClass("ant-fullcalendar-current");
	}
	if(!isRender){//没有时候去掉所有的event
		var curObj = $("#calendar_" + eid + " .ant-fullcalendar-cell[title='" + dataStr1 + "'] .ant-fullcalendar-value")
		if(curObj.attr("size")){
			var size = eval(curObj.attr("size"))
			for(var i =0;i<size;i++){
				curObj.removeAttr("event"+i)
			}
			curObj.removeAttr("size")
		}
	}
}

window.dateCellRender = dateCellRender;

function doAdd(userid,eid){
	var calendarDialog = new Dialog();
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var selectDate = year + "-" + (month > 9 ? month : "0" + month) + "-" + (day > 9 ? day : "0" + day);
	if (currentSelectDate != '') {
		selectDate = currentSelectDate;
	}
	var beginTime = (hours > 9 ? hours : "0" + hours) + ":" + (minutes > 9 ? minutes : "0" + minutes);
	var url = '/workplan/data/WorkPlanEdit.jsp?from=1&selectUser='+userid+'&planName=&beginDate=' + selectDate + '&beginTime=' + beginTime + '&endDate=' + selectDate + '&endTime=';
	//openFullWindowHaveBar(url);

	if (window.top.Dialog) {
		calendarDialog = new window.top.Dialog();
	} else {
		calendarDialog = new Dialog();
	};
	calendarDialog.URL = url;
	calendarDialog.Width = 600;
	calendarDialog.Height = 600;
	calendarDialog.checkDataChange = false;
	calendarDialog.Title = "日程";
	calendarDialog.callbackfunc4CloseBtn=function(){
		window.getMyCalendarDatas(currentSelectDate,"month",eid);
	}
	var hasRfdh = true;
	calendarDialog.show();
}

window.doAdd = doAdd;

var refreshCalendar = function(eid){
	$("#toolbar_"+eid+" [name=refreshbtn] img").trigger('click')
	setTimeout(function(){
		if($("#calendar_"+eid+" .ant-fullcalendar-current")){
			$("#calendar_"+eid+" .ant-fullcalendar-current").trigger('click')
		}
	},100)
}

window.refreshCalendar = refreshCalendar;

/** --------- 日历日程js函数 -----------**/
var clickCalendarDay = function(obj,eid){
	$("#calendar_"+eid).find(".ant-fullcalendar-current").removeClass("ant-fullcalendar-current");
	var title = $(obj).attr("title");
	var ndate = "";
	var currentMonthStr =  "";
	if(title) {
		var titlearr =  title.split("-");
		ndate = titlearr[0];
		currentMonthStr = titlearr[0];
		if(parseInt(titlearr[1]) < 10){
			ndate = ndate + "-0" + titlearr[1];
			currentMonthStr = currentMonthStr + "-0"+titlearr[1];
		}else{
			ndate = ndate + "-" + titlearr[1];
			currentMonthStr = currentMonthStr + "-"+titlearr[1];
		}
		if(parseInt(titlearr[2]) < 10){
			ndate = ndate + "-0" + titlearr[2];
		}else{
			ndate = ndate + "-" + titlearr[2];
		}
		
	}
	if(ndate){
		currentSelectDate = ndate;
	}
	//判断点击的是否为当前显示月份，否的话刷新新月份的日历日程，并默认选中所点击的日期
	if(currentMonthStr !== currentMonth){
		currentMonth = currentMonthStr;
		window.getMyCalendarDatas(currentSelectDate,"month",eid);
	}
	var dom = $(obj).find(".ant-fullcalendar-event");
	var size = _str2Int($(dom).attr("size"),0);
	var htmlArr = new Array;
	var height = size * 34;
	htmlArr.push("<div id='planDataEvent' class='planDataEvent' style='height:"+(height+1)+"px; overflow-y: hidden; outline: none;'><div id='planDataEventchd' style='height:"+height+"px;'>");
	for (var i = 0; i < size; i++) {
		var event = $(dom).attr("event"+i);
		if(!_isEmpty(event)){
			var arr = event.split("-split-");
			htmlArr.push("<div class='hand dataEvent' height='34px' onclick='clickData(" + arr[0] + "," + eid + ")' title="+arr[1]+">");
			htmlArr.push("<div class='dataEvent1' style='background:#a32929;'></div>");
			htmlArr.push("<div class='dataEvent2'><div class='dataEvent2_1'>"+arr[2]+"&nbsp;&nbsp;"+arr[3]+"</div></div>");
			htmlArr.push("<div class='dataEvent3'>"+arr[1]+"</div>");
			htmlArr.push("</div>");
		}
	}
	htmlArr.push("</div></div>");
	$("#calendar_content"+eid).html(htmlArr.join(''));
}


window.clickCalendarDay = clickCalendarDay;

//点击数据
var clickData = function(id,eid){
	var url = '/workplan/data/WorkPlanDetail.jsp?from=1&workid=' + id;
	//openFullWindowHaveBar(url);
	var calendarDialog = new Dialog();
	if (window.top.Dialog) {
		calendarDialog = new window.top.Dialog();
	} else {
		calendarDialog = new Dialog();
	};
	var hasRfdh = true;
	calendarDialog.URL = url;
	calendarDialog.Width = 600;
	calendarDialog.Height = 600;
	calendarDialog.checkDataChange = false;
	calendarDialog.Title = "日程";
	calendarDialog.callbackfunc4CloseBtn=function(){
		window.getMyCalendarDatas(currentSelectDate,"month",eid);
	}
	calendarDialog.show();
}

window.clickData = clickData;
/** --------- 日历日程js函数 -----------**/


/** --------- 便签元素相关js函数 -----------**/
function getBytesLength(str) {
    // 在GBK编码里，除了ASCII字符，其它都占两个字符宽
    return str.replace(/[^\x00-\xff]/g, 'xx').length;
}
/**
* 根据字符长来截取字符串
*/
function subStringByBytes(val, maxBytesLen) {
    var len = maxBytesLen;
    var result = val.slice(0, len);
    while (getBytesLength(result) > maxBytesLen) {
        result = result.slice(0, --len);
    }
    return result;
}

window.getBytesLength = getBytesLength;
window.subStringByBytes = subStringByBytes;
/** --------- 便签元素相关js函数 -----------**/


/** --------- 元素收缩/展开功能 -----------**/
//homepage_js.jsp
function onShowOrHideE(eid){	
	$("#content_"+eid).toggle();
}

window.onShowOrHideE = onShowOrHideE;
/** --------- 元素收缩/展开功能 -----------**/

/** --------- 图片元素相关js -----------**/
function loadPictureJs(eid, picturewidth, autoShowSpeed, highopen) {
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
/*			$("#pictureback_" + eid).hide();
			$("#picturenext_" + eid).hide();*/
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
					var refstr = $($img).attr("data-ref");
					if ($.trim(refstr) != "#") {
						this.title = '<a href="' + refstr + '" style="color:#000000!important;text-decoration:none!important;" target="_blank">' + this.title + '</a> ';
					}
				}
			});
		})
	}
}
window.loadPictureJs = loadPictureJs;
/** --------- 图片元素相关js -----------**/

