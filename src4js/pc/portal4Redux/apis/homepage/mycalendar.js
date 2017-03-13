import * as util from './util'
const server = window.server || "";
export const reqMyCalendarDatas = (url) => {
    return new Promise((resolve, reject) => {
        fetch(server + url, util.getFetchParams("POST", {})).then(function(response) {
            const data = response.json();
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