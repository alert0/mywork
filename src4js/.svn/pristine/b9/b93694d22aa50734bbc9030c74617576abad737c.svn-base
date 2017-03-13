import React from 'react';
import {Popover, Input} from 'antd';
import {WeaScroll} from 'weaCom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as themeActions from '../../../actions/theme';
import {onLoadMain} from '../../../actions/theme';

class E9QuickSearch extends React.Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.loadQuickSearchTypes();
    }

    onQuickSearchTypesClick(type) {
        const {actions} = this.props;
        actions.changeQuickSearchTypesSelected(type);

        this.onVisibleChange(false);
    }

    onVisibleChange(visible) {
        const {actions} = this.props;
        actions.changeQuickSearchTypesVisible(visible);
    }

    onSearch() {
        const {quickSearchTypesSelected} = this.props;
        const quickSearchTypesSelected4JOSN = quickSearchTypesSelected.toJSON();

        let searchType = quickSearchTypesSelected4JOSN.searchType;
        let form = quickSearchTypesSelected4JOSN.form;

        let searchValue = document.getElementById('e9header-quick-search-input').value;
        let searchUrl = `${form}?searchtype=${searchType}&searchvalue=${searchValue}`;
        let searchRouteUrl = '';

        if ('5' == searchType) {
            searchRouteUrl = `/workflow/queryFlow?from=quickSearch&requestname=${searchValue}`;
        }
        onLoadMain({url: searchUrl, routeurl: searchRouteUrl});
    }

    render() {
        const {quickSearchTypes, quickSearchTypesVisible, quickSearchTypesSelected} = this.props;
        const quickSearchTypes4JOSN = quickSearchTypes.toJSON();
        const quickSearchTypesSelected4JOSN = quickSearchTypesSelected.toJSON();

        const quickSearchTypesContent = <QuickSearchTypesContent quickSearchTypes={quickSearchTypes4JOSN} onQuickSearchTypesClick={this.onQuickSearchTypesClick.bind(this)} />;

        return (
            <div className="e9header-quick-search">
                <div className="e9header-quick-search-types">
                    <Popover visible={quickSearchTypesVisible} onVisibleChange={this.onVisibleChange.bind(this)} placement="bottomLeft" content={quickSearchTypesContent} trigger="click" overlayClassName="e9header-quick-search-types-popover">
                        <div className="e9header-quick-search-type">
                            <span>{quickSearchTypesSelected4JOSN.name}</span>
                            <i className="wevicon wevicon-e9header-quick-search-arrow" />
                        </div>
                    </Popover>
                </div>
                <div className="e9header-quick-search-content">
                    <Input id="e9header-quick-search-input" className="e9header-quick-search-input" placeholder="搜索内容…" onPressEnter={this.onSearch.bind(this)} />
                </div>
                <div className="e9header-quick-search-search" title="搜索" onClick={this.onSearch.bind(this)}>
                    <i className="wevicon wevicon-e9header-quick-search-search" />
                </div>
            </div>
        )
    }
}


class QuickSearchTypesContent extends React.Component {
    render() {
        const {quickSearchTypes} = this.props;

        let items = quickSearchTypes.map((item, index) => {
            return (
                <div key={index} className="e9header-quick-search-types-item" title={item.name} onClick={this.props.onQuickSearchTypesClick.bind(this, item)}>
                    <i className={`wevicon wevicon-e9header-quick-search-${item.key}`} />
                    <span>{item.name}</span>
                </div>
            )
        });

        return (
            <div>
                <div className="e9header-quick-search-types-content">
                    {items}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {theme} = state;

    return {
        quickSearchTypes: theme.get('quickSearchTypes'),
        quickSearchTypesVisible: theme.get('quickSearchTypesVisible'),
        quickSearchTypesSelected: theme.get('quickSearchTypesSelected')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(themeActions, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9QuickSearch);