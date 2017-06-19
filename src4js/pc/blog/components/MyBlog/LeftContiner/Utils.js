import React from 'react'
import { Rate, Icon, Button } from 'antd'

import '../../../css/myBlog/leftContiner/utils.less'

const Utils = {}

Utils.example = (props) => {
  const {...rest} = props
  return (
    <div {...rest}>

    </div>
  )
}

Utils.CircleImage = (props) => {
  const {diameter = 0, ...rest} = props
  return (
    <image style={{width: diameter, height: diameter, borderRadius: diameter / 2}} {...rest}/>
  )
}

Utils.RangeStar = (props) => {
  const getLength = value => {
    let length = value
    switch (true) {
      case value <= 0:
        length = 0
        break
      case value <= 5:
        let arr = value.toString().split('.')
        if (arr[1] >= 5) {
          length = Number(arr[0]) + 0.5
        } else {
          length = arr[0]
        }
        break
      case value > 5:
        length = 5
        break
      default:
        length = 0
        break
    }
    return length
  }
  const {name, value} = props,
    length = getLength(value)
  return (
    <div className="wea-range-star">
      <span className="wea-rs-item wea-rs-title">{name + ' :'}</span>
      <Rate allowHalf disabled value={length}/>
      <span className="wea-rs-item wea-rs-value">{Number(value).toFixed(1)}</span>
    </div>
  )
}

Utils.BasicInfoCard = (props) => {
  const {name, value, color, url, className, ...rest} = props
  return (
    <div className={'wea-basic-info-card ' + className} {...rest}>
      <span className="wea-bic-item wea-bic-name">{name}</span>
      <span className="wea-bic-item wea-bic-value" style={{color: color}}>{value}</span>
    </div>
  )
}

Utils.ToolTipBar = (props) => {
  const {name, type, color, tips} = props
  return (
    <div className="wea-tool-tip-bar">
      <Icon className="wea-ttb-item wea-ttb-icon" type={type} style={{color: color}}/>
      <span className="wea-ttb-item wea-ttb-name">{name}</span>
      {
        tips ? (
          <div className="wea-ttb-item wea-ttb-tip">
            <span>{tips}</span>
          </div> ) : null
      }
    </div>
  )
}

const CustomerItem = (props) => {
  const {name, date} = props
  return (
    <li className="wea-customer-item">
      <Utils.CircleImage diameter={40} src="/messager/usericon/loginid20160219160533.jpg"/>
      <div className="wea-ci-desc">
        <div className="wea-cid-item wea-cid-name">{name}</div>
        <div className="wea-cid-item wea-cid-date">{date}</div>
      </div>
    </li>
  )
}

Utils.CustomerList = (props) => {
  const {records, getList} = props,
    {
      list = [],
      currentPage,
      totalPage,
      totalSize,
      perPageSize
    } = records,
    leftStatus = !(currentPage > 1),
    rightStatus = !(currentPage < totalPage),
    onLeftClick = () => {
      getList({
        currentPage: currentPage - 1,
        perPageSize: 5
      })
    },
    onRightClick = () => {
      getList({
        currentPage: currentPage + 1,
        perPageSize: 5
      })
    }
  return (
    <div className="wea-customer-list">
      <ul className="wea-customer-content">
        {
          list.map(item => {
            return <CustomerItem {...item}/>
          })
        }
      </ul>
      <div className="wea-customer-switch">
        <Button onClick={onLeftClick} type="primary" disabled={leftStatus} shape="circle" icon="left"
                className="wea-cs-item"/>
        <Button onClick={onRightClick} type="primary" disabled={rightStatus} shape="circle" icon="right"
                className="wea-cs-item"/>
      </div>
    </div>
  )
}

export default Utils