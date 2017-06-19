import React, { Component } from 'react'
import T from 'prop-types'

import { Icon } from 'antd'

import './index.less'

const DataStatus = {
  loading: <Icon type="loading">&nbsp;&nbsp;&nbsp;&nbsp;加载中，请稍后！</Icon>,
  more: '滚动加载更多！',
  full: '没有更多内容！'
}

class WeaScrollPagination extends Component {
  constructor (props) {
    super(props)
    this.timeout = null
    this.startTime = new Date()
    this.state = {
      // anruo test count
      count: 0,
      height: props.height || 0,
      innerHeight: 'auto',
      isInit: true,
      isScroll: false,
      status: props.hasData ? DataStatus.more : DataStatus.full
    }
  }

  componentDidMount () {
    this.fetchData({anruo: this.state.count})
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.hasData !== null) {
      this.fetchAfter()
      this.setState({isInit: false})
    }

    if (nextProps.hasData === true) {
      this.setState({status: DataStatus.more})
    } else if (nextProps.hasData === false) {
      this.setState({status: DataStatus.full})
    } else {
      this.setState({status: DataStatus.loading, height: nextProps.height, isInit: false})
    }
  }

  checkScroll = () => {
    if (!this.state.isScroll) {
      let dom = document.getElementsByClassName('wea-sp-content')[0],
        {height} = this.state
      if (dom.scrollHeight <= height) {
        this.setState({isScroll: false, innerHeight: height + 100})
      } else {
        this.setState({isScroll: true, innerHeight: 'auto'})
      }
    }
  }

  resetScroll = () => {
    if (!this.state.isScroll) {
      this.setState({isScroll: false, innerHeight: 'auto'})
    }
  }

  scrollBefore = () => {
    let {scrollBefore} = this.props
    if (scrollBefore) {
      scrollBefore()
    } else {
      console.log('滚动加载前！')
    }
  }

  scrollAfter = () => {
    let {scrollAfter} = this.props
    if (scrollAfter) {
      scrollAfter()
    } else {
      console.log('滚动加载后！')
    }
  }

  fetchBefore = () => {
    let {fetchBefore} = this.props
    if (fetchBefore) {
      fetchBefore()
    } else {
      console.log('数据加载前！')
    }

    this.resetScroll()
  }

  fetchAfter = () => {
    let {fetchAfter} = this.props
    if (fetchAfter) {
      fetchAfter()
    } else {
      console.log('数据加载后！')
    }

    this.checkScroll()
  }

  fetchData = (params) => {
    if (!this.state.isInit) {
      this.scrollAfter()
    }
    this.fetchBefore()
    this.setState({status: DataStatus.loading, count: ++this.state.count},
      () => {
        // anruo test loading
        setTimeout(
          () => {
            this.props.fetchData(params)
          }, 0
        )
      }
    )
  }

  throttleFunction = (method, delay, time) => {
    let timeout = this.timeout, startTime = this.startTime
    return () => {
      let context = this,
        args = arguments,
        curTime = new Date()
      clearTimeout(timeout)
      if (curTime - startTime >= time) {
        method.apply(context, args)
        this.startTime = curTime
      } else {
        this.timeout = setTimeout(method, delay)
      }
    }
  }

  onScroll = (event) => {
    const dom = event.currentTarget
    this.throttleFunction(
      () => {
        const {status} = this.state
        if (status == DataStatus.more) {
          const {scrollTop, clientHeight, scrollHeight} = dom
          if (scrollTop + clientHeight == scrollHeight) {
            this.scrollBefore()
            this.fetchData({anruo: this.state.count})
          }
        }
      }, 167, 300)()
  }

  render () {
    let {status, count, height, innerHeight} = this.state,
      {className} = this.props

    return (
      <div className={'wea-scroll-pagination ' + (className ? className : '')}>
        <div className='wea-sp-content' onScroll={this.onScroll} style={{height: height}}>
          <div style={{height: innerHeight}}>
            {this.props.children}
          </div>
        </div>
        <div className='wea-sp-tip'>
          <span className='wea-sp-tip-item wea-sp-tip-line'/>
          <span className='wea-sp-tip-item wea-sp-tip-wrap '>
            <span className='wea-sp-tip-text' key={count}>{status}</span>
          </span>
        </div>
      </div>
    )
  }
}

WeaScrollPagination.propTypes = {
  fetchData: T.func.isRequired,
  hasData: T.oneOf([true, false, null]).isRequired,
  height: T.number.isRequired,
  scrollBefore: T.func,
  scrollAfter: T.func,
  fetchBefore: T.func,
  fetchAfter: T.func
}

export default WeaScrollPagination