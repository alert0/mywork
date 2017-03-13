import {Table  } from 'antd';

import Immutable from 'immutable'
const is = Immutable.is;

class Share extends React.Component {
	constructor(props) {
		super(props);
    }
	componentDidMount(){
		
	}
	
	shouldComponentUpdate(nextProps,nextState) {
        return  !is(this.props.datas,nextProps.datas) 
    }
	componentWillReceiveProps(nextProps){
		
	}
	componentWillUnmount() {
		
    }
    render() {
    	const {datas} = this.props;
		let isIE8 = window.navigator.appVersion.indexOf("MSIE 8.0") >= 0;
	    let isIE9 = window.navigator.appVersion.indexOf("MSIE 9.0") >= 0;
        return (
        	<div className='wea-workflow-status' >
	            <Row className="wea-workflow-status-content">
	            	<Col span={24}>
	            		<Table pagination={false} size="middle"/>
	            	</Col>
	            </Row>
            </div>
        )
    }
}

export default Share