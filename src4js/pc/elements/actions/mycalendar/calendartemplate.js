import { MYCALENDAR_STATE_TYPES } from '../../constants/ActionTypes';
const { MYCALENDAR_DATA } = MYCALENDAR_STATE_TYPES;
import Immutable from 'immutable';
import { reqMyCalendarDatas } from '../../apis/mycalendar';
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
            const idata = getState().calendartemplate.get("data").toJSON();
            const odata = idata[eid];
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
                    dispatch(initMyCalendarDatas(eid, data.data));
                    dispatch(loadMyCalendarEvents(eid, data.data));
                }
            });
        }
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
const initMyCalendarDatas = (eid, data) => {
    return (dispatch, getState) => {
        const idata = getState().calendartemplate.get("data");
        var cdata = new Object;
        cdata[eid] = data;
        var ndata = idata.merge(Immutable.fromJS(cdata));
        dispatch({
            type: MYCALENDAR_DATA,
            data: ndata
        });
    }
}

module.exports = {
    initMyCalendarDatas,
    getMyCalendarDatas,
    loadMyCalendarEvents
};
