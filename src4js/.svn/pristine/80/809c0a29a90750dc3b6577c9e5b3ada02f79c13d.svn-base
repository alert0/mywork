import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as themeActions from '../../../actions/theme';
import {onLoadMain} from '../../../actions/theme';
import {showDialog} from '../../../util/themeUtils';

class E9ToolBar extends React.Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.loadToolbarMenu();
    }

    onToolbarMenuClick(item) {
        let title = item.name;
        let url = item.url;
        let opentype = item.opentype;
        console.log(item);

        if (opentype == '1') {
            showDialog(title, url, 700, 600, () => {
            });
        } else {
            onLoadMain({url: url, routeurl: '', target:  opentype == '0' ? '_blank' : 'mainFrame'});
        }
    }

    render() {
        const {toolbarMenu} = this.props;
        const toolbarMenu4JSON = toolbarMenu.toJSON();

        let items = toolbarMenu4JSON.map((item, index) => {
            return (
                <div key={index} className="e9header-toolbar-item" title={item.name} onClick={this.onToolbarMenuClick.bind(this, item)}>
                    <i className={`wevicon wevicon-e9header-toolbar-${item.key}`} />
                </div>
            )
        });

        return (
            <div className="e9header-toolbar">
                {items}
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {theme} = state;

    return {
        toolbarMenu: theme.get('toolbarMenu')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9ToolBar);