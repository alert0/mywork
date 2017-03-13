import React, {Component} from 'react';

class Loading extends Component {
    showLoading() {
        this.refs["_loading"].style.display = "block";
    }

    hideLoading() {
        this.refs["_loading"].style.display = "none";
    }

    render() {
        return (
            <div ref="_loading" className="_loading">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        );
    }
}

module.exports = Loading;