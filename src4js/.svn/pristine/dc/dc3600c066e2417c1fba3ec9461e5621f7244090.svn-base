import { INIT_CONTACTS_DATA } from '../constants/ActionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({ 
	cdata: {}, 
	currtab: '' 
});
export default function contacts(state = initialState, action) {
    switch (action.type) {
        case INIT_CONTACTS_DATA:
            return state.merge({ 
            	cdata: action.cdata, 
            	currtab: action.currtab 
            })
        default:
            return state
    }
}
