import React, { Component, Children } from 'react'
import T from 'react-router/lib/PropTypes'
import classNames from 'classnames'

import { Icon, Tooltip } from 'antd'

import './dotCom.less'

import ComVar from '../ComVar'
const {Type, PrefixCls, Format} = ComVar
const P = PrefixCls + '-item-dot'

class DotCom extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {type, text, tip, format} = this.props,
      dotComCls = classNames(
        {
          [`${P}`]: true
        }
      ),
      dotComIconCls = classNames(
        {
          [`${P}-icon`]: true,
          [`${P}-icon-${type}`]: !!type
        }
      ),
      dotComCircleCls = classNames(
        {
          [`${P}-circle`]: true
        }
      ),
      dotComTextCls = classNames(
        {
          [`${P}-text`]: true,
          [`${P}-text-${format}`]: !!format
        }
      )
    return (
      <Tooltip title={tip} placement="right">
        <div className={dotComCls}>
          <div className={dotComCircleCls}>
            <Icon className={dotComIconCls} type={Type[type].icon}/>
          </div>
          <div className={dotComTextCls}>
            <span>{text}</span>
          </div>
        </div>
      </Tooltip>
    )
  }
}

DotCom.propTypes = {
  type: T.string,
  text: T.string,
  tip: T.string,
  format: T.string
}

DotCom.defaultProps = {
  type: Type.normal.name,
  text: Type.normal.text,
  tip: Type.normal.tip,
  format: Format.year,
}

export default DotCom