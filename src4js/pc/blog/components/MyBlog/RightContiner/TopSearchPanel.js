import React, { Component } from 'react'

import { DatePicker } from 'antd'

import { WeaInputSearch } from 'ecCom'

class TopSearchPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startValue: '',
      endValue: '',
      search: ''
    }
  }

  render () {
    return (
      <div className="wea-top-search-panel">
        <div className="wea-tsp-item">
          <DatePicker
            disabledDate={this.disabledStartDate}
            value={this.state.startValue}
            placeholder="开始日期"
            onChange={this.onChange.bind(null, 'startValue')}
            style={{width: '125px'}}
          />
        </div>
        <div className="wea-tsp-item">
          <DatePicker
            disabledDate={this.disabledEndDate}
            value={this.state.endValue}
            placeholder="结束日期"
            onChange={this.onChange.bind(null, 'endValue')}
            style={{width: '125px'}}
          />
        </div>
        <div className="wea-tsp-item">
          <WeaInputSearch
            placeholder=""
            value={this.state.search}
            onSearchChange={this.onChange.bind(null, 'search')}
            onSearch={this.onSearch}
            style={{width: '125px'}}
          />
        </div>
      </div>
    )
  }

  disabledStartDate = (startValue) => {
    if (!startValue || !this.state.endValue) {
      return false
    }
    return startValue.getTime() >= this.state.endValue.getTime()
  }
  disabledEndDate = (endValue) => {
    if (!endValue || !this.state.startValue) {
      return false
    }
    return endValue.getTime() <= this.state.startValue.getTime()
  }
  onChange = (field, value) => {
    this.setState(
      {
        [field]: value,
      },
      () => {
        if (field != 'search') {
          this.requestData({[field]: value})
        }
      }
    )
  }
  onSearch = () => {
    this.requestData({search: this.state.search})
  }
  requestData = (params) => {
    console.log(params)
  }

}

export default TopSearchPanel