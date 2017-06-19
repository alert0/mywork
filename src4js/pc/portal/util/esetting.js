/** ---------- 元素设置相关js start ---------- */
function showTabs(eid, tabid) {
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

window.showTabs = showTabs;

function color_onchange(id, obj) {
	try {
		if (obj.value != '000000') {
			$("#" + id).attr("checked", true);
		}
	} catch (e) {
	}
}

window.color_onchange = color_onchange;

function addTab(eid, url, ebaseid) {
	var tabCount = $("#tabDiv_" + eid + "_" + $("#setting_" + eid).attr("randomValue")).attr("tabCount");
	tabCount = parseInt(tabCount);
	tabCount++;

	var url = $("#tabDiv_" + eid + "_" + $("#setting_" + eid).attr("randomValue")).attr("url");
	url += "&tabId=" + tabCount;
	showTabDailog(eid, 'add', tabCount, url, ebaseid);
}

window.addTab = addTab;

window.tab_dialog;

function showTabDailog(eid, method, tabId, url, ebaseid) {
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

window.showTabDailog = showTabDailog;

function doTabSave(eid, ebaseid, tabId, method) {
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
		var ifrmDocuments = $(tabDocument).find("#ifrmViewType_"+eid);
		if(ifrmDocuments[0]) {
			var ifrmDocument = ifrmDocuments[0].contentWindow.document;
			$(ifrmDocument).find("#frmFlwCenter").find("#btnSave").trigger("click");
			$(ifrmDocument).find("#frmFlwCenter").find("#tabTitle").attr("value",tabTitle);
			$(ifrmDocument).find("#frmFlwCenter").find("#tabId").attr("value",tabId);
			$(ifrmDocument).find("#frmFlwCenter").find("#method").attr("value",method);
			formAction = $(ifrmDocument).find("#frmFlwCenter").attr("action");
			formParams = $(ifrmDocument).find("#frmFlwCenter").serializeArray();
		}else{
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
			eid : eid,
			tabId : tabId,
			tabTitle : tabTitle,
			tabWhere : whereKeyStr,
			method : method
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
				if (global_hpid < 0 && (parseInt(ebaseid) == 8)) {// 协同
					tabHtmlStr = "<tr><td><input type='checkbox' name='checkrow_"
							+ eid
							+ "'/>&nbsp;<img moveimg src='/proj/img/move_wev8.png' title='拖动'/></td><td><span id=tab_"
							+ eid
							+ "_"
							+ tabId
							+ " orderNum='"
							+ orderNum
							+ "' tabId='"
							+ tabId
							+ "' tabTitle=''></span></td><td width='200' align='right'><a href='javascript:deleTab("
							+ eid
							+ ","
							+ tabId
							+ ",\""
							+ ebaseid
							+ "\")'>删除</a> &nbsp;&nbsp; <a href='javascript:editTab("
							+ eid
							+ ","
							+ tabId
							+ ",\""
							+ ebaseid
							+ "\")'>设置</a>&nbsp;&nbsp;<a href='javascript:showSynParamSetting2Wf("
							+ eid
							+ ","
							+ tabId
							+ ",\""
							+ ebaseid
							+ "\")'>参数设置</a></td></tr>";
				} else {
					tabHtmlStr = "<tr><td><input type='checkbox' name='checkrow_"
							+ eid
							+ "'/>&nbsp;<img moveimg src='/proj/img/move_wev8.png' title='拖动'/></td><td><span id=tab_"
							+ eid
							+ "_"
							+ tabId
							+ " orderNum='"
							+ orderNum
							+ "' tabId='"
							+ tabId
							+ "' tabTitle=''></span></td><td width='200' align='right'><a href='javascript:deleTab("
							+ eid
							+ ","
							+ tabId
							+ ",\""
							+ ebaseid
							+ "\")'>删除</a> &nbsp;&nbsp; <a href='javascript:editTab("
							+ eid
							+ ","
							+ tabId
							+ ",\""
							+ ebaseid
							+ "\")'>设置</a></td></tr>";
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

window.doTabSave = doTabSave;

function onUseSetting(eid, ebaseid) {
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

window.onUseSetting = onUseSetting;

function doWorkflowEleSet(eid, ebaseid) {
	var formAction = "/homepage/element/setting/WorkflowCenterOpration.jsp";
	var orders = getTabOrders(eid);
	$.post(formAction, {
		method : 'submit',
		eid : eid,
		orders : orders
	}, function(data) {
		doUseSetting(eid, ebaseid);
	});
}

window.doWorkflowEleSet = doWorkflowEleSet;

function getTabOrders(eid, elementId) {
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

window.getTabOrders = getTabOrders;

function doUseSetting(eid, ebaseid) {
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
	} catch (e) {
	}
	
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
	var postStr = "eid:'" + eid 
			+ "',eShowMoulde:'" + eShowMoulde
			+ "',ebaseid:'" + ebaseid 
			+ "',eTitleValue:'" + eTitleValue 
			+ "',ePerpageValue:'" + ePerpageValue 
			+ "',eLinkmodeValue:'" + eLinkmodeValue 
			+ "',";
	postStr += "eFieldsVale:'" + eFieldsVale 
			+ "',imgSizeStr:'" + imgSize
			+ "',whereKeyStr:'" + whereKeyStr 
			+ "',esharelevel:'" + esharelevel
			+ "',hpid:'" + global_hpid 
			+ "',subCompanyId:'"+ global_subCompanyId 
			+ "',";
	postStr += "eLogo:'" + eLogo 
			+ "',eStyleid:'" + eStyleid 
			+ "',eHeight:'" + eHeight 
			+ "',newstemplate:'" + newstemplateStr 
			+ "',imgType:'" + imgType 
			+ "',imgSrc:'" + imgSrc 
			+ "',eScrollType:'" + scolltype
			+ "',";
	postStr += "eMarginTop:'" + eMarginTop 
			+ "',eMarginBottom:'" + eMarginBottom 
			+ "',eMarginLeft:'" + eMarginLeft
			+ "',eMarginRight:'" + eMarginRight 
			+ "',isnew:'" + eIsNew
			+ "',isbold:'" + eIsBold 
			+ "',isrgb:'" + eIsRgb 
			+ "',islean:'" + eIsLean 
			+ "',newcolor:'" + eNewColor 
			+ "'";

	/* 对外部数据元素的内容进行特殊处理 */
	if (ebaseid == "OutData") {
		var nums = $("#nums_" + eid).val();
		postStr = "eid:'" + eid 
				+ "',eShowMoulde:'" + eShowMoulde
				+ "',ebaseid:'" + ebaseid 
				+ "',eTitleValue:'" + eTitleValue
				+ "',ePerpageValue:'" + nums 
				+ "',eLinkmodeValue:'" + eLinkmodeValue 
				+ "',";
		postStr += "eFieldsVale:'" + eFieldsVale 
				+ "',imgSizeStr:'" + imgSize
				+ "',whereKeyStr:'" + whereKeyStr 
				+ "',esharelevel:'" + esharelevel 
				+ "',hpid:'" + global_hpid 
				+ "',subCompanyId:'" + global_subCompanyId 
				+ "',";
		postStr += "eLogo:'" + eLogo 
				+ "',eStyleid:'" + eStyleid
				+ "',eHeight:'" + eHeight 
				+ "',newstemplate:'" + newstemplateStr 
				+ "',imgType:'" + imgType 
				+ "',imgSrc:'" + imgSrc 
				+ "',eScrollType:'" + scolltype 
				+ "',";
		postStr += "eMarginTop:'" + eMarginTop 
				+ "',eMarginBottom:'" + eMarginBottom 
				+ "',eMarginLeft:'" + eMarginLeft
				+ "',eMarginRight:'" + eMarginRight 
				+ "',isnew:'" + eIsNew
				+ "',isbold:'" + eIsBold 
				+ "',isrgb:'" + eIsRgb 
				+ "',islean:'" + eIsLean 
				+ "',newcolor:'" + eNewColor 
				+ "'";
		postStr += ",nums:'" + nums 
				+ "'";
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
	if (custformitem.length === 0 && ( ebaseid === 'DataCenter' || ebaseid === 'searchengine' || ebaseid === 'news' || ebaseid === 'menu' || ebaseid === 'Flash' || ebaseid === 'notice' || ebaseid === 'picture' || ebaseid === 'scratchpad' || ebaseid === 'weather' || ebaseid === 'favourite' || ebaseid === 'video' || ebaseid === 'Slide' || ebaseid === 'audio' || ebaseid === 'jobsinfo' || ebaseid === 'addwf' || ebaseid === 'outterSys' )) {
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
		newitem[parammap[0]] = decodeURIComponent(parammap[1]).replace(/\+/g," ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
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

		newstr = "_esharelevel_" + eid + ":'" + formmode_esharelevel + "',"
				+ "reportId_" + eid + ":'" + formmode_reportId + "',"
				+ "fields_" + eid + ":'" + formmode_fields + "',"
				+ "fieldsWidth_" + eid + ":'" + formmode_fieldsWidth + "";
	}

	if (newstr != "") {
		postStr = postStr + "," + newstr + "'";
	}
	postStr = "var postObj = {" + postStr + "}";
	eval(postStr);

	// 添加表单参数
	for ( var item in newitem) {
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
					method : 'submit',
					eid : eid,
					orders : orderStr
				}, function(data) {
					if ($.trim(data) == "") {
						$("#item_" + eid).attr('needRefresh', 'true');
						$("#item_" + eid).trigger("reload");
						window.elementsRefresh[eid]();
					}
				});
			} else {
				$("#item_" + eid).attr('needRefresh', 'true');
				$("#item_" + eid).trigger("reload");
				window.elementsRefresh[eid]();
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

window.doUseSetting = doUseSetting;

function editTab(eid, tabId, ebaseid) {
	var url = $("#tabDiv_" + eid + "_" + $("#setting_" + eid).attr("randomValue")).attr("url");
	url += "&tabId=" + tabId;
	
	if (ebaseid == "news" || parseInt(ebaseid) == 7 || parseInt(ebaseid) == 1 || parseInt(ebaseid) == 29) {
	} else if (ebaseid == "reportForm") {
	} else {
		var tabTitle = $("#tab_" + eid + "_" + tabId).attr("tabTitle");
		url += "&tabTitle=" + tabTitle;
	}
	showTabDailog(eid, "edit", tabId, url, ebaseid);
}

window.editTab = editTab;

function deleTab(eid, tabId, ebaseid) {
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
		method : 'delete',
		eid : eid,
		tabId : tabId
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

window.deleTab = deleTab;

function batchDeleTab(eid, ebaseid) {
	var tableId = 'tabSetting_';
	var j = 0;
	var tabIds = "";
	$("#" + tableId + eid + " tr").find('[name=checkrow_' + eid + ']').each(function(i) {
		if ($(this).attr('checked')) {
			j++;
			tabIds += $(this).parent().parent().find('[tabId]').attr('tabId')+ ";";
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

window.batchDeleTab = batchDeleTab;

function checkAllRows(eid, tableId) {
	if (tableId == null) {
		tableId = 'tabSetting_';
	}
	var ischeck = $('#checkAll_' + eid).attr("checked");
	$("#" + tableId + eid + " tr").find('[name=checkrow_' + eid + ']').each(function(i) {
		$(this).attr('checked', ischeck);
	});
}

window.checkAllRows = checkAllRows;

function onNoUseSetting(eid, ebaseid) {
	if (ebaseid == "news" || parseInt(ebaseid) == 7 || parseInt(ebaseid) == 1 || ebaseid == "reportForm" || parseInt(ebaseid) == 29) {
		$.post('/page/element/compatible/NewsOperate.jsp', {
			method : 'cancel',
			eid : eid
		}, function(data) {
			if ($.trim(data) == "") {
				//$("#item_"+eid).attr('needRefresh','true')
				//$("#item_"+eid).trigger("reload");
			}
		});
	} else if (parseInt(ebaseid) == 8) {
		var formAction = "/homepage/element/setting/WorkflowCenterOpration.jsp";
		$.ajax({
			url : formAction,
			data : {
				method : 'cancel',
				eid : eid
			},
			cache : false,
			async : true,
			type : "post",
			dataType : 'json',
			success : function(result) {

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

window.onNoUseSetting = onNoUseSetting;
/** ---------- 元素设置相关js end   ---------- */


function onWorktaskSetting(obj){
	var objParent=obj.parentNode;
	var children=objParent.getElementsByTagName("INPUT");
	var value="";
	for(var i=0;i<children.length;i++){
		var child=children[i];			
		if(child.type=="checkbox" && child.checked){
			value+=child.value+"|";
		}						
	}
	if(value!="") value=value.substring(0,value.length-1);
	//objParent.firstChild.value=value;	
    jQuery(objParent).find("input[type='hidden']:first").val(value);
}

window.onWorktaskSetting = onWorktaskSetting;

function onShowMenus(input, span, eid) {
    //console.dir(arguments);
	var dlg=new window.top.Dialog();//定义Dialog对象
	dlg.Model=true;
	dlg.Width=550;//定义长度
	dlg.Height=560;
	dlg.URL="/systeminfo/BrowserMain.jsp?url=/page/element/Menu/MenusBrowser.jsp";
	//console.log("=======================");
	dlg.callbackfun=function(data){
		if (data) {
	        if (data.id != "") {
	           if (data.id == "hp") {
	                span.innerHTML = "<a href='/homepage/maint/HomepageLocation.jsp' target='_blank'>" + data.name + "</a>";
	            } else if (data.id == "sys") {
	                span.innerHTML = "<a href='/systeminfo/menuconfig/MenuMaintFrame.jsp?type=" + data.id + "' target='_blank'>" + data.name + "</a>";
	            } else {
	               span.innerHTML = "<a href='/page/maint/menu/MenuEdit.jsp?id=" + data.id + "' target='_blank'>" + data.name + "</a>";
	            }
	           input.value = data.id;
	        } else {
	           span.innerHTML = "";
	           input.value = "0";
	        }
	    }
	}
	dlg.show();
}

window.onShowMenus = onShowMenus;

function onClickMenuType(obj,eid){
        var menuType = document.getElementById("menuTypeId_"+eid);
		var spanMenuType = document.getElementById("spanMenuTypeId_"+eid);
		var tempMenuType = document.getElementById("tempMenuTypeId_"+eid);
		var mTypes = document.getElementById("menuType_"+eid);
		menuType.value = "";
		spanMenuType.innerHTML = "";
		tempMenuType.value = obj.value;
}
window.onClickMenuType = onClickMenuType;


function onShowMenuTypes(input, span, eid, menutype) {
    menutype = menutype.value;
    var dlg=new window.top.Dialog();//定义Dialog对象
	dlg.Model=true;
	dlg.Width=550;//定义长度
	dlg.Height=560;
	dlg.URL="/systeminfo/BrowserMain.jsp?url=/page/element/Menu/MenuTypesBrowser.jsp?type=" + menutype;
	dlg.callbackfun=function(data){
		menulink = "";
	    if (menutype == "element") {
	        menulink = "ElementStyleEdit.jsp";
	    } else if (menutype == "menuh") {
	        menulink = "MenuStyleEditH.jsp";
	    } else {
	        menulink = "MenuStyleEditV.jsp";
	    }
	    if (data) {
	        if (data.id != "") {
	            span.innerHTML = "<a href='/page/maint/style/" + menulink + "?styleid=" +data.id + "&type=" + menutype + "&from=list' target='_blank'>" + data.name + "</a>";
	            input.value = data.id;
	        } else {
	            span.innerHTML = "";
	            input.value = "0";
	        }
	    }
	}
	dlg.show();
}
window.onShowMenuTypes = onShowMenuTypes;

function onShowMenuTypes2(input, span, eid, menutype) {
    menutype = menutype.value;
    var dlg=new window.top.Dialog();//定义Dialog对象
	dlg.Model=true;
	dlg.Width=550;//定义长度
	dlg.Height=560;
	dlg.URL="/systeminfo/BrowserMain.jsp?url=/page/element/Menu/MenuTypesBrowser.jsp?type=" + menutype;
	dlg.callback=function(data){
		menulink = "";
	    if (menutype == "element") {
	        menulink = "ElementStyleEdit.jsp";
	    } else if (menutype == "menuh") {
	        menulink = "MenuStyleEditH.jsp";
	    } else {
	        menulink = "MenuStyleEditV.jsp";
	    }
	    if (data) {
	        if (data.id != "") {
	            span.innerHTML = "<a href='/page/maint/style/" + menulink + "?styleid=" +data.id + "&type=" + menutype + "&from=list' target='_blank'>" + data.name + "</a>";
	            input.value = data.id;
	        } else {
	            span.innerHTML = "";
	            input.value = "0";
	        }
	    }
	}
	dlg.show();
}
window.onShowMenuTypes2 = onShowMenuTypes2;

function onShowNewNews(input,span,eid,publishtype){
	var iTop = (window.screen.availHeight-30-550)/2+"px"; //获得窗口的垂直位置;
	var iLeft = (window.screen.availWidth-10-550)/2+"px"; //获得窗口的水平位置;
	var dlg=new window.top.Dialog();//定义Dialog对象
	dlg.Model=true;
	dlg.Width=550;//定义长度
	dlg.Height=550;
	dlg.URL = "/systeminfo/BrowserMain.jsp?url=/docs/news/NewsBrowser.jsp?publishtype="+publishtype;
	dlg.callback=function(datas){
		if (datas){
					if (datas.id){
						$(span).html( "<a href='/docs/news/NewsDsp.jsp?id="+datas.id+"' target='_blank'>" +datas.name+"</a>");
						$(input).val(datas.id);
					}else{ 
						$(span).html( "");
						$(input).val("");
					}
			   }
	   }
    dlg.show();
}

window.onShowNewNews = onShowNewNews;

function onShowDoc(input,span,eid){
    var dlg=new window.top.Dialog();//定义Dialog对象
    dlg.Model=true;
    dlg.Width=550;//定义长度
    dlg.Height=550;
    dlg.URL="/docs/DocBrowserMain.jsp?url=/docs/docs/DocBrowser.jsp?from=hpelement";
    dlg.Title="内容来源";
	   dlg.callbackfun=function(params,datas){
		    if(datas){
				if(datas.id!=""){
					$(input).val(datas.id);
					$(span).html( "<a href='/docs/docs/DocDsp.jsp?id="+datas.id+"'  target='_blank'>"+datas.name+"</a>");
				}
				else{
					$(input).val("");
					$(span).html("");
				}
		     }
    }
    dlg.show();
}

window.onShowDoc = onShowDoc;