import React, { Component } from 'react'
import PropTypes from 'react-router/lib/PropTypes'

import ComVar from '../ComVar'
const {WeiboStatus} = ComVar

import '../../../../css/myBlog/rightContiner/weibo.less'

class Weibo extends Component {
  static contextTypes = {
    router: PropTypes.routerShape
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {

  }

  render () {
    const {status = WeiboStatus.view, data = {}} = this.props,
      {content} = data
    return (
      <div className={"wea-myBlog-weibo-item"}>
        {
          status == WeiboStatus.edit ?
            <div>
              此处为一个富文本框<br/>
              第一行<br/>
              第二行<br/>
              第三行<br/>
            </div>
            : null
        }
        {
          status == WeiboStatus.view ?
            <div>{content}</div>
            : null
        }
      </div>
    )
  }

}

export default Weibo