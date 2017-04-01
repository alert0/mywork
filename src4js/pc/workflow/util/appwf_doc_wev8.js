import Immutable from 'immutable'

/*
 * index 指定添加到工具栏上的那个位置，默认时追加到最后,
 * editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮
 * 相关文档
 * index 34
 */
UE.registerUI('wfdocbutton',function(editor,uiName){
	return initwfdocbutton(editor,uiName);
}, 34, 'remark,forwardremark');

const initwfdocbutton = (editor,uiName) => {
	let isSignDoc_edit = '0';
	if(editor.key == 'remark'){
		isSignDoc_edit = jQuery('#remark_div').find('#isSignDoc_edit_param').val();
	}else{
		isSignDoc_edit = jQuery('#forwardremark_hidden_area').find('#isSignDoc_edit').val();
	}
	if(isSignDoc_edit != '1'){
		return;
	}

	var language = readCookie("languageidweaver");
	var msg = SystemEnv.getHtmlNoteName(3449,language);
	var labelname = "@";
	
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function() {
            //showSignResourceCenter('signAnnexuploadCount')
            onShowSignBrowser4signinput('/docs/docs/MutiDocBrowser.jsp','/docs/docs/DocDsp.jsp?isrequest=1&id=','signdocids','signdocspan',37, 'signDocCount',editor.key)
        }
    });

    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:SystemEnv.getHtmlNoteName(3455,language),
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        /*cssRules :"background-image: url('/ueditor/custbtn/images/wf_doc_wev8.png') !important;background-position: -990px 1px!important;",*/
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
           editor.execCommand(uiName);
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
