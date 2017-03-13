import * as util from './util'
const server = window.server || "";
export const saveContent = (url) => {
    return new Promise((resolve, reject) => {
        fetch(server + url, util.getFetchParams("POST", {})).then(function(response) {
            /*let data = response.json();*/

        }).catch(function(ex) {
            reject("后端AJAX异常:", ex);
        });
    });
}