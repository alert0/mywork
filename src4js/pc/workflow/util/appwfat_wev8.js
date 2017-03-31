/*
 * index 指定添加到工具栏上的那个位置，默认时追加到最后,
 * editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮
 * editor@按钮
 * index 27
 */
UE.registerUI('wfatbutton', function(editor, uiName) {
	return initwfatbutton(editor, uiName);
}, 27, 'remark,forwardremark');

const initwfatbutton = (editor, uiName) => {
	var language = readCookie("languageidweaver");
	var msg = SystemEnv.getHtmlNoteName(3449, language);
	var labelname = "@";

	//获取参数
	const paramDiv = jQuery('#' + editor.key + "_div");
	const requestid = paramDiv.find('#requestid_param').val();
	const workflowid = paramDiv.find('#workflowid_param').val();
	const nodeid = paramDiv.find('#nodeid_param').val();
	const isbill = paramDiv.find('#isbill_param').val();
	const formid = paramDiv.find('#formid_param').val();
	console.log("requestid", requestid, "workflowid", workflowid, "nodeid", nodeid, "isbill", isbill, "formid", formid);

	let atitems = [];
	jQuery.ajax({
		url: '/workflow/request/WorkflowRequestPictureForJson.jsp',
		type: 'POST', //GET
		data: {
			requestid: requestid,
			workflowid: workflowid,
			nodeid: nodeid,
			isbill: isbill,
			formid: formid
		},
		success: function(response) {
			atitems = response;
			window.__atdataready = true;
			window.__atdata = atitems;

			editor.registerCommand(uiName, {
				execCommand: function() {
					var el = jQuery('#' + editor.key).find(".edui-for-wfatbutton")[0].getBoundingClientRect();
					var px = el.left;
					var py = el.top;

					var allatids = ",";
					try {
						atitems = atitems;
					} catch(e) {
						atitems = [];
					}
					var names = jQuery.map(atitems, function(value, i) {
						if(allatids.indexOf("," + value.uid + ",") == -1) {
							allatids += value.uid + ",";
							return value;
						}
					});
					atitems = names;
					var setting = {
						isfromuedit: 1,
						itemmaxlength: 4,
						positionx: px,
						positiony: py,
						editorid:editor.key,
						autoitems: atitems,
						relativeItem: el,
						entercallback: function() {
							var itemdata = this.find(".data").html();
							var str = "<a href='/hrm/HrmTab.jsp?_fromURL=HrmResource&id=" + this.attr("uid") + "' target='_new' atsome='@" + this.attr("uid") + "' contenteditable='false'  style='cursor:pointer;color:#000000;text-decoration:none !important;margin-right:8px;' target='_blank'>@" + itemdata + "</a>&nbsp;";
							// editor.insertElement(new CKEDITOR.dom.element.createFromHtml(str, editor.document));
							//FCKEditorExt.insertHtml(str,"remark");
							//插入编辑器
							editor.execCommand('inserthtml', str);
						},
						muticheckcallback: function() {
							var checkitems = this;
							var astr = "";
							var itemvalue = "";
							var liitem;
							for(var i = 0, length = checkitems.length; i < length; i++) {
								liitem = jQuery(checkitems[i]).parent();
								//contenteditable="false"
								var _citem = jQuery(checkitems[i]);
								astr = astr + "<a href='/hrm/HrmTab.jsp?_fromURL=HrmResource&id=" + _citem.attr("_uid") + "' contenteditable='false' atsome='@" + _citem.attr("_uid") + "' style='cursor:pointer;text-decoration:none !important;margin-right:8px;' target='_blank'>@" + _citem.attr("_uname") + "</a>&nbsp;";
								//editor.insertElement(new CKEDITOR.dom.element.createFromHtml(astr, editor.document));

							}
							//FCKEditorExt.insertHtml(astr, "remark");
							//插入编辑器
							editor.execCommand('inserthtml', astr);
						}
					}
					new WeaverAutoComplete(setting).init();
				}
			});
		}
	});

	//注册按钮执行时的command命令，使用命令默认就会带有回退操作

	//创建一个button
	var btn = new UE.ui.Button({
		//按钮的名字
		name: uiName,
		//提示
		title: '@',
		//需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
		/*cssRules :"background-image: url('/ueditor/custbtn/images/app-at_wev8.png') !important;background-position: -990px 1px!important;",*/
		//点击时执行的命令
		onclick: function() {
			//这里可以不用执行命令,做你自己的操作也可
			editor.execCommand(uiName);
		}
	});

	//当点到编辑内容上时，按钮要做的状态反射
	editor.addListener('selectionchange', function() {
		var state = editor.queryCommandState(uiName);
		if(state == -1) {
			btn.setDisabled(true);
			btn.setChecked(false);
		} else {
			btn.setDisabled(false);
			btn.setChecked(state);
		}
	});

	//因为你是添加button,所以需要返回这个button
	return btn;
}