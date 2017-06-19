import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { WeaErrorPage, WeaTools } from 'ecCom'

import * as Action from '../../actions/myBlog'
import View from './Main'

//组件检错机制
class MyErrorHandler extends Component {
  render () {
    const hasErrorMsg = this.props.error && this.props.error !== ''
    return (
      <WeaErrorPage msg={ hasErrorMsg ? this.props.error : '对不起，该页面异常，请联系管理员！' }/>
    )
  }
}

// 把 state map 到组件的 props 上
const mapStateToProps = state => {
  return {...state.blogMyBlog}
}

// 把 dispatch map 到组件的 props 上
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Action, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  WeaTools.tryCatch(
    React,
    MyErrorHandler,
    {error: ''}
  )(View)
)