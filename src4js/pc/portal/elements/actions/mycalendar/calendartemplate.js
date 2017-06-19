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
                const size = currEvents.length;
                const height = size * 34;
                htmlArr.push("<div id='planDataEvent' class='planDataEvent' style='height:"+(height+1)+"px;overflow-y: hidden; outline: none;'><div id='planDataEventchd' style='height:"+height+"px;'>");
                const calevents = caldata.events;
                for (var i = 0; i < size; i++) {
                    const eventKey = currEvents[i];
                    const eventsArr = calevents[eventKey];
                    htmlArr.push("<div class='hand dataEvent' height='34px' onclick='clickData(" + eventKey + "," + eid + ")' title="+eventsArr[2]+">");
                    htmlArr.push("<div class='dataEvent1' style='background:#a32929;'></div>");
                    htmlArr.push("<div class='dataEvent2'><div class='dataEvent2_1'>"+eventsArr[4]+"&nbsp;&nbsp;"+eventsArr[5]+"</div></div>");
                    htmlArr.push("<div class='dataEvent3'>"+eventsArr[2]+"</div>");
                    htmlArr.push("</div>");
                }
                htmlArr.push("</div></div>");
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
