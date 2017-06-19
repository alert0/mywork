import { CUSTOMPAGE_STATE_TYPES } from '../../constants/ActionTypes';
const { CUSTOMPAGE_IFRAME_REFRESH } = CUSTOMPAGE_STATE_TYPES;
import ecLocalStorage from '../../util/ecLocalStorage.js';
const setFrameData = (curProps) => {
    return (dispatch, getState) => {
        const { eid, data, tabid } = curProps;
        $("#ifrm_" + eid).attr({
            scrolling: "auto",
            noresize: "noresize",
            border: "0"
        });
        const ifrmUrl = data.url;
        if (ifrmUrl) {
            if (ifrmUrl.indexOf("http://") == 0 || ifrmUrl.indexOf("https://") == 0) {
                setTimeout(() => {
                    dispatch(setLoadingVisible(true, eid, tabid));
                    $("#ifrm_" + eid).attr({ src: ifrmUrl });
                }, 500);
            } else {
                var arr = ifrmUrl.split(".");
                var last = arr[arr.length - 1]
                const index = last.indexOf("htm");
                const ifrmsdata = ecLocalStorage.getStr("portal-" + window.global_hpid, "ifrm_" + eid + "-" + tabid, true)
                if (ifrmsdata) {
                    //解决刷新加载缓存空白的问题
                    setTimeout(() => {
                        dispatch(wirteDataToFrame(ifrmsdata, eid, tabid));
                        //解决改变url或URL返回的内容改变时不更新的问题
                        $.ajax({
                            type: "GET",
                            url: ifrmUrl,
                            dataType: "html",
                            success: function(data) {
                                //判断返回的数据是否有变化，有的话更新缓存并重新渲染
                                if (data !== ifrmsdata) {
                                    ecLocalStorage.set("portal-" + window.global_hpid, "ifrm_" + eid + "-" + tabid, data, true);
                                    dispatch(wirteDataToFrame(data, eid, tabid));
                                }
                            },
                            error: function(xhr) {
                                dispatch(wirteDataToFrame(xhr.responseText, eid, tabid));
                            }
                        });
                    }, 0.1);
                } else {
                    $.ajax({
                        type: "GET",
                        url: ifrmUrl,
                        dataType: "html",
                        success: function(data) {
                            if (index >= 0) {
                                ecLocalStorage.set("portal-" + window.global_hpid, "ifrm_" + eid + "-" + tabid, data, true);
                            }
                            dispatch(wirteDataToFrame(data, eid, tabid));
                        },
                        error: function(xhr) {
                            dispatch(wirteDataToFrame(xhr.responseText, eid, tabid));
                        }
                    });

                }
            }
        }
    }
}
const wirteDataToFrame = (data, eid, tabid) => {
    return (dispatch, getState) => {
       dispatch(setLoadingVisible(true, eid, tabid));
        if(document.getElementById("ifrm_" + eid)){
            document.getElementById("ifrm_" + eid).contentWindow.document.write(data)
            document.getElementById("ifrm_" + eid).contentWindow.document.close()
            try {
                document.getElementById("ifrm_" + eid).contentWindow.customPageInit()
            } catch (e) {}
        }
    }
}

const setLoadingVisible = (loaded, eid, tabid) => {
    return (dispatch, getState) => {
        var nobj = {};
        var key = eid + "-" + tabid 
        nobj[key] = loaded; //visible ��loaded�෴
        var iloaded = getState().ecustompageiframe.get("loaded");
        var nloaded = iloaded.merge(nobj);
        dispatch({
            type: CUSTOMPAGE_IFRAME_REFRESH,
            loaded: nloaded
        });
    }
}

module.exports = {
    setFrameData,
    setLoadingVisible
};
