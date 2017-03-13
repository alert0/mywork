import { GET_MYCALENDAR_DATA } from '../constants/ActionTypes';
import ecLocalStorage from '../util/ecLocalStorage.js';
import Immutable from 'immutable';
import { reqMyCalendarDatas } from '../apis/req';
const getMyCalendarDatas = (value, mode, eid) => {
    return (dispatch, getState) => {
        $("#calendar_content" + eid).html("");
        if ("month" === mode) {
            var selectdate = "";
            if (typeof value === 'object') {
                var year = value.getYear();
                var month = value.getMonth() + 1 < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1;
                currentMonth = year + '-' + month;
                selectdate = year + '-' + month + '-01';
                if (selectdate === (new Date().format("yyyy-MM") + "-01")) {
                    currentSelectDate = new Date().format("yyyy-MM-dd");
                } else {
                    currentSelectDate = selectdate;
                }
            } else {
                selectdate = value;
                currentSelectDate = selectdate;
            }
            const dataid = new Date(currentSelectDate).format("yyyy-MM");
            const odata = ecLocalStorage.getObj("homepage-" + window.global_hpid, "MyCalendar-" + eid + "-" + dataid, true) || {};
            dispatch(initMyCalendarDatas(eid, odata));
            dispatch(loadMyCalendarEvents(eid, odata));

            const params = {
                ebaseid: 'MyCalendar',
                eid: eid,
                hpid: global_hpid,
                subCompanyId: global_subCompanyId,
                selectdate: selectdate
            }
            reqMyCalendarDatas(params).then((data) => {
                if (!Immutable.is(odata, data.data)) {
                    ecLocalStorage.set("homepage-" + window.global_hpid, "MyCalendar-" + eid + "-" + dataid, data.data, true);
                    dispatch(initMyCalendarDatas(eid, data.data));
                    dispatch(loadMyCalendarEvents(eid, data.data));
                }
            });
        }
    }
}

const initMyCalendarDatas = (eid, data) => {
    return (dispatch, getState) => {
        const icaldata = getState().mycalendar.get("caldata");
        var caldata = {};
        caldata[eid] = data;
        var ncaldata = icaldata.merge(Immutable.fromJS(caldata));
        dispatch({
            type: GET_MYCALENDAR_DATA,
            caldata: ncaldata
        });
    }
}
const loadMyCalendarEvents = (eid, caldata) => {
    return (dispatch, getState) => {
        const eventsObj = caldata.dateevents;
        for (var k in eventsObj) {
            if (k === currentSelectDate) {
                const currEvents = eventsObj[k];
                const htmlArr = new Array;
                const calevents = caldata.events;
                for (var i = 0; i < currEvents.length; i++) {
                    const eventKey = currEvents[i];
                    const eventsArr = calevents[eventKey];
                    htmlArr.push("<div style='height:34px; line-height:34px; border-left:3px solid #a32929;'>");
                    htmlArr.push("&nbsp;&nbsp;&nbsp;");
                    htmlArr.push("<a href='javascript:void(0);' style='color:#000000;' onclick='clickData(" + eventKey + "," + eid + ")'>");
                    htmlArr.push("<span>" + eventsArr[4] + "</span>");
                    htmlArr.push("&nbsp;&nbsp;&nbsp;");
                    htmlArr.push("<span>" + eventsArr[5] + "</span>");
                    htmlArr.push("&nbsp;&nbsp;&nbsp;");
                    htmlArr.push("<span>" + eventsArr[2] + "</span>");
                    htmlArr.push("</a>");
                    htmlArr.push("</div>");
                }
                $("#calendar_content" + eid).html(htmlArr.join(''));
            }
        }
    }
}


module.exports = {
    initMyCalendarDatas,
    getMyCalendarDatas,
    loadMyCalendarEvents
};
