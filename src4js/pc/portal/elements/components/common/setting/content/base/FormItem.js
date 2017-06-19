import React from 'react';

export default class FormItem extends React.Component {
    render() {
        return (
            <div>
                <div>{this.props.label}</div>
                <div>{this.props.children}</div>
            </div>
        );
    }
}