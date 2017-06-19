import React, { Component } from 'react'

import { Col, Row, Menu } from 'antd'
const SubMenu = Menu.SubMenu

import WeaTop from './WeaTop'
import WeaHrmInput from './WeaHrmInput'

const components = {
  WeaTop: <WeaTop/>,
  WeaHrmInput: <WeaHrmInput/>
}

export default class Main extends Component {
  constructor (props) {
    super(props)
    this.state = {
      key: '1',
      component: <h2>hello</h2>
    }
  }

  componentDidMount () {
    document.getElementsByClassName('e9theme-layout-aside')
  }

  handleClick = (e) => {
    this.setState({
      key: e.key,
      component: components[e.key]
    })
  }

  render () {
    const {key, component} = this.state
    return (
      <Row>
        <Col span="3">
          <Menu onClick={this.handleClick}
                style={{width: '100%'}}
                defaultOpenKeys={['1']}
                selectedKeys={[key]}
                mode="inline"
          >
            <SubMenu key="1" title={<span>非业务组件</span>}>
              <Menu.Item key="WeaTop">WeaTop</Menu.Item>
            </SubMenu>
            <SubMenu key="2" title={<span>浏览按钮组件</span>}>
              <Menu.Item key="WeaHrmInput">WeaHrmInput</Menu.Item>
            </SubMenu>
          </Menu>
        </Col>
        <Col span="21">
          {component}
        </Col>
      </Row>

    )
  }
}