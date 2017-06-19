import React, { Component } from 'react'
import PropTypes from 'react-router/lib/PropTypes'

class Agreement extends Component {
  static contextTypes = {
    router: PropTypes.routerShape
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {

  }

  componentWillReceiveProps (nextProps) {

  }

  shouldComponentUpdate (nextProps, nextState) {

  }

  componentWillUnmount () {

  }

  render () {
    return (
      <div className="wea-agreement">
        Agreement
      </div>
    )
  }

}

export default Agreement