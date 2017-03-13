import {WeaTools} from 'weaCom'
import isEmpty from 'lodash/isEmpty'

export const doWfInfoGet = params => {
	return WeaTools.callApi('/api/workflow/createreq/wfinfo', 'GET', params);
}

export const doAddWfToColl = params => {
    return new Promise((resolve,reject) => {
        fetch((window.server || "" ) + "/workflow/request/RequestHandlerWorkflow.jsp", getFetchParams("POST",params)).then(response => {
            resolve();
        });
    });
}

export const getRequestImportData = params => {
    return WeaTools.callApi('/workflow/request/RequestImportJson.jsp', 'POST', params);
}

const getFd = (values) => {
    let fd = "";
    for(let p in values) {
        fd += p+"="+encodeURIComponent(values[p])+"&";
    }
    fd += "__random__="+new Date().getTime();
    return fd;
}

const getFetchParams = (method,params)=>{
    let obj = {
        method:method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'X-Requested-With':'XMLHttpRequest'
        },
    };
    if(window.server == "") {
        obj.credentials = "include";
    }
    if(!isEmpty(params) && method.toUpperCase() !== 'GET') {
        obj.body = getFd(params);
    }
    return obj;
}