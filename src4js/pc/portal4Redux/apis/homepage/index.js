import * as util from './util'
const server = window.server || "";
export const reqHpDatas = (params) => {
    return new Promise((resolve, reject) => {
        fetch(server + "/page/interfaces/homepageInterface.jsp", util.getFetchParams("POST", params)).then(function(response) {
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