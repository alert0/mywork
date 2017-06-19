import * as types from '../constants/ActionTypes'

let initialState = {
  title: '我的微博',
  loading: false,

  //mainPage
  indexInfo: {},
  basicInfo: {},
  receiverList: {},
  visitorList: {},
  weiboList: {},

}

export default function myBlog (state = initialState, action) {
  const {type, data} = action
  switch (type) {
    case types.MYBLOG_LOADING:
      return {...state, loading: action.loading}
    case types.MYBLOG_MAIN_PAGE_INDEX_INFO:
      //console.log('reduce indexInfo: ', data)
      return {...state, indexInfo: data}
    case types.MYBLOG_MAIN_PAGE_BASIC_INFO:
      //console.log('reduce basicInfo: ', data)
      return {...state, basicInfo: data}
    case types.MYBLOG_MAIN_PAGE_RECEIVER_INFO:
      //console.log('reduce receiverList: ', data)
      return {...state, receiverList: data}
    case types.MYBLOG_MAIN_PAGE_VISITOR_INFO:
      //console.log('reduce visitorList: ', data)
      return {...state, visitorList: data}
    case types.MYBLOG_MAIN_PAGE_WEIBO_INFO:
      //console.log('reduce weiboList: ', data)
      data.list = (state.weiboList.list||[]).concat(data.list)
      return {...state, weiboList: data}
    default:
      return state
  }
}