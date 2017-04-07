import {Row ,Col} from 'antd';
import {WeaTable} from 'ecCom'
import cloneDeep from 'lodash/cloneDeep'

import {WeaTableRedux} from '../../../coms/index'

import Immutable from 'immutable'
const is = Immutable.is;

class Resources extends React.Component {
	constructor(props) {
		super(props);
    }
	shouldComponentUpdate(nextProps,nextState) {
		return !is(this.props.tabKey,nextProps.tabKey)||
		!is(this.props.actions,nextProps.actions);
   }
	componentDidMount(){
//		jQuery('.wea-workflow-resources').height(jQuery('.wea-new-top-req-content').height() - 5);
	}
    render() {
    	const {actions,tabKey} = this.props;
    	const menu = [
			{title:'全部',key:'0',},
			{title:'相关流程',key:'1'},
			{title:'相关文档',key:'2'},
			{title:'相关附件',key:'3'},
		];
        return <div className='wea-workflow-resources' >
        	<div className='wea-workflow-resources-tab'>
        		{
        			menu.map(t=>{
        				const isNow = t.key == tabKey;
        				return <div className='wea-workflow-resources-tab-item' style={isNow ? {background:'#4bb1fb',color:'#fff'} : {background:'transparent',color:'#848484'}} onClick={this.doChange.bind(this,t.key)}>
        					{t.title}
        				</div>
        			}
        		)}
        	</div>
    		<WeaTableRedux />
        </div>
    }
    doChange(key){
    	const {actions,requestid} = this.props;
    	actions.getResourcesKey(requestid, key);
    }
}

export default Resources

window.resourceOperate=(function(){
    return {
        downLoad(id, otherpara) {
            window.top.location='/weaver/weaver.file.FileDownload?fileid='+id+'&download=1&requestid='+otherpara+'&desrequestid=0';
	        return;
        },
        openReq(id, otherpara) {
            window.open('/workflow/request/ViewRequest.jsp?isrequest=1&requestid='+id);
	        return;
        },
        openDoc(id, otherpara) {
            window.open('/docs/docs/DocDsp.jsp?isrequest=1&id='+id+'&requestid='+otherpara);
	        return;
        }
    }
})()