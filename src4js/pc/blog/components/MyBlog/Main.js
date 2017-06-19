import React, { Component } from 'react'
import PropTypes from 'react-router/lib/PropTypes'

import { WeaTools, WeaTop, WeaLeftRightLayout } from 'ecCom'

import LeftContainer from './LeftContiner/index'
import RightContiner from './RightContiner/index'

import '../../css/myBlog/myBlog.less'
const P = 'wea-myBlog'

class MyBlog extends Component {
  static contextTypes = {
    router: PropTypes.routerShape
  }

  constructor (props) {
    super(props)
  }

  componentWillReceiveProps (nextProps) {
    const keyOld = this.props.location.key
    const keyNew = nextProps.location.key
    //点击菜单路由刷新组件
    if (keyOld !== keyNew) {

    }
    //设置页标题
    //		if(window.location.pathname.indexOf("/") >= 0 && nextProps.title && document.title !== nextProps.title)
    //			document.title = nextProps.title
  }

  render () {
    const {loading, title, actions, indexInfo, basicInfo, receiverList, visitorList, weiboList} = this.props
    return (
      <div className={P}>
        <WeaTop
          title={title}
          loading={loading}
          icon={<i className="icon-portal-blog"/>}
          iconBgcolor="#55D2D4"
          buttons={[]}
          showDropIcon={false}
        >
          <WeaLeftRightLayout
            defaultShowLeft={false}
            leftCom={
              <LeftContainer
                actions={actions}
                indexInfo={indexInfo}
                basicInfo={basicInfo}
                receiverList={receiverList}
                visitorList={visitorList}
              />
            }
            leftWidth={25}
          >
            <RightContiner
              actions={actions}
              weiboList={weiboList}
            />
          </WeaLeftRightLayout>
        </WeaTop>
      </div>
    )
  }

}

export default MyBlog