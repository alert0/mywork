import React, { Component } from 'react'
import T from 'prop-types'
import { Timeline } from 'antd'

import './timelineItem.less'

import DotCom from './DotCom/index'
import ComVar from './ComVar'
const {Offset, Week, PrefixCls, Format, Type} = ComVar
const P = PrefixCls + '-item'

class WeaTimelineItem extends Component {
  constructor (props) {
    super(props)
  }

  getActualDate = (dateStr) => {
    let dateArr = dateStr.split('-'),
      date = new Date(dateArr[0], --dateArr[1], dateArr[2])
    return date
  }

  getDateDif = (start, end) => {
    return Math.abs(Math.trunc((start - end) / 86400000, 1))
  }

  getDateText = (date) => {
    const now = new Date(),
      days = this.getDateDif(now, date),
      yearNow = now.getFullYear(),
      yearDate = date.getFullYear()

    let text = '', format = ''

    if (yearNow >= yearDate) {
      if (days == 0) {
        text += '今天'
        format = Format.current
      } else if (days <= Offset) {
        text += Week[date.getDay()]
        format = Format.week
      } else {
        text += (date.getMonth() + 1) + '月' + date.getDate() + '日'
        format = Format.month
        if (yearNow !== yearDate) {
          text = (yearDate + '年') + text
          format = Format.year
        }
      }
    } else {
      text = '非法日期'
      format = Format.invalid
    }

    return [format, text]
  }

  getDateTip = (date) => {
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
  }

  render () {
    const {date, type, children} = this.props
    let format = Format.current, text = "今天", tip= Type.current.tip
    if (!!date) {
      const dateArr = date.split(' '),
        dateActual = this.getActualDate(dateArr[0])
      format = this.getDateText(dateActual)[0]
      text = this.getDateText(dateActual)[1]
      tip = Type[type].tip + ' ' + this.getDateTip(dateActual) + ' ' + dateArr[1]
    }
    return (
      <Timeline.Item className={P} dot={<DotCom type={type} text={text} tip={tip} format={format}/>}>
        {children}
      </Timeline.Item>
    )
  }
}

WeaTimelineItem.propTypes = {
  type: T.string,
  date: T.string,
}

WeaTimelineItem.defaultProps = {
  type: Type.normal.name
}

export default WeaTimelineItem