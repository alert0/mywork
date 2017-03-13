import {Row ,Col} from 'antd';
import {WeaNewTableOld} from 'weaCom'
import cloneDeep from 'lodash/cloneDeep'

import Immutable from 'immutable'
const is = Immutable.is;

class Resources extends React.Component {
	constructor(props) {
		super(props);
    }
	shouldComponentUpdate(nextProps,nextState) {
		return !is(this.props.tabKey,nextProps.tabKey)||
		!is(this.props.actions,nextProps.actions)||
        !is(this.props.operates,nextProps.operates)||
        !is(this.props.datas,nextProps.datas)||
        !is(this.props.columns,nextProps.columns)||
        !is(this.props.current,nextProps.current)||
        !is(this.props.loading,nextProps.loading)||
        !is(this.props.count,nextProps.count);
   } 
	componentDidMount(){
//		jQuery('.wea-workflow-resources').height(jQuery('.wea-new-top-req-content').height() - 5);
	}
    render() {
    	const {actions,operates,datas,columns,count,current,tabKey,loading} = this.props;
    	const menu = [
			{title:'全部',key:'0',},
			{title:'相关流程',key:'1'},
			{title:'相关文档',key:'2'},
			{title:'相关附件',key:'3'},
		];
		let dKey = 'key' + tabKey;
		let operatesR = operates.get(dKey) ? operates.get(dKey).toJS() : [];
		let columnsR = columns.get(dKey) ? columns.get(dKey).toJS() : [];
		let datasR = datas.get(dKey) ? datas.get(dKey).toJS() : [];
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
    		<WeaNewTableOld
    			current={current}
    			heightSpace={40}
                tableCheck={false}
                operates={operatesR}
                loading={loading}
                onChange={(p,f,s)=>actions.getResourcesDatas(tabKey,p.current,p.pageSize,false)}
                columns={this.getColumns(columnsR)} 
                datas={datasR}
                count={count.get(dKey)} />
        </div>
    }
    doChange(key){
    	const {actions,current} = this.props;
    	actions.getResourcesDatas(key,1,10,false);
    }
    getColumns(columns) {
        let newColumns = cloneDeep(columns);
        return newColumns.map((column)=>{
            let newColumn = column;
            newColumn.render = (text,record,index)=>{ //前端元素转义
                let valueSpan = record[newColumn.dataIndex+"span"];
//              if(!valueSpan || valueSpan==="") {
//                  return text;
//              }
                function createMarkup() { return {__html: valueSpan}; };
                return (
                    <div className="wea-url" dangerouslySetInnerHTML={createMarkup()} />
                )
            }
            return newColumn;
        });
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