import React, {Component} from 'react';

import Navbar from './navbar.js';

class Portal extends Component {
    render() {
        return (
            <div id="portal-content">
                <div id="navbar-container">
                    <Navbar location={this.props.location}
                            hpid={this.props.params.hpid}
                            subCompanyId={this.props.params.subCompanyId}
                    >
                    </Navbar>
                </div>

                <div id="homepage-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

module.exports = Portal;