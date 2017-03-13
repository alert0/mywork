import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loginActions from '../../../actions/login';

class E9MultiLang extends React.Component {
    onChangeVisible() {
        const {actions, multiLangVisible} = this.props;
        actions.changeMultiLangVisible(!multiLangVisible);
    }

    onSelectLang(event) {
        const {actions, multiLangVisible} = this.props;
        let langId = event.target.attributes['data-lang-id'].value;
        let langText = event.target.innerText;
        actions.selectLang(!multiLangVisible, langId, langText);
    }

    render() {
        const {hasMultiLang, multiLangVisible, langId, langText} = this.props;

        if (!hasMultiLang) {
            return (
                <div className="e9login-multiLang">
                    <input type="hidden" id="langId" name="langId" value={langId} />
                </div>
            )
        } else {
            let multiLangListHTML = '';
            let class4selected = '';
            if (multiLangVisible) {
                class4selected = 'e9login-multiLangText-selected';
                multiLangListHTML = (
                    <div className="e9login-multiLangList">
                        <ul onClick={this.onSelectLang.bind(this)}>
                            <li data-lang-id="7" className={langId == '7' ? 'e9login-multiLangList-selected' : ''}>简体中文</li>
                            <li data-lang-id="8" className={langId == '8' ? 'e9login-multiLangList-selected' : ''}>English</li>
                            <li data-lang-id="9" className={langId == '9' ? 'e9login-multiLangList-selected' : ''}>繁体中文</li>
                        </ul>
                    </div>
                );
            }

            return (
                <div className="e9login-multiLang">
                    <input type="hidden" id="langId" name="langId" value={langId} />
                    <span className={`e9login-multiLangText ${class4selected}`} onClick={this.onChangeVisible.bind(this)}>
                        <span>{langText}</span>
                        <i className="wevicon wevicon-e9login-arrow" />
                    </span>
                    {multiLangListHTML}
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    const {login} = state;
    return {
        hasMultiLang: login.get('hasMultiLang'),
        multiLangVisible: login.get('multiLangVisible'),
        langId: login.get('langId'),
        langText: login.get('langText')
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(loginActions, dispatch)
    }
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9MultiLang);