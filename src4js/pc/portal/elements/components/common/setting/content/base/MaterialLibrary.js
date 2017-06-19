import React from 'react';
import {Input, Button} from 'antd';
const InputGroup = Input.Group;

// 素材库
export default class MaterialLibrary extends React.Component {
    showDialog() {
        let dialog = new Dialog();
        dialog.Title = '图片素材库';
        dialog.URL = '/page/maint/common/CustomResourceMaint.jsp?isDialog=1&?file=none&isSingle=';
        dialog.Width = top.document.body.clientWidth - 100;
        dialog.Height = top.document.body.clientHeight - 100;
        dialog.ShowCloseButton = true;
        dialog.opacity = 0.8;
        dialog.callbackfun = (obj, datas) => {
            this.props.form.setFieldsValue({
                [this.props.eProps.id]: datas.id
            });
        };
        dialog.show();
    }

    render() {
        return (
            <InputGroup className="esetting-browser">
                <Input type="text" size="default" className="esetting-browser-input" disabled={this.props.disabled} {...this.props.eProps}/>
                <Button icon="search" size="default" className="esetting-browser-search" disabled={this.props.disabled} onClick={this.showDialog.bind(this)}/>
            </InputGroup>
        );
    }
}