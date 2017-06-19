import * as types from '../constants/ActionTypes'

import { message } from 'antd'

import Apis from '../apis/myBlog'
const {mainPage} = Apis

export const doLoading = loading => {
  return (dispatch, getState) => {
    dispatch({
      type: types.MYBLOG_LOADING,
      loading
    })
  }
}

export const getIndexInfo = params => {
  return (dispatch, getState) => {
    mainPage.getIndexInfo(params)
      .then(
        result => {
          dispatch({
            type: types.MYBLOG_MAIN_PAGE_INDEX_INFO,
            data: result
          })
        }
      ).catch(
      error => {
        message.error(error)
      }
    )
  }
}

export const getBasicInfo = params => {
  return (dispatch, getState) => {
    mainPage.getBasicInfo(params)
      .then(
        result => {
          dispatch({
            type: types.MYBLOG_MAIN_PAGE_BASIC_INFO,
            data: result
          })
        }
      )
      .catch(
        error => {
          message.error(error)
        })
  }
}

export const getReceiverList = params => {
  return (dispatch, getState) => {
    mainPage.getReceiverList(params)
      .then(
        result => {
          dispatch({
            type: types.MYBLOG_MAIN_PAGE_RECEIVER_INFO,
            data: result
          })
        }
      ).catch(
      error => {
        message.error(error)
      }
    )
  }
}

export const getVisitorList = params => {
  return (dispatch, getState) => {
    mainPage.getVisitorList(params)
      .then(
        result => {
          dispatch({
            type: types.MYBLOG_MAIN_PAGE_VISITOR_INFO,
            data: result
          })
        }
      ).catch(
      error => {
        message.error(error)
      }
    )
  }
}

export const getWeiboList = params => {
  return (dispatch, getState) => {
    mainPage.getWeiboList(params)
      .then(
        result => {
          dispatch({
            type: types.MYBLOG_MAIN_PAGE_WEIBO_INFO,
            data: result
          })
        }
      ).catch(
      error => {
        message.error(error)
      }
    )
  }
}