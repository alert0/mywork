import { RIGHT_CLICK_MENU_SHOW, RIGHT_CLICK_MENU_CLOSE ,RIGHT_CLICK_LOCATION_SHOW,RIGHT_CLICK_SYNCHOME, RIGHT_CLICK_MENU_LIST } from '../constants/ActionTypes';
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
    position: {},
    menu: {},
    show: {},
    visible: {},
    isvisible: {}
});
export default function rightclickmenu(state = initialState, action) {
    switch (action.type) {
        case RIGHT_CLICK_MENU_LIST:
            return state.merge({
                menu: action.menu
            })
        case RIGHT_CLICK_MENU_SHOW:
            return state.merge({
                position: action.position,
                show: action.show
            })
        case RIGHT_CLICK_LOCATION_SHOW:
            return state.merge({
                visible:action.visible
            })
        case RIGHT_CLICK_SYNCHOME:
            return state.merge({
                isvisible:action.isvisible
            })
        case RIGHT_CLICK_MENU_CLOSE:
            return state.merge({
                show: action.show
            })
        default:
            return state
    }
}