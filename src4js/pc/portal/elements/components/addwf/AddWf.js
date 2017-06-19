import { Table, Row, Col } from 'antd';
import { formatData } from '../../util/formatdata';
// 新建流程元素
class AddWfCom extends React.Component {
    render() {
        const { data, esetting } = this.props;
        const list = data.data;
        const columns = formatData(list[0], esetting);
        var dlist = new Array;
        for (var i = 0; i < list.length; i++) {
            if (i < 5) {
                dlist.push(list[i]);
            }else{
                break;
            }
        }
        if ("1" === esetting.displayLayout) 
            return <Table columns = { columns } showHeader = { false } pagination = { false } dataSource = { dlist } size = "small" />
    
        const evenData = new Array;
        const oddData = new Array;
        list.map((item, i) => {
            oddData.push(item);
            if (list[i + 1] !== undefined) 
                evenData.push(list[i + 1]);
        }, 2);
        return <Row>
	            <Col span = { 12 } order = { 1 }>
	            	<Table columns = { columns } showHeader = { false } pagination = { false } dataSource = { oddData } size = "small" />
	            </Col>
	            <Col span = { 12 } order = { 2 }>
	            	<Table columns = { columns } showHeader = { false } pagination = { false } dataSource = { evenData } size = "small" />
	            </Col>
            </Row>

    }
}

import { WeaErrorPage, WeaTools } from 'ecCom';
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
            return ( < WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" }/>
        );
    }
}

AddWfCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(AddWfCom);
export default AddWfCom;
