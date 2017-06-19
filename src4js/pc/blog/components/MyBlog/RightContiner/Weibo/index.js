import React, { Component } from 'react'
import PropTypes from 'react-router/lib/PropTypes'

import { WeaTimeline, WeaScrollPagination } from '../../../Component/'
const {WeaItem} = WeaTimeline

import ComVar from '../ComVar'
const {WeiboStatus} = ComVar

import '../../../../css/myBlog/rightContiner/weibo.less'
const P = 'wea-myBlog-weibo'

import Wiebo from './Wiebo'

const Height = 600

class Weibos extends Component {
  static contextTypes = {
    router: PropTypes.routerShape
  }

  constructor (props) {
    super(props)
    this.timeout = null
    this.startTime = new Date()
  }

  getList = (params) => {
    const {actions} = this.props
    actions.getWeiboList(params)
  }

  render () {
    const {records} = this.props,
      {
        list = [],
        startDate,
        endDate
      } = records,
      hasData = (startDate && endDate ? startDate !== endDate : null)

    let weibos = []
    weibos.push({date: '', type: 'current', status: WeiboStatus.edit})
    weibos = weibos.concat(list)



    return (
      <WeaScrollPagination fetchData={this.getList} hasData={hasData} height={500} className="wea-myBlog-weibo">
        <WeaTimeline>
          {
            weibos.map(
              item => {
                const {date, type, ...rest} = item
                return <WeaItem date={date} type={type}><Wiebo {...rest}/></WeaItem>
              }
            )
          }
        </WeaTimeline>
      </WeaScrollPagination>
    )
  }

}

export default Weibos