var SystemEnvLabel = (function(){
	var __weaverLanguageLabelDefine = {
		128912:"所选流程被锁定，不能提交！",
		128911:"批量提交成功，有部分流程被锁定不能提交！",
		26039:"填写意见",
		24964:"流程转发",
		21766:"转发失败，请重试！",
		21625:"表单日志",
		20149:"请至少选择一条记录。",
		18981:"正在转发流程，请稍候....",
		26156:" 您确定要暂停当前流程吗 ?",
		21533:"打印日志 ",
		26158:"您确定要启用当前流程吗 ?",
		26157:"您确定要撤销当前流程吗 ?",
		24703:"您确定将该流程强制归档吗？"
		};
	return {
		getHtmlLabelName:function(labelid){
			var label = null;
			var multiLabel = false;
			try{
				multiLabel = labelid.indexOf(",")>-1;
			}catch(e){}
			if(!multiLabel){
				label = __weaverLanguageLabelDefine[labelid];
			
			}else{
				var labelids = labelid.split(",");
				for(var i=0;i<labelids.length;i++){
					if(label){
						label+=__weaverLanguageLabelDefine[labelids[i]];
					}else{
						label = __weaverLanguageLabelDefine[labelids[i]];
					}
				}
			}
			return label?label:null;
		}
}
})();

window.SystemEnvLabel = SystemEnvLabel;