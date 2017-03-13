import * as util from './util'
const server = window.server || "";
export const getContactsData = (tabid, key, url) => {
    return new Promise((resolve, reject) => {
        let s1 = url.substring(0, url.indexOf("=") + 1);
        let s2 = url.substring(url.indexOf("&"), url.length);
        url = s1 + tabid + s2 + '&key=' + key;
        fetch(server + url, util.getFetchParams("POST", {})).then(function(response) {
            let data = response.json();
            if (util.checkReject(data)) {
                reject(data.error || "后端数据处理异常");
            } else {
                resolve(data);
            }
        }).catch(function(ex) {
            reject("后端AJAX异常:", ex);
        });
    });
}