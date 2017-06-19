import { ELEMENT_TOOLBAR, ELEMENT_STATE_TYPES } from '../constants/ActionTypes';
const { ELEMENT_TOOLBAR_ISLOCK } = ELEMENT_TOOLBAR;
const { ELEMENT_DELETE } = ELEMENT_STATE_TYPES;
import { reqIsLockElement, reqUnLockElement, reqDeleteElement } from '../apis/toolbar';
import Immutable from 'immutable';
import { message } from 'antd';
const unlockElement = (eid) => {
    return (dispatch, getState) => {
        const params = {
           eid,
           hpid: global_hpid,
           subCompanyId: global_subCompanyId,
        };
        reqUnLockElement(params).then((result) => {
            if(result.status == "sucess")  {
                const iislock = getState().toolbar.get("islock");
                const iicon = getState().toolbar.get("icon");
                dispatch({
                    type: ELEMENT_TOOLBAR_ISLOCK,
                    islock: getImmutableData(eid, false, iislock),
                    icon: getImmutableData(eid, result.icon, iicon)
                });
            } else {
                message.error("解锁元素失败，请您联系管理员！", 3);
            }
        });
    }
}
const islockElement = (eid) => {
    return (dispatch, getState) => {
        const params = {
           eid,
           hpid: global_hpid,
           subCompanyId: global_subCompanyId,
        };
        reqIsLockElement(params).then((result) => {
            if(result.status == "sucess")  {
                const iislock = getState().toolbar.get("islock");
                const iicon = getState().toolbar.get("icon");
                dispatch({
                    type: ELEMENT_TOOLBAR_ISLOCK,
                    islock: getImmutableData(eid, true, iislock),
                    icon: getImmutableData(eid, result.icon, iicon)
                });
            } else {
               message.error("锁定元素失败，请您联系管理员！", 3);
            }
        });
    }
}
const getImmutableData = (eid, old, im) => {
    var ndata = {};
    ndata[eid] = old;
    var nresult = im.merge(Immutable.fromJS(ndata));
    return nresult;
}

const deleteElement = (eid) => {
    return (dispatch, getState) => {
       var group=$($("#item_"+eid).parents(".group")[0]);
       var flag=group.attr(_handleAttrName("areaflag"));
       var eids="";
       group.find(".item").each(function(){
           if($(this).attr("data-eid")!=eid) eids+=$(this).attr("data-eid")+",";
       });
       const params = {hpid: global_hpid,eid:eid,delFlag:flag,delAreaElement:eids,subCompanyId:global_subCompanyId};
       reqDeleteElement(params).then((result) => {
           if(result.status == "sucess")  {
               const iconfig = getState().elements.get("config");
               const idata = getState().elements.get("data");
               dispatch({
                   type: ELEMENT_DELETE,
                   config: getImmutableData(eid, {}, iconfig),
                   data: getImmutableData(eid, {}, idata)
               });
           }else{
               message.error("删除元素失败，请您联系管理员！", 3);
           }
       });
    }
}

module.exports = {
    unlockElement,
    islockElement,
    deleteElement
};
