import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as login4e9Actions from '../../../actions/login4e9';

class E9BgImages extends React.Component {
    onChangeVisible() {
        const {actions, loginBgImagesVisible} = this.props;
        actions.changeLoginBgImagesVisible(!loginBgImagesVisible);
    }

    onChangeLoginBgImage(event) {
        const {actions} = this.props;
        let src = event.target.attributes['src'].value;
        actions.changeLoginBgImage(src);
    }

    render() {
        const {loginBgImages, loginBgImagesVisible, loginBgImage} = this.props;

        let images = loginBgImages.toJSON().map((item, index) => {
            let class4selected = loginBgImage == item ? 'e9login-bg-images-image-selected' : '';
            return (
                <img key={index}
                     className={`e9login-bg-images-image ${class4selected}`}
                     src={item}
                     alt=""
                     onClick={this.onChangeLoginBgImage.bind(this)}
                />
            )
        });

        return (
            <div className="e9login-bg-images">
                <div className="e9login-bg-images-btn" onClick={this.onChangeVisible.bind(this)}>
                    <div className="e9login-bg-images-shadow"></div>
                    <div className="e9login-bg-images-btn-icon">
                        <i className="wevicon wevicon-e9login-palette" />
                    </div>
                </div>
                {
                    loginBgImagesVisible ? (
                            <div className="e9login-bg-images-container" onMouseLeave={this.onChangeVisible.bind(this)}>
                                <div className="e9login-bg-images-shadow"></div>
                                <div className="e9login-bg-images-images">
                                    {images}
                                </div>
                            </div>
                        ) : ''
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    const {login4e9}=state;
    return {
        loginBgImages: login4e9.get('loginBgImages'),
        loginBgImagesVisible: login4e9.get('loginBgImagesVisible'),
        loginBgImage: login4e9.get('loginBgImage')
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(login4e9Actions, dispatch)
    }
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(E9BgImages);