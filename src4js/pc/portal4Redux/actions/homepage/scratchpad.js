import {
    INIT_SCRATCHPAD_TEXT
} from '../../constants/ActionTypes';

import * as API_SCRATCHPAD from '../../apis/homepage/scratchpad';

const saveContent = (url, eid) => {
    return (dispatch, getState) => {
        API_SCRATCHPAD.saveContent(url).then(() => {
            $("#scratchpadarea_" + eid).attr("disabled", false);
        });
    }
}
export const saveScratchpad = (eid, userid, e) => {
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
                const url = '/page/element/scratchpad/ScratchpadOperation.jsp?eid=' + eid + '&userid=' + userid + '&operation=save&padcontent=' + padcontent;
                saveContent(url, eid);
            } else {
                obj.focus();
                obj.disabled = false;
            }
        } else {
            const url = '/page/element/scratchpad/ScratchpadOperation.jsp?eid=' + eid + '&userid=' + userid + '&operation=save&padcontent=' + padcontent;
            saveContent(url, eid);
        }

    }
}

export const initContent = (text) => {
    return (dispatch, getState) => {
        dispatch({
            type: INIT_SCRATCHPAD_TEXT,
            text: text
        });
    }
}