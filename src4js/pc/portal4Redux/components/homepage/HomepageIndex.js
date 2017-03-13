  import React, {
    Component
  } from 'react';

  import {
    bindActionCreators
  } from 'redux';
  import {
    connect
  } from 'react-redux';
  import Homepage from './Homepage';
  import * as HomepageAction from '../../actions/homepage/';
  //门户组件
  class HomepageIndex extends Component {
    componentDidMount() {
      //console.log('HomepageIndex componentDidMount...');
      const {
          params,
          actions
      } = this.props;
      actions.getHpData(params);
      $("#btnWfCenterReload").attr("onclick", "elmentReLoad('8')");
    }
    componentDidUpdate() {
      //console.log('HomepageIndex componentDidUpdate...');
      const {
        params,
        actions
      } = this.props;
      actions.getHpData(params);
      $("#btnWfCenterReload").attr("onclick", "elmentReLoad('8')");
    }
    render() {
      //console.log('HomepageIndex render...');
      const params = this.props.params;
      if(params) {
        window.global_hpid = params.hpid;
        window.global_subCompanyId = params.subCompanyId;
        return <Homepage/>;
      } else {
        return <div></div>
      }
    }
  }
  const mapStateToProps = state => {
    return {}
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(HomepageAction, dispatch)
    }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(HomepageIndex);