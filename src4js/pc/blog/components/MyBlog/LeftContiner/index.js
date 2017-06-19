import React, { Component } from 'react'
import PropTypes from 'react-router/lib/PropTypes'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

import { WeaTools, WeaTop, WeaLeftRightLayout } from 'ecCom'
import Utils from './Utils'
const {RangeStar, BasicInfoCard, CircleImage, ToolTipBar, CustomerList} = Utils

class LeftContiner extends Component {
  static contextTypes = {
    router: PropTypes.routerShape
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const {actions} = this.props
    actions.getIndexInfo()
    actions.getBasicInfo()
    actions.getReceiverList({
      currentPage: 1,
      perPageSize: 5
    })
    actions.getVisitorList({
      currentPage: 1,
      perPageSize: 5
    })
  }

  render () {
    const {indexInfo, basicInfo, receiverList, visitorList, actions} = this.props,
      rangeStar = [
        {name: '工作指数', value: indexInfo.work},
        {name: '心情指数', value: indexInfo.mood}
      ],
      basicInfoCard = [
        {name: '微博主页', value: basicInfo.mainPage, color: '#447eff', url: ''},
        {name: '我的微博', value: basicInfo.weibos, color: '#ff7725', url: ''},
        {name: '我的粉丝', value: basicInfo.fans, color: '#cc31ff', url: ''},
        {name: '我的关注', value: basicInfo.attentions, color: '#53c97a', url: ''}
      ],
      toolTipBar = [
        {name: '消息提醒', color: '#447eff', type: 'message', tips: basicInfo.messages},
        {name: '微博便签', color: '#ff7725', type: 'edit', tips: basicInfo.tags}
      ]
    return (
      <div className="wea-left-container">
        <div className="wea-lc-item wea-lc-top">
          <div className="wea-lct-image">
            <CircleImage diameter={70} src="/messager/usericon/loginid20160219160533.jpg"/>
          </div>
          <div className="wea-lct-desc">
            {
              rangeStar.map(item => {
                return <RangeStar {...item}/>
              })
            }
          </div>
        </div>
        <div className="wea-lc-item wea-lc-middle">
          {
            basicInfoCard.map((item, key) => {
              return <BasicInfoCard {...item} className={key % 2 == 0 ? 'wea-lcc-even' : 'wea-lcc-odd'}/>
            })
          }
        </div>
        <div className="wea-lc-item wea-lc-bottom">
          {
            toolTipBar.map(item => {
              return <ToolTipBar {...item}/>
            })
          }
        </div>
        <Tabs defaultActiveKey="1" size="small" className={'wea-basic-customer'}>
          <TabPane tab="最近来访" key="1">
            <CustomerList records={receiverList} getList={actions.getReceiverList}/>
          </TabPane>
          <TabPane tab="最近访问" key="2">
            <CustomerList records={visitorList} getList={actions.getVisitorList}/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default LeftContiner