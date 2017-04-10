import { SIGN_VIEW,SIGN_VIEW_IS_MORE } from '../../constants/ActionTypes';
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    data: {},
    isMore:{}
});
export default function signview(state = initialState, action) {
    switch (action.type) {
        case SIGN_VIEW:
            return state.merge({
                data: action.data,
                isMore: action.isMore
            })
         case SIGN_VIEW_IS_MORE:
            return state.merge({
                isMore: action.isMore
            })
        default:
            return state
    }
}
