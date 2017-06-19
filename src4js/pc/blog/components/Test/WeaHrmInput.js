import React, {Component} from "react"
import { WeaHrmInput } from 'ecCom'

export default class Main extends Component {
  constructor (props) {
    super(props)
    this.state = {
      singleId: '', // 单人力id
      name: '', // 单人力显示name
      multIds: '',  // 多人力数据受控
      opsDatas: [], // 多人力显示受控
      maxLength: 100
    }
  }

  render () {
    const {singleId, name, multId, opsDatas, maxLength} = this.state
    return (
      <WeaHrmInput
        value={singleId}
        valueSpan={name}
        onChange={this.sHandler}
      />
    )
  }

  clear = () => {
    this.setState({singleId: null})
  }

  set = () => {
    this.setState({
      singleId: '1',
      valueSpan: '杨文元' //这俩个数据匹配，人力组件就会显示 ``杨文元 ``
    })
  }

  sHandler = (id, name) => {
    this.setState({singleId: id, name: name})
  }
}
