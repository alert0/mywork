import React, {Component} from "react"
import { Button } from 'antd'
import { WeaTop, WeaTools } from 'ecCom'
const {callApi} = WeaTools

export default class Main extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      datas: []
    }
  }

  componentDidMount () {
    this.getDatas()
  }

  getDatas = () => {
    this.setState({loading: true})
    callApi('/api/datas', 'GET').then(datas => {
      this.setState({
        datas,
        loading: false
      })
    })
  }

  render () {
    const {loading, datas} = this.state
    const dropMenuDatas = [
      {
        key: 1,
        disabled: loading,
        icon: <i className='icon-search'/>,
        content: '搜索'
      }
    ]
    const btns = [
      (<Button type="primary" disabled={true} onClick={() => this.dosubmit()}>提交（禁用）</Button>),
      (<Button type="glost" disabled={false} onClick={() => this.dosubmit()}>提交</Button>)
    ]
    return (
      <WeaTop
        title={"WeaTop"}
        loading={loading}
        icon={<i className='icon-portal-workflow'/>}
        iconBgcolor='#55D2D4'
        buttons={btns}
        buttonSpace={10}
        showDropIcon={true}
        dropMenuDatas={dropMenuDatas}
        onDropMenuClick={this.onDropMenuClick}
      >
        <div style={{height: 2000}}>内容超出滚动</div>
      </WeaTop>
    )
  }

  onDropMenuClick = (key) => {
    console.log(`点击了下拉菜单的第${key}项`)
  }

  dosubmit = () => {
    console.log('点击了提交')
  }
}