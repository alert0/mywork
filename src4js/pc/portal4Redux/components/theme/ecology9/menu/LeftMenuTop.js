import React from 'react';

import LeftMenuTop4Email from './LeftMenuTop4Email';

export default class LeftMenuTop extends React.Component {
    render() {
        return (
            <div className="e9-left-menu-top">
                { 'email' == this.props.leftMenuType
                    ? <LeftMenuTop4Email emailMenu={this.props.leftMenu} onSelect={this.props.onSelect}/>
                    : ''
                }
            </div>
        )
    }
}