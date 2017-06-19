import { PORTAL_HP_SETTING, PORTAL_HP_SETTING_MAX, PORTAL_HP_SETTING_CLOSE,RIGHT_CLICK_LOCATION_SHOW} from '../constants/ActionTypes';
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    hpid:'',
    hpname:'',
    subCompanyId:'',
    max: true,
    close: true,
    data:{
        hpbaseelements:[],
        hpsettingmenu:[],
    },
    visible: false,
    refreshElement: false,
});
export default function hpsetting(state = initialState, action) {
    switch (action.type) {
        case PORTAL_HP_SETTING:
            return state.merge({
                 hpid: action.hpid,
				 hpname:action.hpname,
				 subCompanyId: action.subCompanyId,
				 max: action.max,
				 close: action.close,
                 data:action.data,
                 refreshElement: action.refreshElement
            })
      	case PORTAL_HP_SETTING_MAX:
	        return state.merge({
				 max: action.max,
                 refreshElement: action.refreshElement
	        })
	   	case PORTAL_HP_SETTING_CLOSE:
	        return state.merge({
				 close: action.close
	        })
        default:
            return state
    }
}