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