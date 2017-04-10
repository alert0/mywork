import Immutable from 'immutable';
import {PLUGIN} from '../constants/ActionTypes';

/**
 * 插件
 *
 * @param state
 * @param action
 * @returns {*}
 */
export default function login(state = Immutable.fromJS({}), action) {
    switch (action.type) {
        default:
            return state;
    }
}
