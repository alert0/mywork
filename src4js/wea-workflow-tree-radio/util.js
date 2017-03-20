const server = window.server||"";

const getFd = (values) => {
    let fd = "";
    for(let p in values) {
        fd += p+"="+encodeURIComponent(values[p])+"&";
    }
    if(fd!="") {
        fd = fd.substring(0,fd.length-1);
    }
    return fd;
}

export const getFetchParams = (method,params)=>{
    let obj = {
        method:method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'X-Requested-With':'XMLHttpRequest'
        },
    };
    if(server=="") {
        obj.credentials = "include";
    }
    if(params) {
        obj.body = getFd(params);
    }
    return obj;
}

export const checkReject = (obj)=>{
    return obj && obj.status && obj.status==="false";
}

export const trim = (s) => {
    return s.replace(/(^\s*)|(\s*$)/g,'');
}


export const getDatas = (url,method,params) => {
    // console.log("url",url,"params",params);
    return new Promise((resolve,reject) => {
        fetch(server+url,
            getFetchParams(method,params)).then((response)=>{
                return response.json();
            }).then(function(json) {
            const data = json;
            // console.log("util",data.result);
            if(checkReject(data)) {
                reject(data.error || "后端数据处理异常");
            }
            else {
                resolve(data.result);
            }
        }).catch(function(ex) {
            reject("后端AJAX异常:",ex);
        });
    });
}
export const getTableDatas = (params) => {
    return new Promise((resolve,reject)=>{
        fetch(server+"/api/ec/dev/table/datas",
            getFetchParams("POST",params)).then((response)=>{
                return response.json();
            }).then(function(json) {
            const data = json;
            // console.log("utildata",data);
            if(checkReject(data)) {
                reject(data.error || "后端数据处理异常");
            }
            else {
                resolve(data);
            }
        }).catch(function(ex) {
            reject("后端AJAX异常:",ex);
        });
    });
}