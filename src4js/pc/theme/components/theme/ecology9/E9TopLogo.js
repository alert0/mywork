import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as themeActions from '../../../actions/theme';

class E9TopLogo extends React.Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.loadTopLogo();
    }

    render() {
        const {topLogoImage} = this.props;

        return (
            <div className="e9header-top-logo">
                { topLogoImage ? <img src={topLogoImage} alt="" /> : 'e-cology | 前端用户中心' }
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {theme} = state;

    return {
        topLogoImage: theme.get('topLogoImage')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9TopLogo);