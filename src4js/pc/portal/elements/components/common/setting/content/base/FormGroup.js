import React from 'react';
import {Icon} from 'antd';

export default class FormGroup extends React.Component {
    state = {
        isSpread: true
    };

    onStateChange() {
        const isSpread = this.state.isSpread;
        if (isSpread) {
            this.refs['fgContent'].style.display = 'none';
        } else {
            this.refs['fgContent'].style.display = 'block';
        }

        this.setState({
            isSpread: !isSpread
        });
    }

    render() {
        return (
            <div style={{position: 'relative', backgroundColor: '#fff'}}>
                <div style={{position: 'relative', height: '35px', lineHeight: '35px', borderBottom: '1px solid #e9e9e9'}}>
                    <span style={{display: 'inline-block', paddingLeft: '10px'}}><Icon type="bars"/><span style={{paddingLeft: '10px'}}>{this.props.title}</span></span>
                    {this.props.buttons}
                    <span style={{display: 'inline-block', float: 'right', padding: '0 10px', cursor: 'pointer'}} onClick={this.onStateChange.bind(this)}>
                        {this.state.isSpread ? <Icon type="up"/> : <Icon type="down"/>}
                    </span>
                </div>
                <div style={{position: 'relative', margin: 0, padding: 0}} ref="fgContent">{this.props.children}</div>
            </div>
        );
    }
}