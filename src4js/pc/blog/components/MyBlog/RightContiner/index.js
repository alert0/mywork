import React, { Component } from 'react'
import PropTypes from 'react-router/lib/PropTypes'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

import TopSearchPanel from "./TopSearchPanel"
import Weibo from "./Weibo/"
import Comment from "./Comment/"
import Agreement from "./Agreement/"
import Email from "./Email/"

class RightContainer extends Component {
  static contextTypes = {
    router: PropTypes.routerShape
  }

  constructor (props) {
    super(props)
  }

  render () {
    const {weiboList, actions} = this.props
    return (
      <div className="wea-right-container">
        <Tabs defaultActiveKey="1" size="small" tabBarExtraContent={<TopSearchPanel/>}>
          <TabPane tab="微博" key="1"><Weibo records={weiboList} actions={actions}/></TabPane>
          <TabPane tab="评论" key="2"><Comment/></TabPane>
          <TabPane tab="赞" key="3"><Agreement/></TabPane>
          <TabPane tab="@我" key="4"><Email/></TabPane>
        </Tabs>
      </div>
    )
  }

}

export default RightContainer