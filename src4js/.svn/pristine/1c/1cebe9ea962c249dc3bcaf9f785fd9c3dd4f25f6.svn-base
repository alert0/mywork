/** --------- 通用js函数 -----------**/
//重写map函数，实现间隔遍历
Array.prototype.map = function(fn, mul) {
    mul = _str2Int(mul, 1);
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
Array.prototype.contains = function(element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            return true;
        }
    }
    return false;
}

import { ELEMENT_TYPES } from '../constants/ActionTypes';


global.isTabE = function(ebaseid){
    var arr = new Array;
    arr.push(ELEMENT_TYPES.UNREAD_DOCS);
    arr.push(ELEMENT_TYPES.MESSAGE_REMINDING);
    arr.push(ELEMENT_TYPES.MY_PROJECTS);
    arr.push(ELEMENT_TYPES.NEW_CUSTOMERS);
    arr.push(ELEMENT_TYPES.NEW_MEETING);
    arr.push(ELEMENT_TYPES.UNREAD_COOPERATION);
    arr.push(ELEMENT_TYPES.DAY_PLAN);
    arr.push(ELEMENT_TYPES.SUBSCRIBE_KONWLEDG);
    arr.push(ELEMENT_TYPES.JOBSINFO);
    arr.push(ELEMENT_TYPES.FAVOURITE);
    arr.push(ELEMENT_TYPES.WORKTASK);
    arr.push(ELEMENT_TYPES.RSS);
    arr.push(ELEMENT_TYPES.OUTDATA);
    arr.push(ELEMENT_TYPES.NEWS);
    arr.push(ELEMENT_TYPES.WORKFLOW);
    arr.push(ELEMENT_TYPES.FORMMODECUSTOMSEARCH);
    arr.push(ELEMENT_TYPES.ADDWF);
    arr.push(ELEMENT_TYPES.BLOGSTATUS);
    arr.push(ELEMENT_TYPES.CONTACTS);
    return arr.contains(ebaseid)
}


global.isHtml = function(htmlStr) {  
    if(!htmlStr) return false;
    var reg = /<[^>]+>/g;  
    return reg.test(htmlStr) || htmlStr.indexOf("&")>-1;  
} 
// 获取当前时间戳(以s为单位)
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

jQuery.curCSS = function(elem, name) {
    var ret = '0px';
    var style = elem.style;
    if (window.getComputedStyle) {
        var computed = window.getComputedStyle(elem, null);
        if (computed) {
            //getPropertyValue兼容ie9获取filter:Alpha(opacity=50)
            ret = computed.getPropertyValue(name) || computed[name];
            //如果是动态创建的元素，则使用style方法获取样式
            if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
                ret = jQuery.style(elem, name);
            }
        }
    }
    return ret;
};

//获取html自定义属性名称
var getAttrName = function(attr) {
    var fixedLayoutIdArr = ['1', '2', '3', '4', '5'];
    if (fixedLayoutIdArr.contains(global_bLayoutid)) {
        return "data-" + attr;
    } else {
        return attr;
    }
}

//判断是否为组件元素
global._isRE = function(ebaseid) {
    //组件元素数组
    var arr = ['1', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '17', '18', '19', '29', '25', '34'];
    arr.push('picture');
    arr.push('addwf');
    arr.push('Slide');
    arr.push('blogStatus');
    arr.push('MyCalendar');
    arr.push('reportForm');
    arr.push('favourite');
    arr.push('contacts');
    arr.push('audio');
    arr.push('outterSys');
    arr.push('DataCenter');
    arr.push('searchengine');
    arr.push('Task');
    arr.push('video');
    arr.push('weather');
    arr.push('Flash');
    arr.push('newNotice');
    arr.push('notice');
    arr.push('menu');
    arr.push("jobsinfo");
    arr.push("OutData");
    arr.push("scratchpad");
    arr.push("16");
    arr.push("32");
    arr.push("plan");
    arr.push("imgSlide");
    arr.push("FormModeCustomSearch");
    var i = arr.length;
    //console.log(" 已封装元素个数  : " + i);
    while (i--) {
        if (arr[i] === ebaseid) {
            return true;
        }
    }
    return false;
}

//生成随机数
global._uuid = function() {
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

//判断是否为空
global._isEmpty = function(value) {
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


//字符串转int并判断是不是字符串，否则返回默认值
global._s2Int = function(s) {
    return _str2Int(s, -1);
}
var _str2Int = function(s, def) {
    return isNaN(parseInt(s)) ? (isNaN(parseInt(def)) ? -1 : parseInt(def)) : parseInt(s);
}

global.openLinkUrl = function(url, linkmode, event) {
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
    if (index !== -1) {
        ifWorkFlowRefrash(); var dom = event.currentTarget;
    var moreurl = $("#more_" + eid).attr("data-morehref");
    if (!moreurl) return;
    if (moreurl.indexOf('/main/workflow/queryFlow') === -1) {
        var tabid = $("#titleContainer_" + eid).find("td[class='tab2selected']").attr("data-tabid");
        if (tabid)
            moreurl += '&tabid=' + tabid
    }
    openLinkUrl(moreurl, '2');
    }
}

global.openMoreWin = function(eid, event) {
   
}

global.elmentReLoad = function(ebaseid) {
    $(".item[data-ebaseid=" + ebaseid + "]").attr('data-needRefresh', 'true');
    ifWorkFlowRefrash();
    $(".item[data-ebaseid=" + ebaseid + "] ").find(".td-span").each(function() {
        var img = $(this).find("img").css("display", "");
    });
}

/** --------- 通用js函数 -----------**/
window.currentSelectDate = new Date().format("yyyy-MM-dd");
global.dateCellRender = function(eid, data, value) {
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
            var html = dateevents[dateKey].map(function(dKey, v) {
                var dData = events[dKey];
                attrs['event' + v] = dData[0] + "-split-" + dData[2] + "-split-" + dData[4] + "-split-" + dData[5];
            });
            $("#calendar_" + eid + " .ant-fullcalendar-cell[title='" + dataStr1 + "'] .ant-fullcalendar-value").attr(attrs).addClass("ant-fullcalendar-event");
            isRender = true;
        }
    }
    if (dateStr === currentSelectDate) {
        $("#calendar_" + eid + " .ant-fullcalendar-cell[title='" + dataStr1 + "'] .ant-fullcalendar-value").addClass("ant-fullcalendar-current");
    }
    if (!isRender) { //没有时候去掉所有的event
        var curObj = $("#calendar_" + eid + " .ant-fullcalendar-cell[title='" + dataStr1 + "'] .ant-fullcalendar-value")
        if (curObj.attr("size")) {
            var size = eval(curObj.attr("size"))
            for (var i = 0; i < size; i++) {
                curObj.removeAttr("event" + i)
            }
            curObj.removeAttr("size")
        }
    }
}


global.doAdd = function(userid, eid) {
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
        var url = '/workplan/data/WorkPlanEdit.jsp?from=1&selectUser=' + userid + '&planName=&beginDate=' + selectDate + '&beginTime=' + beginTime + '&endDate=' + selectDate + '&endTime=';
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
        calendarDialog.callbackfunc4CloseBtn = function() {
            window.getMyCalendarDatas(currentSelectDate, "month", eid);
        }
        var hasRfdh = true;
        calendarDialog.show();
    }
    /*var refreshCalendar = function(eid){
    	$("#toolbar_"+eid+" [name=refreshbtn] img").trigger('click')
    	setTimeout(function(){
    		if($("#calendar_"+eid+" .ant-fullcalendar-current")){
    			$("#calendar_"+eid+" .ant-fullcalendar-current").trigger('click')
    		}
    	},100)
    }*/
    /** --------- 日历日程js函数 -----------**/
global.clickCalendarDay = function(obj, eid) {
        $("#calendar_" + eid).find(".ant-fullcalendar-current").removeClass("ant-fullcalendar-current");
        currentSelectDate = new Date($(obj).attr("title")).format("yyyy-MM-dd");
        var currentMonthStr = new Date($(obj).attr("title")).format("yyyy-MM");
        //判断点击的是否为当前显示月份，否的话刷新新月份的日历日程，并默认选中所点击的日期
        if (currentMonthStr !== currentMonth) {
            currentMonth = currentMonthStr;
            window.getMyCalendarDatas(currentSelectDate, "month", eid);
        }
        var dom = $(obj).find(".ant-fullcalendar-event");
        var size = _s2Int($(dom).attr("size"));
        var htmlArr = new Array;
        for (var i = 0; i < size; i++) {
            var event = $(dom).attr("event" + i);
            if (!_isEmpty(event)) {
                var arr = event.split("-split-");
                htmlArr.push("<div style='height:34px; line-height:34px; border-left:3px solid #a32929;'>");
                htmlArr.push("&nbsp;&nbsp;&nbsp;");
                htmlArr.push("<a href='javascript:void(0);' style='color:#000000;' onclick='clickData(" + arr[0] + "," + eid + ")'>");
                htmlArr.push("<span>" + arr[2] + "</span>");
                htmlArr.push("&nbsp;&nbsp;&nbsp;");
                htmlArr.push("<span>" + arr[3] + "</span>");
                htmlArr.push("&nbsp;&nbsp;&nbsp;");
                htmlArr.push("<span>" + arr[1] + "</span>");
                htmlArr.push("</a>");
                htmlArr.push("</div>");
            }
        }
        $("#calendar_content" + eid).html(htmlArr.join(''));

    }
    //点击数据
global.clickData = function(id, eid) {
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
    calendarDialog.callbackfunc4CloseBtn = function() {
        window.getMyCalendarDatas(currentSelectDate, "month", eid);
    }
    calendarDialog.show();
}

/** --------- 日历日程js函数 -----------**/


/** --------- 设置中包含滚动方向的元素对marquee设置属性 -----------**/
//加载滚动属性的值
global.loadMarqueeAttrs = function(eid, scolltype, height) {
        var attrs = {
            direction: scolltype,
            onmouseover: 'this.stop()',
            onmouseout: 'this.start()',
            scrolldelay: '200'
        };
        if (scolltype === 'up' || scolltype === 'down') {
            attrs['width'] = '100%';
            attrs['height'] = height;
        }
        $("#MARQUEE_" + eid).attr(attrs);
    }
    /** --------- 设置中包含滚动方向的元素对marquee设置属性 -----------**/



global.getBytesLength = function(str) {
    // 在GBK编码里，除了ASCII字符，其它都占两个字符宽
    return str.replace(/[^\x00-\xff]/g, 'xx').length;
}

/**
 * 根据字符长来截取字符串
 */
global.subStringByBytes = function(val, maxBytesLen) {
    var len = maxBytesLen;
    var result = val.slice(0, len);
    while (getBytesLength(result) > maxBytesLen) {
        result = result.slice(0, --len);
    }
    return result;
}
var wemail;
var whrm;
var wmess;
var wmsm;
var W = 0; //È¡µÃÆÁÄ»·Ö±æÂÊ¿í¶È
var H = 0; //È¡µÃÆÁÄ»·Ö±æÂÊ¸ß¶È
var userid = "";
var tousername;
// »ñµÃ´°¿Ú¿í¶È 
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
var oIframe = document.createElement('iframe');
var message_table_Div = document.createElement("div");
var content = null;
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

function MC(t) {
    return document.createElement(t);
};

function isIE() {
    return (document.all && window.ActiveXObject && !window.opera) ? true : false;
}
var bodySize = [];
var clickSize = [];

function getBodySize() {
    return bodySize;
}

function getClickSize() {
    return clickSize;
}

global.pointerXY = function(event, doc) {
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
    //alert(bodySize[0]+"::"+bodySize[1]+":::"+clickSize[0]+"::"+clickSize[1]);
}

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



function pointerXYByObj(obj) {

    var p = $(obj).position()
    bodySize[0] = p.left;
    bodySize[1] = p.top;
    clickSize[0] = p.left;
    clickSize[1] = p.top;

}


//ÈÃ²ãÏÔÊ¾Îª¿é 
function openResource() {
    var submitURL = "/hrm/resource/simpleHrmResourceTemp.jsp?userid=" + userid + "&date=" + new Date();
    postXmlHttp(submitURL, "showResource()", "loadEmpty()");
}

function loadEmpty() {
    void(0);
}

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
//´ò¿ªDIV²ã
function openhrm(tempuserid) {
    userid = tempuserid;
    getWin();
    openResource();
    changehrm();
    void(0);
}

function setUserId(tempuserid) {
    userid = tempuserid;
}

function openemail() {
    window.open("/email/MailAdd.jsp?isInternal=1&internalto=" + userid);
}

function openhrmresource() {
    openFullWindowForXtable("/hrm/HrmTab.jsp?_fromURL=HrmResource&id=" + userid);
}

function openmessage() {
    openFullWindowForXtable("/sms/SmsMessageEdit.jsp?hrmid=" + userid);
}

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

//¹Ø±ÕDIV²ã
function closediv() {
    M('mainsupports').style.display = "none";
    //M('HelpFrame').style.display = 'none';
    M('message_table').style.display = "none";

    void(0);
}

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

/** --------- 元素收缩/展开功能 -----------**/
//homepage_js.jsp
window.onShowOrHideE = function(eid) {
    $("#content_" + eid).toggle();
}
    /** --------- 元素收缩/展开功能 -----------**/

/** --------- 元素拖动功能js函数 -----------**/
window.addEvent = function(obj, type, handle) {
    try { // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        obj.addEventListener(type, handle, false);
    } catch (e) {
        try { // IE8.0及其以下版本
            obj.attachEvent("on" + type, handle);
        } catch (e) { // 早期浏览器
            obj["on" + type] = handle;
        }
    }
}


//判断元素是否可以拖动
window.handleDragStart = function(str, ishead, e) {
    if (!str) return;
    dragStart(ishead, e);
}

var dragStart = function(ishead, d_event) {
    var e = d_event.nativeEvent;
    var target = d_event.currentTarget
    e = e || event
    srcElement = e.srcElement || e.target;
    if (ishead) {
        if (!(srcElement.className == "header" || srcElement.className == "title")) return;

        if (!(e.button == 1 || e.button == 0)) {
            return;
        }
        if (dragobj.o) {
            return;
        }
        if (target.className == "title") target = target.parentNode;
    } else {
        if (!(srcElement.className == "tabcontainer tab2")) {
            return;
        }
        if (!(e.button == 1 || e.button == 0)) {
            return;
        }
        if (dragobj.o) {
            return;
        }
        target = target.parentNode.parentNode.parentNode;
    }
    dragobj.o = target.parentNode;
    //alert(dragobj.o.className+"------"+target.className);
    srcGroupFlag = $($(target).parents(".group")[0]).attr(getAttrName("areaflag"));
    //对象左上的坐标
    dragobj.xy = getxy(dragobj.o);
    //鼠标的相对位置
    dragobj.xx = new Array((e.x - dragobj.xy[1]), (e.y - dragobj.xy[0]))
    dragobj.o.style.width = dragobj.xy[2] + "px";
    dragobj.o.style.height = dragobj.xy[3] + "px";
    dragobj.o.style.left = (e.x - dragobj.xx[0] - 61) + "px";
    dragobj.o.style.top = (e.y - dragobj.xx[1] - 55) + "px";
    dragobj.o.style.position = "absolute";
    //创建临时对象用于记住其原始位置，占位
    var om = document.createElement("div");
    dragobj.otemp = om
    om.style.width = dragobj.xy[2] + "px"
    om.style.height = dragobj.xy[3] + "px"
    om.className = "location";
    om.style.width = "auto";
    dragobj.o.parentNode.insertBefore(om, dragobj.o)
    return false
}

function MoveEData(srcFlag, targetFlag) {
    var srcItemEids = "";
    var areaflag = getAttrName("areaflag");
    $(".group[" + areaflag + "=" + srcFlag + "]>").find(".item").each(function(i) {
        if (this.className == "item") {
            srcItemEids += $(this).attr("data-eid") + ",";
        }
    })
    var targetItemEids = "";
    $(".group[" + areaflag + "=" + targetFlag + "]>").find(".item").each(function(i) {
        if (this.className == "item") {
            targetItemEids += $(this).attr("data-eid") + ",";
        }
    })
    if (targetItemEids == "") return;
    var url = "/homepage/element/EsettingOperate.jsp?method=editLayout&hpid=" + global_hpid + "&subCompanyId=" + global_subCompanyId + "&srcFlag=" + srcFlag + "&targetFlag=" + targetFlag + "&srcStr=" + srcItemEids + "&targetStr=" + targetItemEids;
    GetContentReact(url);
}

function GetContentReact(url) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "text",
        success: function(data) {
            var url = '/page/interfaces/homepageInterface.jsp?hpid=' + global_hpid + '&subCompanyId=' + global_subCompanyId;
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function(data) {
                    ecLocalStorage.clearByModule('homepage-' + global_hpid);
                }
            });
        }
    });
}


var intMoveEid;
var srcItem;
var srcGroupFlag;
var divLoc;
var dragobj = {}
window.onerror = function() {
    return false
}

function on_ini() {
    String.prototype.inc = function(s) {
        return this.indexOf(s) > -1 ? true : false;
    }
    var agent = navigator.userAgent
    window.isOpr = agent.inc("Opera")
    window.isIE = agent.inc("IE") && !isOpr
    window.isMoz = agent.inc("Mozilla") && !isOpr && !isIE
    if (isMoz) {
        Event.prototype.__defineGetter__("x", function() {
            return this.clientX + 2
        })
        Event.prototype.__defineGetter__("y", function() {
            return this.clientY + 2
        })
    }
    basic_ini()
}

function basic_ini() {
    window.oDel = function(obj) {
        if ($(obj) != null) {
            $(obj).remove()
        }
    }
}
$(function() {
    on_ini();
    //初始化拖动
    var o = $(".header");

});

document.onselectstart = function() {
        if (dragobj.o != null) {
            return false;
        }
    }
    //window.onfocus=function(){document.onmouseup()}
    //window.onblur=function(){document.onmouseup()}
window.addEvent(document, "mouseup", function(e) {
    if (dragobj.o != null) {
        var _eid = -1;
        try {
            _eid = dragobj.o.id.split("item_")[1];
        } catch (e) {
            //alert(e.message);
        }
        dragobj.otemp.parentNode.insertBefore(dragobj.o, dragobj.otemp);
        dragobj.o.style.position = "static";
        dragobj.o.style.width = "100%";
        dragobj.o.style.height = "auto";
        var targetAreaFlag = $(dragobj.otemp).parents(".group").attr(getAttrName("areaflag"));

        MoveEData(srcGroupFlag, targetAreaFlag);
        oDel(dragobj.otemp)
            //停止拖放
        dragobj = {}

        try {
            var tab_eid = $("td[name='td_tab_" + _eid + "']");
            if (tab_eid.length > 0) {
                jQuery("#content_view_id_" + _eid).trigger("reload");
            }
            var ebaseid = $("#item_" + _eid).attr("data-ebaseid");
            if (ebaseid == 1 || ebaseid == 7 || ebaseid == 8 || ebaseid == 'news' || ebaseid == 'reportForm') {
                onRefresh(_eid, ebaseid);
            }
        } catch (e) {
            //alert(e.message);
        }
    }
});
window.addEvent(document, "mousemove", function(e) {
        e = e || event;
        if (dragobj.o != null) {
            dragobj.o.style.zIndex = "1";
            dragobj.o.style.left = (e.x - dragobj.xx[0] - 61) + "px";
            dragobj.o.style.top = (e.y - dragobj.xx[1] - 55) + "px";
            //dragobj.o.style.left=e.clientX;
            //dragobj.o.style.top=e.clientY+document.body.scrollTop;
            //自动调整布局，显示拖放效果
            createtmpl(e);
        }
    })
    //取得鼠标的坐标
function mouseCoords(ev) {
    if (ev.pageX || ev.pageY) {
        return {
            x: ev.pageX,
            y: ev.clientY + document.getElementById("e9routeMain").scrollTop - document.getElementById("e9routeMain").clientTop
        };
    }
    return {
        x: ev.clientX + document.getElementById("e9routeMain").scrollLeft - document.getElementById("e9routeMain").clientLeft,
        y: ev.clientY + document.getElementById("e9routeMain").scrollTop - document.getElementById("e9routeMain").clientTop
    };
}
//取得位置分别为上，左，宽，高,所有元素必须在同一容器内
function getxy(e) {
    var a = new Array();
    var t = e.offsetTop;
    var l = e.offsetLeft;
    var w = e.offsetWidth;
    var h = e.offsetHeight;
    while (e = e.offsetParent) {
        t += e.offsetTop;
        l += e.offsetLeft;
    }
    a[0] = t;
    a[1] = l;
    a[2] = w;
    a[3] = h;
    return a;
}
//判断e与o的位置
function inner(o, e) {
    var a = getxy(o)
        //鼠标是否在o的内部
    if (e.x > a[1] && e.x < (a[1] + a[2]) && e.y > a[0] && e.y < (a[0] + a[3])) {
        if (e.y < (a[0] + a[3] / 2))
        //上半部分
            return 1;
        else
            return 2;
    } else
        return 0;
}
//
function createtmpl(e) {
    var items = $(".item");
    for (var i = 0; i < items.length; i++) {
        if (!items[i] || items[i] == dragobj.o)
            continue;
        //修正鼠标坐标
        var mousePos = mouseCoords(e);
        var b = inner(items[i], mousePos);
        if (b == 0)
            continue;
        dragobj.otemp.style.width = "auto";

        if (b == 1) {
            items[i].parentNode.insertBefore(dragobj.otemp, items[i]);
        } else {
            if (items[i].nextSibling == null) {
                items[i].parentNode.appendChild(dragobj.otemp);
            } else {
                items[i].parentNode.insertBefore(dragobj.otemp, items[i].nextSibling);
            }
        }
    }
    //处理拖放至边界外的情况
    var groups = $(".group");
    for (var j = 0; j < groups.length; j++) {
        if (groups[j].innerHTML.inc("div") || groups[j].innerHTML.inc("DIV"))
            continue;
        var op = getxy(groups[j]);
        if (e.x > (op[1] + 10) && e.x < (op[1] + op[2] - 10)) {
            groups[j].appendChild(dragobj.otemp);
            dragobj.otemp.style.width = (op[2] - 10) + "px";
        }
    }
}
/** --------- 元素拖动功能js函数 -----------**/


/** --------- 元素工具栏功能js函数 -----------**/
//删除元素
global.onDel = function(eid) {
    if (!confirm("此元素被删除后将不能被恢复，是否继续?")) return;
    var group = $($("#item_" + eid).parents(".group")[0]);
    var flag = group.attr(getAttrName("areaflag"));
    var eids = "";
    group.find(".item").each(function() {
        if ($(this).attr("data-eid") != eid) eids += $(this).attr("data-eid") + ",";
    });
    //alert(eids);
    $.get("/homepage/element/EsettingOperate.jsp", {
            method: "delElement",
            hpid: global_hpid,
            eid: eid,
            delFlag: flag,
            delAreaElement: eids,
            subCompanyId: global_subCompanyId
        },
        function(data) {
            if ($.trim(data) == "") {
                $("#item_" + eid).remove();
            } else {
                alert($.trim(data))
            }
        }
    );
}

//锁定/解锁函数
global.onLockOrUn = function(eid, e) {
    var obj = e.currentTarget;
    if (confirm("此操作可能花较长的时间,是否继续?")) {
        //divInfo.style.display='inline';
        var url;
        if (jQuery(obj).attr("data-status") == "unlocked") {
            url = "/homepage/element/EsettingOperate.jsp?method=locked&eid=" + eid + "&hpid=" + global_hpid + "&subCompanyId=" + global_subCompanyId;
        } else {
            url = "/homepage/element/EsettingOperate.jsp?method=unlocked&eid=" + eid + "&hpid=" + global_hpid + "&subCompanyId=" + global_subCompanyId;
        }
        $.get(url, {}, function(data) {
            //divInfo.style.display='none';
            if (jQuery(obj).attr("data-status") == "unlocked") {
                jQuery(obj).attr("data-status", "locked");
            } else {
                jQuery(obj).attr("data-status", "unlocked");
            }
            jQuery(obj).children(":first").attr("src", $.trim(data));
        });
    }
}


/** ---------- 元素设置相关js start ---------- */
global.onSetting = function(eid, ebaseid) {
    // 获取设置页面内容
    var settingUrl = "/page/element/setting.jsp" + "?eid=" + eid + "&ebaseid=" + ebaseid + "&hpid=" + global_hpid + "&subcompanyid=" + global_subCompanyId;

    $.post(settingUrl, null, function(data) {
        if ($.trim(data) != "") {
            $("#setting_" + eid).hide();
            $("#setting_" + eid).remove();
            $("#content_" + eid).prepend($.trim(data));

            $(".tabs").PortalTabs({
                getLine: 1,
                topHeight: 40
            });
            $(".tab_box").height(0);

            $("#setting_" + eid).show();
            $("#weavertabs-content-" + eid).show();

            var urlContent = $.trim($("#weavertabs-content-" + eid).attr("url")).replace(/&amp;/g, "&");
            var urlStyle = $.trim($("#weavertabs-style-" + eid).attr("url")).replace(/&amp;/g, "&");
            var urlShare = $.trim($("#weavertabs-share-" + eid).attr("url")).replace(/&amp;/g, "&");

            if (urlContent != "") {
                var randomValue = new Date().getTime();

                if (ebaseid == 7 || ebaseid == 8 || ebaseid == 1 || ebaseid == 'news' || ebaseid == 29 || ebaseid == 'reportForm') {
                    $("#setting_" + eid).attr("randomValue", randomValue);
                }

                urlContent = urlContent + "&random=" + randomValue;

                $("#weavertabs-content-" + eid).html("")
                $("#weavertabs-content-" + eid).html("<img src=/images/loading2_wev8.gif> loading...");
                $("#weavertabs-content-" + eid).load(urlContent, {}, function() {
                    jscolor.init();
                    // 初始化layout组件
                    initLayout();
                });
            }
            if (urlStyle != "") {
                $("#weavertabs-style-" + eid).load(urlStyle, {}, function() {
                    // 初始化layout组件
                    initLayout();
                    $("#weavertabs-style-" + eid).hide();
                });
            }
            if (urlShare != "") {
                $("#weavertabs-share-" + eid).load(urlShare, {}, function() {
                    $("#weavertabs-share-" + eid).hide();
                });
            }
        }
    });
}

global.registerDragEvent = function(tableId, eid) {
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
        helper: fixHelper, // 调用fixHelper
        axis: "y",
        start: function(e, ui) {
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
        stop: function(e, ui) {
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

global.showTabs = function(eid, tabid) {
    $("#setting_" + eid).find(".settingtabcurrent").removeClass("settingtabcurrent");
    if (tabid == "tabContent") {
        jQuery("#weavertabs-content-" + eid).show();
        jQuery("#weavertabs-style-" + eid).hide();
        jQuery("#weavertabs-share-" + eid).hide();
        $("#setting_" + eid).find("#tabContent").addClass("settingtabcurrent");
    } else if (tabid == "tabStyle") {
        jQuery("#weavertabs-style-" + eid).show();
        jQuery("#weavertabs-share-" + eid).hide();
        jQuery("#weavertabs-content-" + eid).hide();
        $("#setting_" + eid).find("#tabStyle").addClass("settingtabcurrent");
    } else if (tabid == "tabShare") {
        jQuery("#weavertabs-share-" + eid).show();
        jQuery("#weavertabs-content-" + eid).hide();
        jQuery("#weavertabs-style-" + eid).hide();
        $("#setting_" + eid).find("#tabShare").addClass("settingtabcurrent");
    }
}

global.color_onchange = function(id, obj) {
    try {
        if (obj.value != '000000') {
            $("#" + id).attr("checked", true);
        }
    } catch (e) {}
}

global.addTab = function(eid, url, ebaseid) {
    var tabCount = $("#tabDiv_" + eid + "_" + $("#setting_" + eid).attr("randomValue")).attr("tabCount");
    tabCount = parseInt(tabCount);
    tabCount++;

    var url = $("#tabDiv_" + eid + "_" + $("#setting_" + eid).attr("randomValue")).attr("url");
    url += "&tabId=" + tabCount;
    showTabDailog(eid, 'add', tabCount, url, ebaseid);
}

var tab_dialog;
global.showTabDailog = function(eid, method, tabId, url, ebaseid) {
    var whereKeyStr = "";
    tab_dialog = new window.top.Dialog();
    tab_dialog.currentWindow = window; // 传入当前window
    tab_dialog.Width = 630;
    tab_dialog.Height = 500;
    tab_dialog.Modal = true;
    tab_dialog.Title = "内容设置";
    tab_dialog.URL = url + "&ebaseid=" + ebaseid + "&method=" + method;
    tab_dialog.show();
    return;
}

global.doTabSave = function(eid, ebaseid, tabId, method) {
    // 准备Tab页条件数据
    var tabDocument = tab_dialog.innerDoc;
    var tabWindow = tab_dialog.innerWin;
    var whereKeyStr = "";
    var formParams = {};
    var formAction = "";
    var tabTitle = "";
    var orderNum = "0";
    if (method == 'add') {
        orderNum = $("#tabSetting_" + eid).length;
    } else {
        orderNum = $("#tab_" + eid + "_" + tabId).attr("orderNum");
    }

    var displayTitle = "";
    if (parseInt(ebaseid) == 8) {
        tabTitle = $(tabDocument).find("#tabTitle_" + eid).attr("value");
        var ifrmDocuments = $(tabDocument).find("#ifrmViewType_" + eid);
        if (ifrmDocuments[0]) {
            var ifrmDocument = ifrmDocuments[0].contentWindow.document;
            $(ifrmDocument).find("#frmFlwCenter").find("#btnSave").trigger("click");
            $(ifrmDocument).find("#frmFlwCenter").find("#tabTitle").attr("value", tabTitle);
            $(ifrmDocument).find("#frmFlwCenter").find("#tabId").attr("value", tabId);
            $(ifrmDocument).find("#frmFlwCenter").find("#method").attr("value", method);
            formAction = $(ifrmDocument).find("#frmFlwCenter").attr("action");
            formParams = $(ifrmDocument).find("#frmFlwCenter").serializeArray();
        } else {
            formAction = $(tabDocument).find("#frmFlwCenter").attr("action");
            formParams = $(tabDocument).find("#frmFlwCenter").serializeArray();
        }

        var multiTabTitle = $(tabDocument).find("#__multilangpre_tabTitle_" + eid + $(tabDocument).find("#tabTitle_" + eid).attr("rnd_lang_tag")).attr("value");
        var tabTitle0 = tabTitle;
        tabTitle = multiTabTitle || tabTitle;
        displayTitle = $("#encodeHTML").text(tabTitle0).html();
        // 序列化表单
        formAction = "/homepage/element/setting/" + formAction;
    } else if (ebaseid == "reportForm" || ebaseid == "news" || parseInt(ebaseid) == 7 || parseInt(ebaseid) == 1 || parseInt(ebaseid) == 29) {
        formAction = "/page/element/compatible/NewsOperate.jsp";
        tabTitle = $(tabDocument).find("#tabTitle_" + eid).attr("value");
        var multiTabTitle = $(tabDocument).find("#__multilangpre_tabTitle_" + eid + $(tabDocument).find("#tabTitle_" + eid).attr("rnd_lang_tag")).attr("value");
        var tabTitle0 = tabTitle;
        tabTitle = multiTabTitle || tabTitle;
        displayTitle = $("#encodeHTML").text(tabTitle0).html();

        whereKeyStr = tabWindow.getNewsSettingString(eid);
        formParams = {
            eid: eid,
            tabId: tabId,
            tabTitle: tabTitle,
            tabWhere: whereKeyStr,
            method: method
        };
    }
    if (tabTitle == '') {
        top.Dialog.alert("必要信息不完整！");
        return false;
    }

    $.post(formAction, formParams, function(data) {
        if ($.trim(data) == "") {
            if (method == 'add') {
                var tabHtmlStr = '';
                if (global_hpid < 0 && (parseInt(ebaseid) == 8)) { // 协同
                    tabHtmlStr = "<tr><td><input type='checkbox' name='checkrow_" + eid + "'/>&nbsp;<img moveimg src='/proj/img/move_wev8.png' title='拖动'/></td><td><span id=tab_" + eid + "_" + tabId + " orderNum='" + orderNum + "' tabId='" + tabId + "' tabTitle=''></span></td><td width='200' align='right'><a href='javascript:deleTab(" + eid + "," + tabId + ",\"" + ebaseid + "\")'>删除</a> &nbsp;&nbsp; <a href='javascript:editTab(" + eid + "," + tabId + ",\"" + ebaseid + "\")'>设置</a>&nbsp;&nbsp;<a href='javascript:showSynParamSetting2Wf(" + eid + "," + tabId + ",\"" + ebaseid + "\")'>参数设置</a></td></tr>";
                } else {
                    tabHtmlStr = "<tr><td><input type='checkbox' name='checkrow_" + eid + "'/>&nbsp;<img moveimg src='/proj/img/move_wev8.png' title='拖动'/></td><td><span id=tab_" + eid + "_" + tabId + " orderNum='" + orderNum + "' tabId='" + tabId + "' tabTitle=''></span></td><td width='200' align='right'><a href='javascript:deleTab(" + eid + "," + tabId + ",\"" + ebaseid + "\")'>删除</a> &nbsp;&nbsp; <a href='javascript:editTab(" + eid + "," + tabId + ",\"" + ebaseid + "\")'>设置</a></td></tr>";
                }
                tabHtmlStr += "<tr class='Spacing' style='height:1px!important;'><td colspan='3' class='paddingLeft0Table'><div class='intervalDivClass' style='display:block''></div></td></tr>";
                $("#tabSetting_" + eid + ">tbody").append(tabHtmlStr);

                $("#tabDiv_" + eid + "_" + $("#setting_" + eid).attr("randomValue")).attr("tabCount", tabId);
                $("#tab_" + eid + "_" + tabId).html(tabTitle);
                $("#tab_" + eid + "_" + tabId).attr("tabTitle", tabTitle);
            } else {
                $("#tab_" + eid + "_" + tabId).html(tabTitle);
                $("#tab_" + eid + "_" + tabId).attr("tabTitle", tabTitle);
                $("#tab_" + eid + "_" + tabId).attr("tabWhere", whereKeyStr);
            }
            tab_dialog.close();
        } else {
            data = $.parseJSON($.trim(data));
            if (data && data.__result__ === false) {
                top.Dialog.alert(data.__msg__);
            }
        }
    });
}

global.onUseSetting = function(eid, ebaseid) {
    if ($("#reportId_" + eid).val() == "" && ebaseid == "FormModeCustomSearch") {
        top.Dialog.alert("必要信息不完整！");
        return false;
    }
    if (ebaseid == 8) {
        doWorkflowEleSet(eid, ebaseid);
    } else {
        doUseSetting(eid, ebaseid);
    }
}

global.doWorkflowEleSet = function(eid, ebaseid) {
    var formAction = "/homepage/element/setting/WorkflowCenterOpration.jsp";
    var orders = getTabOrders(eid);
    $.post(formAction, {
        method: 'submit',
        eid: eid,
        orders: orders
    }, function(data) {
        doUseSetting(eid, ebaseid);
    });
}

global.getTabOrders = function(eid, elementId) {
    var str = "";
    if (elementId == null) {
        elementId = 'tabSetting_';
    }
    $("#" + elementId + eid + " tr").find('span[orderNum]').each(function(i) {
        $(this).attr('orderNum', i);
        str += $(this).attr('tabId') + "_" + i + ";";
    })
    return str.substring(0, str.length - 1);
}

global.doUseSetting = function(eid, ebaseid) {
    /* 对知识订阅元素进行特殊处理 */
    if (ebaseid == 34) {
        var begin = document.getElementById("begindate_" + eid).value;
        var end = document.getElementById("enddate_" + eid).value;
        if (begin != "" && end != "") {
            if (begin > end) {
                top.Dialog.alert("结束时间不能在开始时间之前！");
                return;
            }
        }
    }

    // common部分处理
    var ePerpageValue = 5;
    var eShowMoulde = '0';
    var eLinkmodeValue = '';
    var esharelevel = '';
    try {
        if (document.getElementById("_ePerpage_" + eid) != null) {
            ePerpageValue = $("#_ePerpage_" + eid).val();
        }
        if (document.getElementById("_eShowMoulde_" + eid) != null) {
            eShowMoulde = document.getElementById("_eShowMoulde_" + eid).value;
        }
        if (document.getElementById("_eLinkmode_" + eid) != null) {
            eLinkmodeValue = $("#_eLinkmode_" + eid).val();
        }

        esharelevel = $("input[name=_esharelevel_" + eid + "]").val();
    } catch (e) {}

    var eFieldsVale = "";
    var chkFields = document.getElementsByName("_chkField_" + eid);
    if (chkFields != null) {
        for (var i = 0; i < chkFields.length; i++) {
            var chkField = chkFields[i];
            if (chkField.checked)
                eFieldsVale += chkField.value + ",";
        }
        if (eFieldsVale != "")
            eFieldsVale = eFieldsVale.substring(0, eFieldsVale.length - 1);
    }

    var imsgSizeStr = "";
    if ($("input[name=_imgWidth" + eid + "]").val()) {
        var imgWidth = $("input[name=_imgWidth" + eid + "]").val();
        var imgHeight = $("input[name=_imgHeight" + eid + "]").val();

        if (imgWidth.replace(/(^\s*)|(\s*$)/g, "") == "") {
            imgWidth = "0";
        }
        if (imgHeight.replace(/(^\s*)|(\s*$)/g, "") == "") {
            imgHeight = "0";
        }
        var imgSize = imgWidth + "*" + imgHeight;

        imsgSizeStr = "imgSize_" + $("input[name=_imgWidth" + eid + "").attr("basefield");
    }

    var imgType = 0;
    var imgSrc = "";
    if (document.getElementById("_imgType" + eid) != null) {
        imgType = document.getElementById("_imgType" + eid).value;

        if (imgType == 1) {
            imgSrc = $("#_imgsrc" + eid).val();
        }
    }

    var newstemplateStr = "";
    if (document.getElementById("_newstemplate" + eid) != null) {
        newstemplateStr = document.getElementById("_newstemplate" + eid).value
    }

    var eTitleValue = "";
    var whereKeyStr = "";
    if (esharelevel == "2") {
        var eTitleValue = document.getElementById("_eTitel_" + eid).value;
        var _whereKeyObjs = document.getElementsByName("_whereKey_" + eid);
        $("#title_" + eid).html(eTitleValue.replace(/ /gi, "&nbsp;"));
        $("#title_" + eid).append("<span id='count_" + eid + "'></span>");
        var multiETitleValue = jQuery("#__multilangpre__eTitel_" + eid + jQuery("#_eTitel_" + eid).attr("rnd_lang_tag")).val();
        eTitleValue = multiETitleValue || eTitleValue;
        eTitleValue = eTitleValue.replace(/\\/g, "\\\\");
        eTitleValue = eTitleValue.replace(/'/g, "\\'");
        eTitleValue = eTitleValue.replace(/"/g, "\\\"");
        if (ebaseid == 'notice') {
            onchanges(eid);
        }

        if (ebaseid !== "reportForm") {
            for (var k = 0; k < _whereKeyObjs.length; k++) {
                var _whereKeyObj = _whereKeyObjs[k];
                if (_whereKeyObj.tagName == "INPUT" && _whereKeyObj.type == "checkbox" && !_whereKeyObj.checked)
                    continue;
                if (ebaseid == 'reportForm') {
                    if (_whereKeyObj.tagName == "INPUT" && _whereKeyObj.type == "radio" && !_whereKeyObj.checked)
                        continue;
                }
                whereKeyStr += _whereKeyObj.value + "^,^";
            }
        }
    }
    if (whereKeyStr != "")
        whereKeyStr = whereKeyStr.substring(0, whereKeyStr.length - 3);
    whereKeyStr = whereKeyStr.replace(/'/g, "\\'");

    // 当日计划特殊处理
    if (ebaseid == 15) {
        whereKeyStr = $("#_whereKey_" + eid).val();
    }

    // 仅对多文档中心元素进行此处理
    if (whereKeyStr != null && $.trim(whereKeyStr) != "" && ebaseid == '17') {
        var whereStr = $.trim(whereKeyStr).split('^,^');
        if (whereStr[1] != null && whereStr[1] != "" && whereStr[1].length != 0) {
            $("#more_" + eid).attr("href", "javascript:openFullWindowForXtable('/page/element/compatible/more.jsp?ebaseid=" + ebaseid + "&eid=" + eid + "')");
            $("#more_" + eid).attr("morehref", "/page/element/compatible/more.jsp?ebaseid=" + ebaseid + "&eid=" + eid);
        } else {
            $("#more_" + eid).attr("href", "#");
            $("#more_" + eid).attr("morehref", "");
        }
    }

    var scolltype = "";
    if (document.getElementsByName("_scolltype" + eid).length > 0) {
        scolltype = document.getElementsByName("_scolltype" + eid)[0].value;
    }

    // 相关的样式设置部分
    var eLogo = $("#eLogo_" + eid).val();
    var eStyleid = $("#eStyleid_" + eid).val();
    var eHeight = $("#eHeight_" + eid).val();
    var eMarginTop = $("#eMarginTop_" + eid).val();
    var eMarginBottom = $("#eMarginBottom_" + eid).val();
    var eMarginLeft = $("#eMarginLeft_" + eid).val();
    var eMarginRight = $("#eMarginRight_" + eid).val();
    var eIsNew = "";
    var eIsBold = "";
    var eIsRgb = "";
    var eNewColor = "";
    var eIsLean = "";

    if ($("#isnew_" + eid).attr("checked") == true) {
        eIsNew = $("#isnew_" + eid).val();
    }
    if ($("#isbold_" + eid).attr("checked") == true) {
        eIsBold = $("#isbold_" + eid).val();
    }
    if ($("#isrgb_" + eid).attr("checked") == true) {
        eIsRgb = $("#isrgb_" + eid).val();
    }
    if ($("#islean_" + eid).attr("checked") == true) {
        eIsLean = $("#islean_" + eid).val();
    }
    var eNewColor = "#" + $("#newcolor_" + eid).val();

    // 相关的共享设置部分
    var operationurl = $.trim($("#setting_" + eid).attr("operationurl")).replace(/&amp;/g, "&");
    var postStr = "eid:'" + eid + "',eShowMoulde:'" + eShowMoulde + "',ebaseid:'" + ebaseid + "',eTitleValue:'" + eTitleValue + "',ePerpageValue:'" + ePerpageValue + "',eLinkmodeValue:'" + eLinkmodeValue + "',";
    postStr += "eFieldsVale:'" + eFieldsVale + "',imgSizeStr:'" + imgSize + "',whereKeyStr:'" + whereKeyStr + "',esharelevel:'" + esharelevel + "',hpid:'" + global_hpid + "',subCompanyId:'" + global_subCompanyId + "',";
    postStr += "eLogo:'" + eLogo + "',eStyleid:'" + eStyleid + "',eHeight:'" + eHeight + "',newstemplate:'" + newstemplateStr + "',imgType:'" + imgType + "',imgSrc:'" + imgSrc + "',eScrollType:'" + scolltype + "',";
    postStr += "eMarginTop:'" + eMarginTop + "',eMarginBottom:'" + eMarginBottom + "',eMarginLeft:'" + eMarginLeft + "',eMarginRight:'" + eMarginRight + "',isnew:'" + eIsNew + "',isbold:'" + eIsBold + "',isrgb:'" + eIsRgb + "',islean:'" + eIsLean + "',newcolor:'" + eNewColor + "'";

    /* 对外部数据元素的内容进行特殊处理 */
    if (ebaseid == "OutData") {
        var nums = $("#nums_" + eid).val();
        postStr = "eid:'" + eid + "',eShowMoulde:'" + eShowMoulde + "',ebaseid:'" + ebaseid + "',eTitleValue:'" + eTitleValue + "',ePerpageValue:'" + nums + "',eLinkmodeValue:'" + eLinkmodeValue + "',";
        postStr += "eFieldsVale:'" + eFieldsVale + "',imgSizeStr:'" + imgSize + "',whereKeyStr:'" + whereKeyStr + "',esharelevel:'" + esharelevel + "',hpid:'" + global_hpid + "',subCompanyId:'" + global_subCompanyId + "',";
        postStr += "eLogo:'" + eLogo + "',eStyleid:'" + eStyleid + "',eHeight:'" + eHeight + "',newstemplate:'" + newstemplateStr + "',imgType:'" + imgType + "',imgSrc:'" + imgSrc + "',eScrollType:'" + scolltype + "',";
        postStr += "eMarginTop:'" + eMarginTop + "',eMarginBottom:'" + eMarginBottom + "',eMarginLeft:'" + eMarginLeft + "',eMarginRight:'" + eMarginRight + "',isnew:'" + eIsNew + "',isbold:'" + eIsBold + "',isrgb:'" + eIsRgb + "',islean:'" + eIsLean + "',newcolor:'" + eNewColor + "'";
        postStr += ",nums:'" + nums + "'";
    }

    var wordcountStr = "";
    var _wordcountObjs = document.getElementsByName("_wordcount_" + eid);

    for (var j = 0; j < _wordcountObjs.length; j++) {
        var wordcountObj = _wordcountObjs[j];
        var basefield = $(wordcountObj).attr("basefield");
        wordcountStr += "&wordcount_" + basefield + "=" + wordcountObj.value;
        postStr += ",wordcount_" + basefield + ":'" + wordcountObj.value + "'";
    }

    var custformitem = $("#setting_form_" + eid);
    if (custformitem.length === 0 && (ebaseid === 'DataCenter' || ebaseid === 'searchengine' || ebaseid === 'news' || ebaseid === 'menu' || ebaseid === 'Flash' || ebaseid === 'notice' || ebaseid === 'picture' || ebaseid === 'scratchpad' || ebaseid === 'weather' || ebaseid === 'favourite' || ebaseid === 'video' || ebaseid === 'Slide' || ebaseid === 'audio' || ebaseid === 'jobsinfo' || ebaseid === 'addwf' || ebaseid === 'outterSys')) {
        custformitem = $("#weavertabs-content-" + eid);
        if (ebaseid === 'DataCenter' || ebaseid === 'picture' || ebaseid === 'weather' || ebaseid === 'news' || ebaseid === 'menu' || ebaseid === 'Flash' || ebaseid === 'favourite' || ebaseid === 'video' || ebaseid === 'Slide' || ebaseid === 'audio' || ebaseid === 'jobsinfo' || ebaseid === 'addwf' || ebaseid === 'outterSys') {
            var pitem = custformitem.parent();
            var pitem = custformitem.parent();
            custformitem = $("<form id='#setting_form_" + eid + "'></form>").append(custformitem);
            pitem.append(custformitem);
        } else
            custformitem = $("<form></form>").append(custformitem.clone());
    }

    // 自定义表单参数处理
    var newstrform = custformitem.serialize();
    var paramstr = newstrform.split("&");
    var newitem = {};

    var parammap;
    for (var i = 0; i < paramstr.length; i++) {
        parammap = paramstr[i].split("=");
        newitem[parammap[0]] = decodeURIComponent(parammap[1]).replace(/\+/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }

    var newstr = "";
    if (ebaseid == "weather") {
        var weatherWidth;
        var wWidth = $("#content_view_id_" + eid).width();
        if (newstr != null && newstr != "" && newstr.length != 0) {
            var weatherWidth = newstr.substring(newstr.lastIndexOf("'") + 1);
            var reg = new RegExp("[\+\]", "g");
            weatherWidth = weatherWidth.replace(reg, "");
            if (weatherWidth == null || weatherWidth == "" || isNaN(weatherWidth) || parseFloat(weatherWidth) > parseFloat(wWidth) || parseFloat(weatherWidth) <= 0) {
                var lNewStr = newstr.substring(0, newstr.lastIndexOf("'") + 1);
                newstr = lNewStr + wWidth;
            } else {
                var lNewStr = newstr.substring(0, newstr.lastIndexOf("'") + 1);
                newstr = lNewStr + weatherWidth;
            }
        }
    } else if (ebaseid == "FormModeCustomSearch") {
        var pageform = $("#setting_form_" + eid);

        var formmode_esharelevel = $("[name='_esharelevel_" + eid + "']").val();
        var formmode_reportId = $("#reportId_" + eid).val();
        var formmode_fields = $("#fields_" + eid).val();
        var formmode_fieldsWidth = $("#fieldsWidth_" + eid).val();

        newstr = "_esharelevel_" + eid + ":'" + formmode_esharelevel + "'," + "reportId_" + eid + ":'" + formmode_reportId + "'," + "fields_" + eid + ":'" + formmode_fields + "'," + "fieldsWidth_" + eid + ":'" + formmode_fieldsWidth + "";
    }

    if (newstr != "") {
        postStr = postStr + "," + newstr + "'";
    }
    postStr = "var postObj = {" + postStr + "}";
    eval(postStr);

    // 添加表单参数
    for (var item in newitem) {
        postObj[item] = newitem[item];
    }

    var orderStr = getTabOrders(eid);
    $.post(operationurl, postObj, function(data) {
        if ($.trim(data) == "") {
            $("#setting_" + eid).hide();
            $("#setting_" + eid).html('');
            $("#setting_" + eid).remove();
            if (ebaseid == "reportForm" || ebaseid == "news" || parseInt(ebaseid) == 7 || parseInt(ebaseid) == 1 || parseInt(ebaseid) == 29) {
                $.post('/page/element/compatible/NewsOperate.jsp', {
                    method: 'submit',
                    eid: eid,
                    orders: orderStr
                }, function(data) {
                    if ($.trim(data) == "") {
                        $("#item_" + eid).attr('needRefresh', 'true');
                        $("#item_" + eid).trigger("reload");

                        onRefresh4React();
                    }
                });
            } else {
                $("#item_" + eid).attr('needRefresh', 'true');
                $("#item_" + eid).trigger("reload");

                onRefresh4React();
            }
        } else {
            data = $.parseJSON($.trim(data));
            if (data && data.__result__ === false) {
                top.Dialog.alert(data.__msg__);
            }
        }
    });

    if (window.frames["eShareIframe_" + eid] && esharelevel == "2") {
        window.frames["eShareIframe_" + eid].document ? window.frames["eShareIframe_" + eid].document.getElementById("frmAdd_" + eid).submit() : "";
    }

    if (ebaseid == "menu") {
        setTimeout(function rload() {
            location.reload();
        }, 200);
    }
}

global.editTab = function(eid, tabId, ebaseid) {
    var url = $("#tabDiv_" + eid + "_" + $("#setting_" + eid).attr("randomValue")).attr("url");
    url += "&tabId=" + tabId;

    if (ebaseid == "news" || parseInt(ebaseid) == 7 || parseInt(ebaseid) == 1 || parseInt(ebaseid) == 29) {} else if (ebaseid == "reportForm") {} else {
        var tabTitle = $("#tab_" + eid + "_" + tabId).attr("tabTitle");
        url += "&tabTitle=" + tabTitle;
    }
    showTabDailog(eid, "edit", tabId, url, ebaseid);
}

global.deleTab = function(eid, tabId, ebaseid) {
    var formAction = "";
    if (parseInt(ebaseid) == 8) {
        formAction = "/homepage/element/setting/WorkflowCenterOpration.jsp";
    } else if (ebaseid == "reportForm" || ebaseid == "news" || parseInt(ebaseid) == 7 || parseInt(ebaseid) == 1 || parseInt(ebaseid) == 29) {
        formAction = "/page/element/compatible/NewsOperate.jsp";
    } else if (ebaseid == "OutData") {
        if (top.Dialog.confirm("确认删除吗？")) {
            formAction = "/page/element/OutData/tabOperation.jsp?type=";
        } else {
            return;
        }
    }
    var para = {
        method: 'delete',
        eid: eid,
        tabId: tabId
    };
    $.post(formAction, para, function(data) {
        if ($.trim(data) == "") {
            try {
                var tabArr = tabId.split(";");
                for (var i = 0; i < tabArr.length; i++) {
                    $("#setting_" + eid).find("#tab_" + eid + "_" + tabArr[i]).parent().parent().remove();
                }
            } catch (e) {
                $("#setting_" + eid).find("#tab_" + eid + "_" + tabId).parent().parent().remove();
            }
        }
    });
}

global.batchDeleTab = function(eid, ebaseid) {
    var tableId = 'tabSetting_';
    var j = 0;
    var tabIds = "";
    $("#" + tableId + eid + " tr").find('[name=checkrow_' + eid + ']').each(function(i) {
        if ($(this).attr('checked')) {
            j++;
            tabIds += $(this).parent().parent().find('[tabId]').attr('tabId') + ";";
        }
    });
    if (j == 0) {
        top.Dialog.alert('请至少选择一条记录。');
    } else {
        top.Dialog.confirm('确定要删除吗?', function() {
            tabIds = tabIds.substring(0, tabIds.length - 1);
            deleTab(eid, tabIds, ebaseid);
            $('#checkAll_' + eid).attr("checked", false);
        });
    }
}

global.checkAllRows = function(eid, tableId) {
    if (tableId == null) {
        tableId = 'tabSetting_';
    }
    var ischeck = $('#checkAll_' + eid).attr("checked");
    $("#" + tableId + eid + " tr").find('[name=checkrow_' + eid + ']').each(function(i) {
        $(this).attr('checked', ischeck);
    });
}

global.onNoUseSetting = function(eid, ebaseid) {
        if (ebaseid == "news" || parseInt(ebaseid) == 7 || parseInt(ebaseid) == 1 || ebaseid == "reportForm" || parseInt(ebaseid) == 29) {
            $.post('/page/element/compatible/NewsOperate.jsp', {
                method: 'cancel',
                eid: eid
            }, function(data) {
                if ($.trim(data) == "") {
                    //$("#item_"+eid).attr('needRefresh','true')
                    //$("#item_"+eid).trigger("reload");
                }
            });
        } else if (parseInt(ebaseid) == 8) {
            var formAction = "/homepage/element/setting/WorkflowCenterOpration.jsp";
            $.ajax({
                url: formAction,
                data: {
                    method: 'cancel',
                    eid: eid
                },
                cache: false,
                async: true,
                type: "post",
                dataType: 'json',
                success: function(result) {

                }
            });
        }
        //外部数据元素有所不同需要刷新一次
        if (ebaseid == "OutData") {
            $("#item_" + eid).attr('needRefresh', 'true')
            $("#item_" + eid).trigger("reload");
        }
        $("#setting_" + eid).hide();
        $("#setting_" + eid).remove();
    }
    /** ---------- 元素设置相关js end   ---------- */


global.__defaultTemplNamespace__ = (function() {
    return (function() {
        return {
            initLayoutForCss: function() {
                var tr = jQuery("table.e8Table tr[class!=intervalTR]");
                tr.each(function() {
                    var $this = jQuery(this);
                    if (!$this.hasClass("intervalTR")) {
                        $this.hover(function() {
                            jQuery(this).addClass("Selected");
                        }, function() {
                            jQuery(this).removeClass("Selected");
                        });
                        $this.children("td").hover(function() {
                            jQuery(this).addClass("e8Selected");
                        }, function() {
                            jQuery(this).removeClass("e8Selected");
                        });
                    }
                });
            },
            initLayout: function() {
                var tr = jQuery("table.LayoutTable tr[class!=intervalTR]");
                tr.each(function() {
                    if (!jQuery(this).hasClass("intervalTR")) {
                        jQuery(this).hover(function() {
                            jQuery(this).addClass("Selected");
                        }, function() {
                            jQuery(this).removeClass("Selected");
                        });
                        jQuery(this).children("td").hover(function() {
                            jQuery(this).addClass("e8Selected");
                        }, function() {
                            jQuery(this).removeClass("e8Selected");
                        });
                    }
                });

                initLayoutForCss();


                /*jQuery("tr.groupHeadHide").each(function(){
                	var hideBlockDiv = jQuery(this).find(".hideBlockDiv");
                	if(hideBlockDiv.length>0 && hideBlockDiv.css("display")!="none"){
                		jQuery(this).unbind("click").bind("click",function(e){
                			var evt = e||window.event;
                			var srcElement = evt.srcElement||evt.target;
                			if(jQuery(this).attr("_show")||jQuery(srcElement).attr("_show")){
                				hideBlockDiv.attr("_status","1");
                			}
                			try{
                				var noHideEle = jQuery(srcElement).closest(".noHide");
                				if(!jQuery(this).attr("_show") && (srcElement.tagName.toLowerCase()=="input"||srcElement.tagName.toLowerCase()=="a") || jQuery(srcElement).hasClass("noHide")||noHideEle.length>0){
                					showItemArea(srcElement);
                					if(jQuery(srcElement).attr("type")!="checkbox"){
                						evt.stopPropagation();
                						evt.preventDefault();
                					}
                				}else{
                					hideBlockDiv.click();
                				}
                				jQuery(this).removeAttr("_show");
                				if(typeof(setContentHeight)=="function"&&isneedSetContentHieght){
                					setContentHeight();
                				}
                			}catch(e){
                				jQuery(this).removeAttr("_show");
                				if(window.console)console.log(e+"-->templates/default.js-->initLayout()");
                			}
                		});
                	}
                });*/


                jQuery(".hideBlockDiv").unbind("click").bind("click", function(e) {
                    var _status = jQuery(this).attr("_status");
                    var currentTREle = jQuery(this).closest("table").closest("TR");
                    var groupHideTR = currentTREle.find("tr.groupHeadHide:first");
                    if (groupHideTR.attr("_show") === "true") {
                        _status = "1";
                        groupHideTR.removeAttr("_show");
                    }
                    if (!!!_status || _status == "0") {
                        jQuery(this).attr("_status", "1");
                        jQuery(this).html("<img src='/wui/theme/ecology8/templates/default/images/1_wev8.png'>");
                        currentTREle.next("TR.Spacing").next("TR.items").hide();
                    } else {
                        jQuery(this).attr("_status", "0");
                        jQuery(this).html("<img src='/wui/theme/ecology8/templates/default/images/2_wev8.png'>");
                        currentTREle.next("TR.Spacing").next("TR.items").show();
                    }
                    var evt = e || window.event;
                    evt.stopPropagation();
                    evt.preventDefault();
                }).hover(function() {
                    $(this).css("color", "#000000");
                }, function() {
                    $(this).css("color", "#cccccc");
                });

                _initFormat();
            },
            showItemArea: function(selector, _document) {
                if (!_document) _document = document;
                if (!selector) return;
                var tr = jQuery(selector, _document).closest("tr.groupHeadHide");
                var hideBlockDiv = tr.find(".hideBlockDiv");
                if (tr.length > 0 && hideBlockDiv.length > 0) {
                    tr.attr("_show", "true");
                    hideBlockDiv.click();
                }
            },
            isSamePairHidden: function(samePair) {
                var samePairTds = jQuery("td[_samePair*='" + objid + "']");
                samePairTds.each(function() {
                    if (jQuery(this).css("display") == "none") return true;
                });
                return false;
            },
            showGroup: function(samePair) {
                sohGroup(samePair, true);
            },
            hideGroup: function(samePair) {
                sohGroup(samePair, false);
            },
            sohGroup: function(samePair, soh) {
                var trs = jQuery("tr[_samePair*='" + samePair + "']");
                trs.each(function() {
                    var tr = jQuery(this);
                    var span = tr.find("span.hideBlockDiv");
                    if (soh) {
                        tr.show();
                        tr.next("tr.Spacing").show();
                        span.attr("_status", "0");
                        span.html("<img src='/wui/theme/ecology8/templates/default/images/2_wev8.png'>");
                        //if(span.attr("_status")=="1" && span.css("display")!="none")return;
                        tr.next("tr.Spacing").next("TR.items").show();
                        tr.next("tr.Spacing").next("TR.items").next("tr.Spacing").show();
                    } else {
                        tr.hide();
                        tr.next("tr.Spacing").hide();
                        //if(span.attr("_status")=="1" && span.css("display")!="none")return;
                        span.attr("_status", "1");
                        span.html("<img src='/wui/theme/ecology8/templates/default/images/1_wev8.png'>");
                        tr.next("tr.Spacing").next("TR.items").hide();
                        tr.next("tr.Spacing").next("TR.items").next("tr.Spacing").hide();
                    }

                });
            },
            _initFormat: function() {
                var tds = jQuery("td[_samePair][_samePair!='']");
                var visited = [];
                tds.each(function() {
                    var _samePair = jQuery(this).attr("_samePair");
                    if (!visited.contains(_samePair)) {
                        visited.push(_samePair);
                        _colspan(_samePair);
                    }
                });
            },
            _colspan: function(objid) {
                var samePairTds = jQuery("td[_samePair*='" + objid + "']:hidden");
                var lastTR = null;
                samePairTds.each(function() {
                    if (jQuery(this).css("display") != "none") {} else {
                        var tr = jQuery("td[_samePair*='" + objid + "']").closest("tr");
                        if (lastTR && tr.attr("_trrandom") == lastTR.attr("_trrandom")) {} else {
                            var tds = tr.children("td");
                            var isHide = true;
                            tds.each(function() {
                                if (jQuery(this).css("display") != "none") {
                                    isHide = false;
                                }
                            });
                            var _samePairTds = tr.find("td[_samePair*='" + objid + "']:hidden");
                            var lastTd = tds.eq(tds.length - 1);
                            var colspan = lastTd.attr("colspan");
                            if (isHide) {
                                tr.css("display", "none");
                                tr.next("tr.Spacing").css("display", "none");
                            }
                            if (!colspan) colspan = 1;
                            if (!!colspan) {
                                lastTd.attr("colspan", colspan + _samePairTds.length);
                            }
                        }
                        lastTR = tr;
                    }
                });
            },
            showEle: function(objid) {
                hosEle(objid, "", true);
            },
            hideEle: function(objid, needHideTr) {
                if (needHideTr != false) {
                    needHideTr = true;
                }
                hosEle(objid, "none", needHideTr);
            },
            hosEle: function(objid, soh, needHideTr) {
                var samePairTds = jQuery("td[_samePair*='" + objid + "']");
                if (soh == "none") {
                    if (samePairTds.slice(0, 1).css("display") == "none") return;
                    jQuery("td[_samePair*='" + objid + "']").css("display", soh);
                } else {
                    if (jQuery("td[_samePair*='" + objid + "']").css("display") != "none") return;
                }
                var lastTR = null;
                samePairTds.each(function() {
                    var tr = jQuery(this).closest("tr");
                    if (lastTR && tr.attr("_trrandom") == lastTR.attr("_trrandom")) {} else {
                        var showTd = 0;
                        var hideTd = 0;
                        var lastTd;
                        tr.children("td").each(function() {
                            if (jQuery(this).css("display") != "none") {
                                showTd++;
                                lastTd = jQuery(this);
                            } else {
                                hideTd++;
                            }
                        });
                        if ((showTd == 0 || soh != "none") && !!needHideTr) {
                            tr.css("display", soh);
                            if (tr.hasClass("intervalTR")) {} else {
                                tr.next("tr.Spacing").css("display", soh);
                            }
                        }
                        if (tr.css("display") == "none") {} else {
                            if (!!lastTd) {
                                var colspan = lastTd.attr("colspan");
                                if (!colspan) colspan = 1;
                                if (!!colspan) {
                                    if (soh == "none") {
                                        lastTd.attr("colspan", colspan + hideTd);
                                    } else {
                                        lastTd.attr("colspan", colspan - hideTd);
                                    }
                                }
                            }

                            tr.find("td[_samePair*='" + objid + "']").css("display", soh);
                        }
                    }
                    lastTR = tr;
                });
            }
        }
    })();
})();

//@deprecated
global.initLayoutForCss = function() {
    __defaultTemplNamespace__.initLayoutForCss();
}

//@deprecated
global.initLayout = function() {
    __defaultTemplNamespace__.initLayout();
}

//@deprecated
global.showItemArea = function(selector, _document) {
    __defaultTemplNamespace__.showItemArea(selector, _document);
}

//@deprecated
global.isSamePairHidden = function(samePair) {
    return __defaultTemplNamespace__.isSamePairHidden(samePair);
}

//@deprecated
global.showGroup = function(samePair) {
    __defaultTemplNamespace__.showGroup(samePair);
}

//@deprecated
global.hideGroup = function(samePair) {
    __defaultTemplNamespace__.hideGroup(samePair);
}

//@deprecated
global.sohGroup = function(samePair, soh) {
    __defaultTemplNamespace__.sohGroup(samePair, soh);
}



//@deprecated
global._initFormat = function() {
    __defaultTemplNamespace__._initFormat();
}

//@deprecated
global._colspan = function(objid) {
    __defaultTemplNamespace__._colspan(objid);
}

//@deprecated
global.showEle = function(objid) {
    __defaultTemplNamespace__.showEle(objid);
}

//@deprecated
global.hideEle = function(objid, needHideTr) {
    __defaultTemplNamespace__.hideEle(objid, needHideTr);
}

//@deprecated
global.hosEle = function(objid, soh, needHideTr) {
    __defaultTemplNamespace__.hosEle(objid, soh, needHideTr);
}
