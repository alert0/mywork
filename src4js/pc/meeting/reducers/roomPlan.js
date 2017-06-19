import * as types from '../constants/ActionTypes'

let initialState = {
  title: '会议室使用情况',
  loading: false,
}

export default function roomPlan (state = initialState, action) {
  switch (action.type) {
    case types.ROOMPLAN_LOADING:
      return {...state, loading: action.loading}
    default:
      return state
  }
}