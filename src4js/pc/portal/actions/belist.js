import { PORTAL_BE_LIST_FILTER } from '../constants/ActionTypes';
import {addReactElement } from '../apis/belist';
import { message } from 'antd';
const onAddReactElement = (ebaseid, areaflag = 'A',index = 0) => {
    return (dispatch, getState) => {
    	const params = {
    		ebaseid,
    		hpid: global_hpid,
    		subCompanyId: global_subCompanyId,
            areaflag,
            index
    	}
    	addReactElement(params).then((data) => {
        	if(data.status === 'success'){
    			refreshPortal();
        	}else{
        		message.error("添加元素失败，请您联系管理员！",2);
        	}
        });
    }
}

const filterElement = (value) => {
    return (dispatch, getState) => {
        dispatch({
            type: PORTAL_BE_LIST_FILTER,
            value: value
        });
    }
}
module.exports = {
    onAddReactElement,
    filterElement
};

