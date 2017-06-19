import Immutable from 'immutable'
const {List} = Immutable;

/* index 指定添加到工具栏上的那个位置，默认时追加到最后,
 * editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮
 * 附件上传
 * index 34
 */
UE.registerUI('wfannexbutton',function(editor,uiName){
	return initwfannexbutton(editor,uiName);
}, 34, 'remark,forwardremark');

const initwfannexbutton = (editor,uiName) => {
	const paramDiv = jQuery('#' + editor.key + "_div");
	let isannexupload_edit = '0';
	let annexmaxUploadImageSize = '0';
	if(editor.key == 'remark'){
		isannexupload_edit = paramDiv.find('#isannexupload_edit_param').val()
		annexmaxUploadImageSize = paramDiv.find('#annexmaxUploadImageSize_param').val()
	}else{
		isannexupload_edit = jQuery('#forwardremark_hidden_area').find('#isannexupload_edit').val();
		annexmaxUploadImageSize = jQuery('#forwardremark_hidden_area').find('#annexmaxUploadImageSize').val();
	}
	if(isannexupload_edit != "1"){
		return;
	}
	
	var language = readCookie("languageidweaver");
	var msg = SystemEnv.getHtmlNoteName(3449,language);
	var labelname = "@";
	var initphrase = function () {
		//点击其他地方，隐藏附件上传选择框
		jQuery("html").live('mouseup', function (e) {
			var banfold = paramDiv.find("#fsUploadProgressfileuploaddiv").attr("banfold");
			var _filetop = paramDiv.find("#_fileuploadphraseblock").offset().top;
			if (_filetop > 0 && !!!jQuery(e.target).closest("#_fileuploadphraseblock")[0] && banfold!="1") {
				//jQuery("#_fileuploadphraseblock").hide();
				paramDiv.find("#_fileuploadphraseblock").css("top","-500px");
				paramDiv.find("#fsUploadProgressfileuploaddiv").css("top","-500px");
				//jQuery("#_fsarrowsblock").css("display","none");
				//jQuery("#_fscgblock").css("display","none");
				//jQuery("#_addfilebtn").show()
				//jQuery("#cg_splitline").show();
				//jQuery("#addfileupload").hide();
			}
			e.stopPropagation();
		});
		try {
			jQuery("html", jQuery("#"+editor.key).find("iframe")[0].contentWindow.document).live('mouseup', function (e) {
				var showfor = paramDiv.find("#_fileuploadphraseblock").attr("showfor");
				var _filetop = paramDiv.find("#_fileuploadphraseblock").offset().top;
				if (_filetop > 0 && !!!jQuery(e.target).closest("#_fileuploadphraseblock")[0] && banfold!="1") {
					//jQuery("#_fileuploadphraseblock").hide();
					paramDiv.find("#_fileuploadphraseblock").css("top","-500px");
					paramDiv.find("#fsUploadProgressfileuploaddiv").css("top","-500px");
					//jQuery("#_addfilebtn").show()
					//jQuery("#cg_splitline").show();
					//jQuery("#addfileupload").hide();
				}
				e.stopPropagation();
			});
		} catch (e) {}
		//combox html
		var comboxHtml = "" +
						"<div id=\"_fileuploadphraseblock\" class=\"_signinputphraseblockClass\" style='top:-100px;z-index:99;display:none;'>" +
						"	<div class=\"phrase_arrowsblock\"><img src=\"/images/ecology8/workflow/phrase/addPhrasejt_wev8.png\" width=\"14px\" height=\"14px\"></div>" +
						"	<div class=\"cg_block\"  style='background:#fff;'>" +
						"		<div id=\"_filecontentblock\">" +
						"			<ul>" +
						"				<li style=\"padding:2px;text-align:center;\" id=\"promptinformation\" ></li>" +
						"			</ul>" +
						"	    </div>" +
						"		<div class=\"cg_splitline\" id=\"cg_splitline\" ></div>" +
						"		<ul>" +
						"			<li >" +
						"				<div class=\"cg_optblock\" style=\"text-align:center;margin:2px 0 4px 0px;\">" +
						"					<div style=\"margin:0 auto; height:22px;width:22px;background-image:url(/images/ecology8/workflow/phrase/addPhrase_wev8.png);\"> "+
						"					<span class=\"phrase_btn\" style=\"color:#1ca96f;\" id=\"_addfilebtn\" title=\""+SystemEnv.getHtmlNoteName(3456,language)+"("+SystemEnv.getHtmlNoteName(4080,language)+annexmaxUploadImageSize+ "M/" + SystemEnv.getHtmlNoteName(4081,language)+")"+ "\">" +
						"						<span id=\"_continueaddfile_"+editor.key+"\" >	" +
						SystemEnv.getHtmlNoteName(3456,language) +
						"						</span></span>" +
						"				</div></div>" +
						"			</li>" +
						"		</ul>" +
						"	</div>" +
						"</div>"+
						"<div id=\"fsUploadProgressfileuploaddiv\" class='_signinputphraseblockClass' style='top:-100px;z-index:999;display:none;'>" +
						"	<div class=\"phrase_arrowsblock\" id=\"_fsarrowsblock\"><img src=\"/images/ecology8/workflow/phrase/addPhrasejt_wev8.png\" width=\"14px\" height=\"14px\"></div>" +
						"	<div class=\"cg_block\" id=\"_fscgblock\" style='background:#fff;padding-bottom:2px;'>" +
						"	<div class=\"fieldset flash\" id=\"fsUploadProgressfileupload_"+editor.key+"\" > </div></div></div>";
		var comboxobj = jQuery(comboxHtml);
		//插入dom对象
		paramDiv.append(comboxobj);
	};

	var splitchar = "////~~weaversplit~~////";
	initphrase();
	cfileupload(editor.key);
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
	function addli(){
		sethraseblockPosition('_fileuploadphraseblock',editor.key);
		var ids = jQuery.trim(paramDiv.find("#field-annexupload").val());
		var names = jQuery.trim(paramDiv.find("#field-annexupload-name").val());
		var _ul = paramDiv.find("#_fileuploadphraseblock").find("#_filecontentblock ul");
		if(ids != "" && ids != null){
			var fieldcancle = paramDiv.find("#field-cancle").val();
			paramDiv.find("#promptinformation").html("").css("padding","2px");
			if(ids.indexOf(",") > -1){
				var idArray = ids.split(",");
				var nameArray = names.split(splitchar);
				for (var i=0; i<idArray.length; i++) {
			    	var curid = jQuery.trim(idArray[i]);
	                var curname = jQuery.trim(nameArray[i]);
	                if(!checkliid(jQuery.trim(curid),editor.key)){
	                	//continue;
	                	_ul.append("<li id='li_"+curid+"' onclick=\"onAddUploadFile("+curid+",'"+curname+"','"+editor.key+"')\" class=\"cg_item\"><span class='cg_detail' style='width:130px;' title='" + curname + "' >" + curname + "</span><a onmouseover=\"showBt("+curid+")\" onmouseout=\"hiddenBt("+curid+")\" onclick=\"deletefile("+curid+",'"+curname+"','"+editor.key+"')\" style=\"float:right;width:10px;height:10px;margin-right:5px;margin-top:8px;background-image:url(/images/ecology8/workflow/annexdel_wev8.png);\" class=\"e8_delClass1\" title='"+fieldcancle+"' ></a></li>");
	                }
			    }
			}else{
				if(!checkliid(jQuery.trim(ids),editor.key)){
                	//return;
                	_ul.append("<li id='li_"+ids+"' onclick=\"onAddUploadFile("+ids+",'"+names+"','"+editor.key+"')\" class=\"cg_item\"><span class='cg_detail' style='width:130px;' title='" + names + "'>" + names + "</span><a onmouseover=\"showBt("+ids+")\" onmouseout=\"hiddenBt("+ids+")\" onclick=\"deletefile("+ids+",'"+names+"','"+editor.key+"')\" style=\"float:right;width:10px;height:10px;margin-right:5px;margin-top:8px;background-image:url(/images/ecology8/workflow/annexdel_wev8.png);\" class=\"e8_delClass1\" title='"+fieldcancle+"' ></a></li>");
				}
			}
		}
    	var _outdiv = paramDiv.find("#_filecontentblock");
    	var _li = paramDiv.find("#_filecontentblock ul li");
    	if (_li.length > 4)  {
			paramDiv.find("#_filecontentblock").css("height", "124px");
			paramDiv.find("#_filecontentblock").css("overflow", "hidden");
			paramDiv.find("#_filecontentblock").perfectScrollbar({horizrailenabled:false,zindex:1000});
			_li.show();
		}
    	if (_li.length == 4)  {
			paramDiv.find("#_filecontentblock").css("height", "94px");
			paramDiv.find("#_filecontentblock").css("overflow","");
		}
    	if (_li.length == 3)  {
			paramDiv.find("#_filecontentblock").css("height", "64px");
			paramDiv.find("#_filecontentblock").css("overflow","");
		}
    	if (_li.length == 2)  {
			paramDiv.find("#_filecontentblock").css("height", "34px");
			paramDiv.find("#_filecontentblock").css("overflow","");
		}
    	if (_li.length == 1)  {
			paramDiv.find("#_filecontentblock").css("height", "34px");
			paramDiv.find("#_filecontentblock").css("overflow","");
		}
	}
	
    editor.registerCommand(uiName,{
        execCommand:function() {
        }
    });
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        labelname:SystemEnv.getHtmlNoteName(3457,language),
        //提示
        title:SystemEnv.getHtmlNoteName(3457,language),
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        /*cssRules :"background-image: url('/ueditor/custbtn/images/wf_annex_wev8.png') !important;background-position: -990px 1px!important;border:1px solid transparent;",*/
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
			//editor.execCommand(uiName);
        	addli();
        }
    });
    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
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

var queuednames = "";
var splitchar = "////~~weaversplit~~////";
var x=0;
var fQError = "";
function cfileupload(editorid) {
	const paramDiv = jQuery('#' + editorid + "_div");
	const params = {'method':'uploadFile'};
	let annexmaxUploadImageSize = '0';
	if(editorid == 'remark'){
		params.mainId = paramDiv.find('#annexmainId_param').val();
		params.subId = paramDiv.find('#annexsubId_param').val();
		params.secId = paramDiv.find('#annexsecId_param').val();
		params.userid = paramDiv.find('#fileuserid_param').val();
		params.logintype = paramDiv.find('#fileloginyype_param').val();
		annexmaxUploadImageSize = paramDiv.find('#annexmaxUploadImageSize_param').val();
	}else{
		params.mainId = jQuery('#forwardremark_hidden_area').find('#annexmainId').val();
		params.subId = jQuery('#forwardremark_hidden_area').find('#annexsubId').val();
		params.secId = jQuery('#forwardremark_hidden_area').find('#annexsecId').val();
		params.userid = jQuery('#forwardremark_hidden_area').find('#fileuserid').val();
		params.logintype = jQuery('#forwardremark_hidden_area').find('#fileloginyype').val();
		annexmaxUploadImageSize = jQuery('#forwardremark_hidden_area').find('#annexmaxUploadImageSize').val();
	}
	
	var oUploadannexupload;
	var settings = {
			flash_url : "/js/swfupload/swfupload.swf",
			upload_url: "/docs/docupload/MultiDocUploadByWorkflow.jsp?userid="+window.__userid+"&usertype="+window.__usertype,
			post_params:params,
			use_query_string : true,//要传递参数用到的配置
			file_size_limit : annexmaxUploadImageSize + " MB",
			file_types : "*.*",
			file_types_description : "All Files",
			file_upload_limit : 50,
			file_queue_limit : 0,
			custom_settings : {
				progressTarget : "fsUploadProgressfileupload_"+editorid,
				cancelButtonId : "fileCancel"
			},
			debug: false,

			// Button settings
		button_image_url : "",
		button_placeholder_id : "_continueaddfile_"+editorid,
		button_width: 22,
		button_height: 22,
		//button_text: '添加附件',
		button_text_style: '',
		button_text_top_padding: 0,
		button_text_left_padding: 0,
		button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
		button_cursor: SWFUpload.CURSOR.HAND,

		file_queued_handler : fileQueued,
		file_queue_error_handler : function(file, errorCode, message){
			fQError = "error";
		    try{
		        if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED)
		        {
		        	top.Dialog.alert("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
		            return;
		        }
		        switch (errorCode)
		        {
		            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
		            	top.Dialog.alert(SystemEnv.getHtmlNoteName(4080) + annexmaxUploadImageSize + "M/" + SystemEnv.getHtmlNoteName(4081) + "，" + SystemEnv.getHtmlNoteName(4076));
		                break;
		            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
		            	top.Dialog.alert(SystemEnv.getHtmlNoteName(4080) + annexmaxUploadImageSize + "M/" + SystemEnv.getHtmlNoteName(4081) + "，" + SystemEnv.getHtmlNoteName(4077));
		                break;
		            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
		            	top.Dialog.alert(SystemEnv.getHtmlNoteName(4080) + annexmaxUploadImageSize + "M/" + SystemEnv.getHtmlNoteName(4081) + "，" + SystemEnv.getHtmlNoteName(4078));
		                break;
		            default:
		                if (file !== null)
		                {
		                    progress.setStatus("Unhandled Error");
		                }
		            	top.Dialog.alert(SystemEnv.getHtmlNoteName(4080) + annexmaxUploadImageSize + "M/" + SystemEnv.getHtmlNoteName(4081) + "，" + SystemEnv.getHtmlNoteName(4079));
		                break;
		        }
		    } catch (ex)
		    {
		    }
		},
		//file_dialog_start_handler : fileDialogStartselect,
		file_dialog_complete_handler : function(numFilesSelected, numFilesQueued){
			if (numFilesSelected > 0) {		
				//for(var m=0;m<numFilesSelected;m++){
				if(fQError == ""){
					var el = jQuery('#'+editorid).find(".edui-for-wfannexbutton");
					el.css("visibility","visible");
					el.css("cursor","pointer");
					el.css("z-index","101");
					jQuery("#promptinformation").html("");
					sethraseblockPosition('fsUploadProgressfileuploaddiv',editorid);
					paramDiv.find("#fsUploadProgressfileuploaddiv").show();
					paramDiv.find("#field-annexupload-count").val(numFilesQueued);
					paramDiv.find("#fsUploadProgressfileuploaddiv").css("z-index","999");
					//jQuery("#_fileuploadphraseblock").css("z-index","99");
					paramDiv.find("#_fileuploadphraseblock").css("top","-500px");
					paramDiv.find("#fsUploadProgressfileuploaddiv").attr("banfold","1");
					//jQuery("#_fileuploadphraseblock").css("top","-500px");
					//enableAllmenu();
					this.startUpload();
					//}
				}else{
					fQError = ""; 
				}
			}
		},
		upload_start_handler : uploadStart,
		upload_progress_handler : uploadProgress,
		upload_error_handler : uploadError,
		upload_success_handler : function (file, server_data) {
			var rtvids = "";
			var rtvnames = "";
			var rtvsizes = "";
			if (!!file) {
				if (rtvids == "") {
					rtvids = jQuery.trim(server_data);
					rtvnames = jQuery.trim(file.name);
					rtvsizes = file.size;
				} else {
					rtvids += "," + jQuery.trim(server_data);
					rtvnames += splitchar + jQuery.trim(file.name);
					rtvsizes += splitchar + file.size;
				}
			}
			
			//container.find(".e8fileupload").css("visibility","hidden");
			var fieldannexuploadid = jQuery.trim(paramDiv.find("#field-annexupload").val());
			var fieldannexuploadidname = jQuery.trim(paramDiv.find("#field-annexupload-name").val());
			if(fieldannexuploadid != "" && fieldannexuploadid !=null){
				rtvids = fieldannexuploadid+","+jQuery.trim(rtvids);
				rtvnames = fieldannexuploadidname+splitchar+jQuery.trim(rtvnames);
			}
			paramDiv.find("#field-annexupload").val(jQuery.trim(rtvids));
			paramDiv.find("#field-annexupload-name").val(jQuery.trim(rtvnames));
			if(editorid == 'forwardremark'){
				FORWARD_OBJ.setState({'fieldannexupload':rtvids,'fieldannexuploadname':rtvnames,'fieldannexuploadcount':1});
			}
		},
		upload_complete_handler : function(){
			var fieldannexuploadcount = paramDiv.find("#field-annexupload-count").val();
			x++;
			if(x == fieldannexuploadcount){
				paramDiv.find("#fsUploadProgressfileupload_"+editorid).html("");
				paramDiv.find("#fsUploadProgressfileuploaddiv").css("z-index","99");
				paramDiv.find("#_fileuploadphraseblock").css("z-index","999");
				//jQuery("#_fileuploadphraseblock").css("top",jQuery(".edui-for-wfannexbutton").offset().top + 17);
				//jQuery("#_fileuploadphraseblock").css("top","-500px");
				paramDiv.find("#fsUploadProgressfileuploaddiv").css("top","-500px");
				//jQuery("#_fileuploadphraseblock").hide();
				try {
		   			var _targetobj = jQuery('#'+editorid).find(".edui-for-wfannexbutton").children("div").children("div").children("div").children(".edui-metro");
		        	if (paramDiv.find('#field-annexupload').val() != '') {
		        		_targetobj.addClass("wfres_1_slt");
		        		_targetobj.removeClass("wfres_1");
		        	} else {
		        		_targetobj.addClass("wfres_1");
		        		_targetobj.removeClass("wfres_1_slt");
		        	}
		        } catch (e) {}
		        paramDiv.find("#fsUploadProgressfileuploaddiv").attr("banfold","0");
		        addlinew(editorid);
		        //jQuery("#_fsarrowsblock").css("display","none");
				//jQuery("#_fscgblock").css("display","none");
				x = 0;
				//displayAllmenu();
			}
		},
		queue_complete_handler : function(){
		
		}	// Queue plugin event
		};
	try {
		oUploadannexupload = new SWFUpload(settings);
	} catch(e) {
		if(window.console)console.log(e);
		//top.Dialog.alert(SystemEnv.getHtmlNoteName(3502,readCookie("languageidweaver")));
		jQuery("#remarkShadowDiv").hide();
	}
}

function deletefile(id,names,editorid){
	//var id = jQuery(obj).parent().attr("id");
	var paramDiv = jQuery('#'+editorid + '_div');
	paramDiv.find("#_fileuploadphraseblock").attr("showfor","2");
	top.Dialog.confirm(SystemEnv.getHtmlNoteName(3458,readCookie("languageidweaver"))+names+SystemEnv.getHtmlNoteName(3459,readCookie("languageidweaver")), function(){
		var ids = paramDiv.find("#field-annexupload").val();
		var fileNames = paramDiv.find("#field-annexupload-name").val();
		
		let idList = List(ids.split(','));
		let filenameList = List(fileNames.split(splitchar));
		let idIndex = -1;
		idList.map((o,index)=>{
			if(o == id){
				idIndex = index;
			}
		});
		
		idList = idList.delete(idIndex);
		filenameList = filenameList.delete(idIndex);
		
		ids  = idList.join(',');
		fileNames = filenameList.join(splitchar);
		paramDiv.find("#field-annexupload").val(ids);
		paramDiv.find("#field-annexupload-name").val(fileNames);
		if(editorid == 'forwardremark'){
			jQuery('#forwardremark_hidden_area').find("#field-annexupload").val(ids);
			jQuery('#forwardremark_hidden_area').find("#field-annexupload-name").val(fileNames);
		}
		paramDiv.find("#li_"+id).remove();
		var _li = paramDiv.find("#_filecontentblock ul li");
		if (_li.length == 4)  {
			paramDiv.find("#_filecontentblock").height(94); 
			paramDiv.find("#_filecontentblock").css("overflow","");
		}
		if (_li.length == 3)  {
			paramDiv.find("#_filecontentblock").height(64); 
			paramDiv.find("#_filecontentblock").css("overflow","");
		}
		if(_li.length == 2){
			paramDiv.find("#_filecontentblock").height(34); 
			paramDiv.find("#_filecontentblock").css("overflow","");
		}
		if(_li.length == 1){
			var fieldaddname = paramDiv.find("#field-add-name").val();
			paramDiv.find("#promptinformation").html(fieldaddname).css("padding-top","8px").css("cursor","Default");
			paramDiv.find("#_filecontentblock").css("overflow","");
		}

		try {
   			var _targetobj = jQuery('#'+editorid).find(".edui-for-wfannexbutton").children("div").children("div").children("div").children(".edui-metro");
        	if (paramDiv.find('#field-annexupload').val() != '') {
        		_targetobj.addClass("wfres_1_slt");
        		_targetobj.removeClass("wfres_1");
        	} else {
        		_targetobj.addClass("wfres_1");
        		_targetobj.removeClass("wfres_1_slt");
        	}
        } catch (e) {}
	}, function () {
		//event.stopPropagation();
	}, 320, 90,true);
}

window.deletefile = deletefile;

function onAddUploadFile(ids,names,editorid){
	var paramDiv = jQuery('#'+editorid + '_div');
	var showfor = paramDiv.find("#_fileuploadphraseblock").attr("showfor");
	if(showfor != 2){
		var fieldannexuploadrequest = paramDiv.find("#field-annexupload-request").val();
		var phrase = "<a href='javascript:void(0);' onclick=\"parent.openFullWindowHaveBar('/docs/docs/DocDsp.jsp?id=" + ids + "&isrequest=1&requestid="+fieldannexuploadrequest+"&desrequestid=0')\" style=\"color:#123885;\">" + names + "</a>&nbsp;&nbsp;";
		if(phrase!=null && phrase!=""){
			//$GetEle("remarkSpan").innerHTML = "";
			try{
				UE.getEditor(editorid).setContent(phrase, true);
			}catch(e){
			}
		}
		paramDiv.find("#_fileuploadphraseblock").attr("showfor","1");
    //event.stopPropagation();
	}else{
		paramDiv.find("#_fileuploadphraseblock").attr("showfor","0");
	}
}

window.onAddUploadFile = onAddUploadFile;

function checkliid(id,editorid){
	var ischeck = false;
	var liarray = jQuery('#'+editorid+'_div').find("#_filecontentblock ul li");
	for (var j=0; j<liarray.length; j++) {
		if(jQuery.trim(jQuery(liarray[j]).attr("id")) == ("li_"+id)){
			ischeck = true;
		}
	}
	return ischeck;
}

window.checkliid = checkliid;

function showBt(id){
	jQuery("#li_"+id).find("a").css("background-image","url(/images/ecology8/workflow/annexdel_hover_wev8.png)");
}

window.showBt = showBt;

function hiddenBt(id){
	jQuery("#li_"+id).find("a").css("background-image","url(/images/ecology8/workflow/annexdel_wev8.png)");
}

window.hiddenBt = hiddenBt;

function addlinew(editorid){
	const paramDiv = jQuery('#'+editorid+'_div');
    sethraseblockPosition('_fileuploadphraseblock',editorid);
	//jQuery("#_fileuploadphraseblock").show();
		var ids = jQuery.trim(paramDiv.find("#field-annexupload").val());
		var names = jQuery.trim(paramDiv.find("#field-annexupload-name").val());
		var _ul = paramDiv.find("#_fileuploadphraseblock").find("#_filecontentblock ul");
		if(ids != "" && ids != null){
			var fieldcancle = paramDiv.find("#field-cancle").val();
			paramDiv.find("#promptinformation").html("").css("padding","2px");
			if(ids.indexOf(",") > -1){
				var idArray = ids.split(",");
				var nameArray = names.split(splitchar);
				for (var i=0; i<idArray.length; i++) {
			    	var curid = jQuery.trim(idArray[i]);
	                var curname = jQuery.trim(nameArray[i]);
	                if(!checkliid(jQuery.trim(curid),editorid)){
	                	//continue;
	                	_ul.append("<li id='li_"+curid+"' onclick=\"onAddUploadFile("+curid+",'"+curname+"','"+editorid+"')\" class=\"cg_item\"><span class='cg_detail' style='width:130px;' title='" + curname + "' >" + curname + "</span><a onmouseover=\"showBt("+curid+")\" onmouseout=\"hiddenBt("+curid+")\" onclick=\"deletefile("+curid+",'"+curname+"','"+editorid+"')\" style=\"float:right;width:10px;height:10px;margin-right:5px;margin-top:8px;background-image:url(/images/ecology8/workflow/annexdel_wev8.png);\" class=\"e8_delClass1\" title='"+fieldcancle+"' ></a></li>");
	                }
			    }
			}else{
				if(!checkliid(jQuery.trim(ids),editorid)){
                	//return;
                	_ul.append("<li id='li_"+ids+"' onclick=\"onAddUploadFile("+ids+",'"+names+"','"+editorid+"')\" class=\"cg_item\"><span class='cg_detail' style='width:130px;' title='" + names + "'>" + names + "</span><a onmouseover=\"showBt("+ids+")\" onmouseout=\"hiddenBt("+ids+")\" onclick=\"deletefile("+ids+",'"+names+"','"+editorid+"')\" style=\"float:right;width:10px;height:10px;margin-right:5px;margin-top:8px;background-image:url(/images/ecology8/workflow/annexdel_wev8.png);\" class=\"e8_delClass1\" title='"+fieldcancle+"' ></a></li>");
				}
			}
		}
    	var _outdiv = paramDiv.find("#_filecontentblock");
    	var _li = paramDiv.find("#_filecontentblock ul li");
    	if (_li.length > 4)  {
			paramDiv.find("#_filecontentblock").css("height", "124px");
			paramDiv.find("#_filecontentblock").css("overflow", "hidden");
			paramDiv.find("#_filecontentblock").perfectScrollbar({horizrailenabled:false,zindex:1000});
			paramDiv.find("#_filecontentblock").scrollTop(jQuery("#_filecontentblock ul").height());
			_li.show();
		}
    	if (_li.length == 4)  {
			paramDiv.find("#_filecontentblock").css("height", "94px");
			paramDiv.find("#_filecontentblock").css("overflow","");
		}
    	if (_li.length == 3)  {
			paramDiv.find("#_filecontentblock").css("height", "64px");
			paramDiv.find("#_filecontentblock").css("overflow","");
		}
    	if (_li.length == 2)  {
			paramDiv.find("#_filecontentblock").css("height", "34px");
			paramDiv.find("#_filecontentblock").css("overflow","");
		}
    	if (_li.length == 1)  {
			paramDiv.find("#_filecontentblock").css("height", "34px");
			paramDiv.find("#_filecontentblock").css("overflow","");
		}
}

window.addlinew = addlinew;

function sethraseblockPosition(domId,editorid){
	var el = jQuery('#'+editorid).find(".edui-for-wfannexbutton");
    var px=el.offset().left;
    var py=el.offset().top -69  + jQuery('.wea-new-top-req-content').scrollTop();
   	var paramDiv = jQuery('#'+editorid+'_div');
    if(editorid != 'remark'){
    	const elElement = jQuery('#'+editorid).find(".edui-for-wfannexbutton")[0].getBoundingClientRect();
    	px = elElement.left;
    	py = elElement.top + elElement.height - 3;
    	paramDiv.find("#"+domId).css('position','fixed');
    }
    paramDiv.find("#"+domId).css("z-index","999");
    paramDiv.find("#"+domId).css({"top":py + "px", "left":px+"px"});
    paramDiv.find("#"+domId).css('display','block');
}

window.sethraseblockPosition = sethraseblockPosition;