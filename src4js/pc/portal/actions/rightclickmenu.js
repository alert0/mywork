import { RIGHT_CLICK_MENU_LIST,RIGHT_CLICK_MENU_SHOW, RIGHT_CLICK_MENU_CLOSE,RIGHT_CLICK_LOCATION_SHOW,RIGHT_CLICK_SYNCHOME } from '../constants/ActionTypes';
import { reqRightClickMenu } from '../apis/rightclickmenu';
import Immutable from 'immutable';
const getRightClickMenu = () => {
    return (dispatch, getState) => {
        const paramsObj = getState().portal.get("params").toJSON();
        const key = window.global_hpid+"-"+window.global_isSetting;
        const params = paramsObj[key];
        reqRightClickMenu(params).then((data) => {
            if(!data.status){
                const imenu = getState().rightclickmenu.get("menu");
                dispatch({
                    type: RIGHT_CLICK_MENU_LIST,
                    menu: getImmutableData(key,data.rightclickmenu,imenu),
                });
            }
        });
    }
}

const showRightClickMenu = (pos) => {
    return (dispatch, getState) => {
        const key = window.global_hpid+"-"+window.global_isSetting;
        let menuList = getState().rightclickmenu.get("menu").toJSON()[key] || [];
        let position = pos;
        const menuHeight = menuList.length*30;
        if(pos.height){
            position = pos.position;
            if(pos.height < menuHeight){
                position.top = position.top - menuHeight;
            }
            if(pos.width < 100){
                position.left = position.left - 125;
            }
        }
        const iposition = getState().rightclickmenu.get("position");
        const ishow = getState().rightclickmenu.get("show");
        dispatch({
            type: RIGHT_CLICK_MENU_SHOW,
            position: getImmutableData(key,position,iposition),
            show: getImmutableData(key,true,ishow)
        });
    }
}

const showLocationURL = (visible)=>{
    return (dispatch, getState) => {
        const key = window.global_hpid+"-"+window.global_isSetting;
        const ivisible = getState().rightclickmenu.get("visible");
        dispatch({
            type: RIGHT_CLICK_LOCATION_SHOW,
            visible: getImmutableData(key,visible,ivisible)
        });
    }
}
const confirmSynchome=(visible)=>{
    return (dispatch, getState) => {
        const key = window.global_hpid+"-"+window.global_isSetting;
        const iisvisible = getState().rightclickmenu.get("isvisible");
        dispatch({
            type: RIGHT_CLICK_SYNCHOME,
            isvisible: getImmutableData(key,visible,iisvisible)
        });
    }
}


const closeRightClickMenu = (type) => {
    return (dispatch, getState) => {
        const key = window.global_hpid+"-"+window.global_isSetting;
        const ishow = getState().rightclickmenu.get("show");
        dispatch({
            type: RIGHT_CLICK_MENU_CLOSE,
            show: getImmutableData(key,false,ishow)
        });
        if(type){
            const lableMap = {
                shrinkAll:{
                    old: '全部收缩',
                    new: '全部展开'
                },
                hiddenElementLib: {
                    old:'隐藏元素库',
                    new:'显示元素库'
                }
            }
            const imenu = getState().rightclickmenu.get("menu");
            let menuList = imenu.toJSON()[key];
            for (var i = 0; i < menuList.length; i++) {
                let menuItem = menuList[i];
                if(menuItem.key === type) {
                    menuItem.label = menuItem.label === lableMap[type].old ? lableMap[type].new : lableMap[type].old;
                }
            }
            dispatch({
                type: RIGHT_CLICK_MENU_LIST,
                menu: getImmutableData(key,menuList,imenu)
            });
        }
    }
}

const getImmutableData = (key, old, im) => {
    var ndata = {};
    ndata[key] = old;
    var nresult = im.merge(Immutable.fromJS(ndata));
    return nresult;
}

module.exports = {
    getRightClickMenu,
    showRightClickMenu,
    closeRightClickMenu,
    showLocationURL,
    confirmSynchome
};

