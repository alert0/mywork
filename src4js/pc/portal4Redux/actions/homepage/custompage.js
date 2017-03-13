import {
    INIT_CUSTOMPAGE_VISIBLE
} from '../../constants/ActionTypes';
import ecLocalStorage from '../../util/ecLocalStorage.js';

export const setFrameData = (curProps) => {
    return (dispatch, getState) => {
        const eid = curProps.eid;
        const data = curProps.data;
        const currenttab = curProps.currenttab;
        dispatch(setLoadingVisible(true, eid));
        $("#ifrm_" + eid).attr({
            scrolling: "auto",
            noresize: "noresize",
            border: "0"
        });
        const ifrmUrl = data.url;
        if (ifrmUrl) {
            if (ifrmUrl.indexOf("http://") == 0 || ifrmUrl.indexOf("https://") == 0) {
                setTimeout(() => {
                    dispatch(setLoadingVisible(false, eid));
                    $("#ifrm_" + eid).attr({
                        src: ifrmUrl
                    });
                }, 500);
            } else {
                const ifrmsdata = ecLocalStorage.getStr("homepage-" + window.global_hpid, "ifrm_" + eid + "-" + currenttab, true)
                if (ifrmsdata) {
                    //解决刷新加载缓存空白的问题
                    setTimeout(() => {
                        dispatch(wirteDataToFrame(ifrmsdata, eid));
                        //解决改变url或URL返回的内容改变时不更新的问题
                        $.get(ifrmUrl, (result) => {
                            //判断返回的数据是否有变化，有的话更新缓存并重新渲染
                            if (result !== ifrmsdata) {
                                ecLocalStorage.set("homepage-" + window.global_hpid, "ifrm_" + eid + "-" + currenttab, result, true);
                                dispatch(wirteDataToFrame(result, eid));
                            }
                        });
                    }, 0.1);
                } else {
                    $.get(ifrmUrl, (result) => {
                        dispatch(wirteDataToFrame(result, eid));
                        ecLocalStorage.set("homepage-" + window.global_hpid, "ifrm_" + eid + "-" + currenttab, result, true);
                    });
                }
            }
        }
    }
}
const wirteDataToFrame = (data, eid) => {
    return (dispatch, getState) => {
        dispatch(setLoadingVisible(false, eid));
        document.getElementById("ifrm_" + eid).contentWindow.document.write(data)
        document.getElementById("ifrm_" + eid).contentWindow.document.close()
        try {
            document.getElementById("ifrm_" + eid).contentWindow.customPageInit()
        } catch (e) {}
    }
}

export const setLoadingVisible = (visible, eid) => {
    return (dispatch, getState) => {
        var nobj = {};
        nobj["frm_" + eid] = !visible; //visible ��loaded�෴
        var ninitedata = getState().custompage.get("loaded");
        var nresult = ninitedata.merge(nobj);
        dispatch({
            type: INIT_CUSTOMPAGE_VISIBLE,
            loaded: nresult
        });
    }
}