import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as themeActions from '../../actions/theme';

import {jsAsyncLoad, cssAsyncLoad} from '../../util/themeUtil';
import * as PLUGIN_API from '../../apis/plugin';

import E9Theme from './ecology9/E9Theme';
import E81Theme from './ecology81/E81Theme';
import { WeaLocale } from '../../../coms/index'

class Theme extends React.Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.loadThemeInfo();
    }

    componentDidMount() {
        const {actions} = this.props;

        // 切换主题颜色
        window.onChangeThemeColorType = (colorType) => {
            actions.changeThemeColorType(colorType);
        };

        // 插件加载
        setTimeout(function () {
            window.generatePluginAreaHtml = (pluginHtml, key) => {
                let dom = document.getElementById(key);
                if (dom) {
                    dom.innerHTML = pluginHtml;
                }
            };

            PLUGIN_API.getPlugin().then((result) => {
                let pluginCSS = result.pluginCSS;
                let pluginJS = result.pluginJS;
                for (let j = 0, len = pluginCSS.length; j < len; j++) {
                    cssAsyncLoad(pluginCSS[j], null);
                }
                for (let i = 0, len = pluginJS.length; i < len; i++) {
                    jsAsyncLoad(pluginJS[i], null);
                }
            });
        }, 10);
    }

    render() {
        const {themeInfo} = this.props;
        const themeInfo4JSON = themeInfo.toJSON();
        const themeType = themeInfo4JSON.themeType;
        const themeColorType = themeInfo4JSON.themeColorType;

        switch (themeType) {
            case 'ecology9':
                return <WeaLocale><E9Theme themeColorType={themeColorType} {...this.props} /></WeaLocale>;
            case 'ecology81':
                return <WeaLocale><E81Theme {...this.props} /></WeaLocale>;
            default:
                return <WeaLocale><div></div></WeaLocale>;
        }
    }
}

const mapStateToProps = (state) => {
    const {theme} = state;
    return {
        themeInfo: theme.get('themeInfo')
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    }
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Theme);