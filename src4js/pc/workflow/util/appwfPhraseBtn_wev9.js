import Immutable from 'immutable'
/*
 * index 指定添加到工具栏上的那个位置，默认时追加到最后,
 * editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮
 * 常用批示语按钮
 * index 32
 * editorid 'remark'
 */
UE.registerUI('wfphrasebutton',function(editor,uiName){
	return initwfphrasebutton(editor,uiName);
}, 32, ['remark']);

const initwfphrasebutton = (editor,uiName) => {
	var language = readCookie("languageidweaver");
	var msg = SystemEnv.getHtmlNoteName(3449,language);
	var labelname = "@";
	var initphrase = function () {
		//点击其他地方，隐藏常用批示语选择框
		jQuery("html").live('mouseup', function (e) {
			if (jQuery("#_signinputphraseblock").is(":visible") && !!!jQuery(e.target).closest("#_signinputphraseblock")[0]) {
				jQuery("#_signinputphraseblock").hide();
				jQuery("#_addPhrasebtn").show()
				jQuery("#cg_splitline").show();
				jQuery("#addphraseblock").hide();
			}
			e.stopPropagation();
		});
		try {
			jQuery("html", jQuery("#remark").find("iframe")[0].contentWindow.document).live('mouseup', function (e) {
				if (jQuery("#_signinputphraseblock").is(":visible") && !!!jQuery(e.target).closest("#_signinputphraseblock")[0]) {
					jQuery("#_signinputphraseblock").hide();
					
					jQuery("#_addPhrasebtn").show()
					jQuery("#cg_splitline").show();
					jQuery("#addphraseblock").hide();
					
				}
				e.stopPropagation();
			});
		} catch (e) {}
		//combox html
		
		const markInfo = window.store_e9_workflow.getState().workflowReq.getIn(['params','signinputinfo']);
		const _hasPrivateRight = markInfo.get('hasAddWfPhraseRight');
		const phraseInfo 	= markInfo.get('phraseInfo').toJS();
		
		var comboxHtml = "" +
						"<div id=\"_signinputphraseblock\" class=\"_signinputphraseblockClass\" style='display:none;z-index:999;'>" +
						"	<div class=\"phrase_arrowsblock\"><img src=\"/images/ecology8/workflow/phrase/addPhrasejt_wev8.png\" width=\"14px\" height=\"14px\"></div>" +
						"	<div class=\"cg_block\"  style='background:#fff;'>" +
						"		<div id=\"_signinputphrasecontentblock\" style='height:100px;overflow-y:auto;'>" +
						"			<ul style='height:\"100%\";'>" +
						"				<li style=\"padding:2px;\"></li>" +
						"			</ul>" +
						"	    </div>" +
						"		<div class=\"cg_splitline\" id=\"cg_splitline\" style='display:none;'></div>";
				if(_hasPrivateRight){
					comboxHtml+="		<ul>" +
						"			<li >" +
						"				<div class=\"cg_optblock\" style=\"text-align:center;margin:2px 0 4px 0px;\">" +
						"					<span class=\"phrase_btn\" style=\"color:#1ca96f;\" id=\"_addPhrasebtn\">" +
						"						<img src=\"/images/ecology8/workflow/phrase/addPhrase_wev8.png\" height=\"22px\" width=\"22px\"  style=\"vertical-align:middle;\"/>" +
						"						<span style=\"display:none;\">	" +
						SystemEnv.getHtmlNoteName(3450,language) +
						"						</span>" +
						"					</span>" +
						"				</div>" +
						"			</li>" +
						"		</ul>" +
						"		<div id=\"addphraseblock\" class=\"addphraseblockClass\">" +
						"			<input type=\"text\" name=\"phraseinput\" id=\"phraseinput\" class=\"phraseinputClass\" style=\"\"><span style=\"margin-left:12px;color:#3c82b0;cursor:pointer;\" id=\"phraseqdbtn\">"+SystemEnv.getHtmlNoteName(3451,language)+"</span>" +
						"		</div>";
				}
				comboxHtml+="	</div>" +
						"</div>";
		var comboxobj = jQuery(comboxHtml);
		//插入dom对象
		jQuery('.wea-popover-hrm-relative-parent').append(comboxobj);
		
		//从隐藏的select中获取常用批示语
		var _ul = comboxobj.find("#_signinputphrasecontentblock ul");
	    for (var i=0; i<phraseInfo.length; i++) {
			
			var _style = "";			
	    	if (_ul.children("li").length > 3)  {
				//_style = " style='display:none;' ";
			}
			_ul.append("<li " + _style + " class=\"cg_item\"><span class='cg_detail'>" + phraseInfo[i].workflowPhrases + "</span><input type='hidden' value='"+phraseInfo[i].workflowPhrasesContent+"'/></li>");
	    }
	    //删除‘添加常用批示语’ 文字
		if (comboxobj.find("#_signinputphrasecontentblock ul li").length > 1) {
	    	jQuery(comboxobj).find("#cg_splitline").show();
	    } else {
	    	if(_hasPrivateRight){
	    		comboxobj.find("#_signinputphrasecontentblock ul").append("<li style=\"text-align:center;\" id='phrasedesc'><span class='cg_detail'>"+SystemEnv.getHtmlNoteName(3450,language)+"</span></li>");	
	    	}else{
	    		comboxobj.find("#_signinputphrasecontentblock ul").append("<li style=\"text-align:center;\" id='phrasedesc'><span class='cg_detail'>"+SystemEnv.getHtmlNoteName(4096,language)+"</span></li>");
	    	}
	    }
		
		//添加按钮 鼠标交互时事件
		jQuery("#_addPhrasebtn").hover(function () {
			jQuery(this).children("img").hide();
			jQuery(this).children("span").show();
		}, function () {
			jQuery(this).children("img").show();
			jQuery(this).children("span").hide();
		});
		
		jQuery("#_addPhrasebtn").bind("click", function () {
			jQuery(this).hide();
			jQuery("#cg_splitline").hide();
			jQuery("#addphraseblock").show();
			jQuery("#phraseinput")[0].focus();
		});
		
		jQuery("#_signinputphrasecontentblock ul li").live("click", function () {
			try {
            	_onAddPhrase(jQuery(this).find("input").val());
            } catch (e) {}
            jQuery("#_signinputphraseblock").hide();
            jQuery("#_addPhrasebtn").show()
			jQuery("#cg_splitline").show();
			jQuery("#addphraseblock").hide();
		});
		
		jQuery("#phraseqdbtn").bind("click", function () {
			var phrasetext = jQuery("#phraseinput").val();
			if (phrasetext != '') {
				
				phrasetext = jQuery("<div>" + phrasetext + "</div>").text();
				
				jQuery("#_signinputphrasecontentblock ul").append("<li class=\"loaddingli\"><span class='cg_detail' style='color:#7f7f7f;'>"+SystemEnv.getHtmlNoteName(3453,language)+"</span></li>");
				jQuery("#_signinputphrasecontentblock").scrollTop(jQuery("#_signinputphrasecontentblock ul").height());
				jQuery.ajax({
					type: "get",
					cache: false,
					url: "/workflow/sysPhrase/PhraseOperate.jsp?operation=add&phraseShort=" + encodeURI(phrasetext) + "&phraseDesc=" + encodeURI(phrasetext) + "&iswf=1",
				    contentType : "application/x-www-form-urlencoded;charset=UTF-8",
				    complete: function(){
					},
				    error:function (XMLHttpRequest, textStatus, errorThrown) {
				    } , 
				    success : function (data, textStatus) {
				    	jQuery("#phraseinput").val("");
				    	jQuery("#phrasedesc").remove();
				    	var lastli = jQuery("#_signinputphrasecontentblock ul .loaddingli");
						lastli.removeClass("loaddingli");
						lastli.addClass("cg_item");
						lastli.html("<span class='cg_detail'>" + phrasetext + "</span><input type='hidden' value='"+phrasetext+"'/>");
				    }
				});
				
			}
			jQuery("#_addPhrasebtn").show()
			jQuery("#cg_splitline").show();
			jQuery("#addphraseblock").hide();
		    
		});
	};
	
	//加常用短语
	var _onAddPhrase = function (phrase){
		if(phrase!=null && phrase!=""){
			try{
				var curContent = UE.getEditor("remark").getContent();
				var setFlag = true;		//true 追加内容，false清空再追加内容
				if(!!!curContent)
					setFlag = false;	//第一次添加批示语时不出现空行
				UE.getEditor("remark").setContent(phrase, setFlag);
			}catch(e){
			}
		}
	}
	
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function() {
        }
    });
    //创建一个button
    var btn = new UE.ui.Button({
        name:uiName,
        labelname:SystemEnv.getHtmlNoteName(3452,language),
        title:SystemEnv.getHtmlNoteName(3452,language),
        onclick:function () {
            var el = jQuery(".edui-for-wfphrasebutton");
            var px=el.offset().left;
		    var py=jQuery(".edui-for-wfphrasebutton").offset().top - 69 + jQuery('.wea-new-top-req-content').scrollTop();
			jQuery("#_signinputphraseblock").css({"z-index":"99999","top":py + "px", "left":px+"px"});
			jQuery("#_signinputphraseblock").show();
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
    
    initphrase();
    return btn;
}
