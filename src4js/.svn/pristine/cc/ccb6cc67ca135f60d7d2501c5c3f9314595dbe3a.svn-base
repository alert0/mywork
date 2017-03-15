import { INIT_SCRATCHPAD_TEXT } from '../constants/ActionTypes';

import { reqSaveContent } from '../apis/req';


const saveScratchpad = (eid, userid, e) => {

    return (dispatch, getState) => {
        var obj = e.target;
        $(obj).attr("disabled", true);
        let padcontent = obj.value;
        dispatch({
            type: INIT_SCRATCHPAD_TEXT,
            text: padcontent
        });
        if (padcontent === undefined) padcontent = "";
        const len = getBytesLength(padcontent);
        if (len > 4000) {
            const reply = confirm("便签内容超过4000字节,内容将被截取,是否保存?");
            if (reply) {
                padcontent = subStringByBytes(padcontent, 4000);
                const params = {
                    eid: eid,
                    userid: userid,
                    operation: 'save',
                    padcontent: padcontent
                }
                saveContent(params, eid);
            } else {
                obj.focus();
                obj.disabled = false;
            }
        } else {
            const params = {
                eid,
                userid,
                operation: 'save',
                padcontent
            }
            saveContent(params, eid);
        }

    }
}
const saveContent = (params, eid) => {
     $.ajax({
        type: "GET",
        url: "/page/element/scratchpad/ScratchpadOperation.jsp",
        data:params,
        success: function() {
            //判断返回的数据是否有变化，有的话更新缓存并重新渲染
            $("#scratchpadarea_" + eid).attr("disabled", false);
        },
        error: function(xhr) {
            $("#scratchpadarea_" + eid).attr("disabled", false);
        }
    });
}
const initContent = (text) => {
    return (dispatch, getState) => {
        dispatch({
            type: INIT_SCRATCHPAD_TEXT,
            text: text
        });
    }
}

module.exports = {
    saveScratchpad,
    initContent
};
