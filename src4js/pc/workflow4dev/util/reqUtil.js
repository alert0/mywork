export const getformdatas = (workflowReqForm) =>{
	const mainData = workflowReqForm.get('mainData');
	const detailData = workflowReqForm.get('detailData');
	let formarea = {};
    mainData.mapEntries && mainData.mapEntries(f => {
    	f[1].mapEntries(o =>{
    		if(o[0] == 'value') {
    			const fieldname = updateHiddenSysFieldname(f[0]);
    			formarea[fieldname] = o[1];
    		}
		});
    });
	detailData && detailData.map((v,k) => {
		const detailIndex = parseInt(k.substring(7))-1;
		let submitdtlid = "";
		v.get("rowDatas").map((datas, rowKey) => {
			const rowIndex = parseInt(rowKey.substring(4));
			submitdtlid += rowIndex+",";
			datas.mapEntries && datas.mapEntries(f => {
				if(f[0] === "keyid"){
					formarea[`dtl_id_${detailIndex}_${rowIndex}`] = f[1];
				}else if(f[0].indexOf("field") > -1){
					const domfieldvalue = f[1] && f[1].get("value");
					const domfieldid = f[0]+"_"+rowIndex;
					formarea[domfieldid] = domfieldvalue;
				}
			});
		});
		formarea[`nodesnum${detailIndex}`] = v.get("rowDatas").size;
        formarea[`indexnum${detailIndex}`] = v.get("indexnum");
        formarea[`submitdtlid${detailIndex}`] = submitdtlid;
        formarea[`deldtlid${detailIndex}`] = (v.get("deldtlid")||"");
	});
    return formarea;
}

//处理系统字段名称 
export const updateHiddenSysFieldname = (fieldname) => {
	switch(fieldname){
		case 'field-1':
			return 'requestname';
		case 'field-2':
			return 'requestlevel';
		case 'field-3':
			return 'messageType';
		case 'field-5':
			return 'chatsType';
		default:
			return fieldname;
	}
}

//流程提交前相关操作
export const doAftareSubmit = (src,params) => {
	console.log("params",params);
	//post前调用公共方法
	let ischeckok = true;
	try{
		ischeckok = doAfterRequestSubmt(params);
	}catch(e){}
	//old
	if('submit' == src){
		try{
			ischeckok = checkCustomize();
		}catch(e){}
		try{
			ischeckok = checkCarSubmit;
		}catch(e){}
	}
	return ischeckok;
}

export const signMustInputTips = () =>{
	let  remarktop = parseInt(jQuery("#remark").offset().top);
	if(remarktop == 0){
		remarktop = parseInt(jQuery("#remarkShadowDiv").offset().top);
	}
	let scrolltop = 0;
	//判断意见框是否在可视区域
	
	const isVisual = remarktop > 0 && (remarktop - jQuery('.wea-new-top-req').height() + 200 <  jQuery('.wea-new-top-req-content').height());
	if(!isVisual) {
		if(remarktop - jQuery('.wea-new-top-req').height() + 200 > jQuery('.wea-new-top-req-content').height()){
			scrolltop = remarktop + jQuery('.wea-new-top-req-content').scrollTop() - 185;
		}
		if(remarktop <  (jQuery('.wea-new-top-req').height())){
			if(remarktop < 0) remarktop = remarktop * -1;	
			scrolltop = jQuery('.wea-new-top-req-content').scrollTop() - remarktop - jQuery('.wea-new-top-req').height() -100;
		}
		jQuery('.wea-new-top-req-content').animate({ scrollTop: scrolltop + "px" }, 0);
	}
	
	UE.getEditor('remark').focus(true);
}

export const getSignInputInfo = () =>{
	const remarkDiv = jQuery('#remark_div');
	return {
		signworkflowids:remarkDiv.find('#signworkflowids').val(),
		signdocids:remarkDiv.find('#signdocids').val(),
		remarkLocation:remarkDiv.find('#remarkLocation').val(),
		'field-annexupload':remarkDiv.find('#field-annexupload').val(),
		'field_annexupload_del_id':remarkDiv.find('#field_annexupload_del_id').val(),
		'field-annexupload-name':remarkDiv.find('#field-annexupload-name').val(),
		'field-annexupload-count':remarkDiv.find('#field-annexupload-count').val()
	};
}


export const listDoingRefresh =()=>{
	try{
		window.opener._table.reLoad();
	}catch(e){}
	try{
		//刷新门户流程列表
		jQuery(window.opener.document).find('#btnWfCenterReload').click();
	}catch(e){}
}
