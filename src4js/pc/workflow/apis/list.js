import {WeaTools} from 'ecCom'

export const getWfRequestList = params => {
    return WeaTools.callApi('/api/workflow/reqlist/list', 'GET', params);
}

//加载流程短语
export const loadPhrasesDatas = (params) => {
	return WeaTools.callApi('/api/workflow/phrases/getPhrases', 'GET', params);
}

//保存流程短语
export const savePhrasesText = (text) =>{
	let params = {
		operation: "add",
		phraseShort: text,
		phraseDesc: text
	}
	return WeaTools.callApi('/workflow/sysPhrase/PhraseOperate.jsp', 'GET', params, 'text');
}

//批量签字意见
export const OnMultiSubmitNew2 = (remark, _reqIds, datas) => {
	let belongtoUserids = "";
	datas && datas.map(d=>{
		_reqIds.split(',').map(r=>{
			if(d.requestid == r){
				let linkHref = d.requestnamespan.substring(d.requestnamespan.indexOf('href=')+5,d.requestnamespan.indexOf('>')-1);
				if (linkHref.indexOf("/workflow/request/ViewRequest.jsp") >= 0) {
					if (linkHref.indexOf("f_weaver_belongto_userid=") <= 0) {
						belongtoUserids += ",";
					} else {
						linkHref = linkHref.substring(linkHref.indexOf("f_weaver_belongto_userid=")+ ("f_weaver_belongto_userid=").length);
						linkHref = linkHref.substring(0, linkHref.indexOf("&"));
						belongtoUserids += linkHref + ",";
					}
				}
			}
		})
	})
	let params = {
		multiSubIds: _reqIds,
		remark: remark,
		pagefromtype:1,
		belongtoUserids: belongtoUserids
	};
	return WeaTools.callApi('/workflow/request/RequestListOperation.jsp', 'POST', params);
}
