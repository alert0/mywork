import * as util from './util'
const server = window.server || "";
export const reqTabDatas = (url) => {
    return new Promise((resolve, reject) => {
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