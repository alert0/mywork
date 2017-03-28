import * as API from '../../apis/add'
import {Card,Icon,Popover,Button,AutoComplete,Menu,message} from 'antd';
import {WeaInputFocus} from 'weaCom'
import Immutable from 'immutable'
const is = Immutable.is;

class LinkCardItem extends React.Component{
	constructor(props) { 
        super(props);
        this.state = {
            width: 0
        }
    }
	componentDidMount(){
		if (!document.getElementsByClassName) {
		    document.getElementsByClassName = function (className, element) {
		        var children = (element || document).getElementsByTagName('*');
		        var elements = new Array();
		        for (var i = 0; i < children.length; i++) {
		            var child = children[i];
		            var classNames = child.className.split(' ');
		            for (var j = 0; j < classNames.length; j++) {
		                if (classNames[j] == className) {
		                    elements.push(child);
		                    break;
		                }
		            }
		        }
		        return elements;
		    };
		}
		let coms = document.getElementsByClassName('centerItem')[0];
		!!coms.offsetWidth && this.setState({width:coms.offsetWidth});
	}
	shouldComponentUpdate(nextProps,nextState) {
		const curOperWfid = this.props.curOperWfid;
		const curOperWfidNext = nextProps.curOperWfid;
		const wfbean = this.props.wfbean;
		const wfbeanNext = nextProps.wfbean;
		let needrender = false;
		needrender = curOperWfidNext === wfbeanNext.get("id") 
				&& (this.props.showBeagenters !== nextProps.showBeagenters
				|| this.props.showImportWf !== nextProps.showImportWf
				|| !is(this.props.importDataShow, nextProps.importDataShow))
        return !is(wfbean, wfbeanNext) || needrender
			|| this.props.iscommon !== nextProps.iscommon
			|| this.props.num !== nextProps.num
			|| this.state.width !== nextState.width;
    }
	render(){
		const {width} = this.state;
		const {wfbean,importDataShow,iscommon,num,showBeagenters,showImportWf,actions} = this.props;
		const beagenters = wfbean.get("beagenters");
		const belongtoUsers = wfbean.get("belongtoUsers");
		const wfColl = wfbean.get("wfColl");
		const user = wfbean.get("user");
		const isImportWf = wfbean.get("isImportWf");
		const wfid = wfbean.get("id");
		const wfname = wfbean.get("name");

		const isagent = !!beagenters && beagenters.size > 0;
		const isBelong = !!belongtoUsers && belongtoUsers.size > 0;
		const hasImportDate = !!importDataShow && importDataShow.size > 0;
		
		const isImport = isImportWf && isImportWf == "1";
		const colected = wfColl=="1";
		const isCreateBtn = isagent || isBelong;
		
		const agentWidth = isImport && !iscommon ? width-90 : ((isImport || !iscommon) ? width-60 : width-30);
		const importWidth = iscommon ? width-30 : width-60;
       	const colorarray = ["#55D2D4","#B37BFA","#FFC62E","#8DCE36","#37B2FF","#FF9537","#FF5E56"];
		return (
				<div className="centerItem" key={wfid} onMouseLeave={this.hideOperArea.bind(this)} >
					{iscommon && <span style={{color:colorarray[num%7],fontSize:'30px',float:'left',marginLeft:20}}><i className={'icon-New-Flow-' + (num == 9 ? '10' : ('0' + (num + 1)))} /></span>}
					<div className="fontItem" style={{'width': iscommon ? '60%':'100%'}}>
						<a onClick={this.onNewRequest.bind(this,wfid,0,0,0)} target="_blank" title={wfname}>{wfname}</a>
					</div>
					
					<div className= "imageItem" style={{"display":"none"}}>
							{isCreateBtn &&
								<div className='wea-add-drop-btn'>
								 	<span className='wea-add-drop-btn-area' onClick={this.agentCreate.bind(this)}>
								 		<Icon title="选择创建身份" type="team"/>
								 	</span>
								 	{showBeagenters && 
								 		<div className='wea-add-drop-content' style={{width:agentWidth}}>
								 			<div className='wea-add-drop-btn-on' onClick={this.agentCreate.bind(this)}>
								 				<Icon title="选择创建身份" type="team"/>
								 			</div>
								 			{isBelong &&
								 				<div>
										 			<span>次账号</span>
										 			<Menu>
											 			{belongtoUsers.map(b=>{
															return <Menu.Item>
																<a onClick={this.onNewRequest.bind(this,wfid,b.get("id"),0,1)} target="_blank">
																	{b.get("departmentName") && (b.get("departmentName"))}{b.get("jobtitlename") && ('/' + b.get("jobtitlename"))}
																</a>
															</Menu.Item>})
														}
										 			</Menu>
									 			</div>
								 			}
								 			{isagent &&
								 				<div>
										 			<span>代理他人创建</span>
										 			<Menu>
											 			{beagenters.map(b=>{
															return <Menu.Item>
																<a onClick={this.onNewRequest.bind(this,wfid,b.get("id"),0,1)} target="_blank">
																	{b.get("lastname")}{b.get("departmentName") && ('/' + b.get("departmentName"))}
																</a>
															</Menu.Item>})
														}
										 			</Menu>
									 			</div>
								 			}
								 		</div>
								 	}
								</div>
							}
							{isImport && 
								<div className='wea-add-drop-btn' >
									<span className='wea-add-drop-btn-area' onClick={this.importWf.bind(this)}>
									 	<Icon title="导入流程" type="download"/>
								 	</span>
								 	{showImportWf && 
								 		<div className='wea-add-drop-content' style={{width:importWidth}}>
								 			<div className='wea-add-drop-btn-on' onClick={this.importWf.bind(this)}>
								 				<Icon title="导入流程" type="download"/>
								 			</div>
								 			<WeaInputFocus onSearchChange={v=>actions.setImportSearchValue(v)}/>
								 			{hasImportDate ? <Menu style={{marginTop:10}}>
									 			{importDataShow.map((b,i)=>{
									 				if(i < 5) return <Menu.Item title={b.value}>
														<a style={{'padding':'0 12px 0 20px'}} onClick={()=>openwins(b,wfid)}>{b.get("value")}</a>
													</Menu.Item>})
												}
								 				</Menu> : <div>数据为空</div>
								 			}
								 		</div>
								 	}
								</div>
							}
							{!iscommon && 
								<div className='wea-add-drop-btn' >
									<Icon type={colected ? "star" : "star-o" } title={colected ? "取消收藏" : "加入我的收藏"} onClick={this.addWorkflow.bind(this,colected ? '0' : '1')}/>
								</div>
							}
					</div>				
				</div>
			   )
	}
	//新建流程
	onNewRequest(wfid,beagenter,f_weaver_belongto_userid,isagent,e){
		//计数
		jQuery.post('/workflow/request/AddWorkflowUseCount.jsp',{wfid:wfid});
//		jQuery('#workflowid').val(wfid);
//		jQuery('#isagent').val(isagent);
//		jQuery('#beagenter').val(beagenter);
//		jQuery('#subform').prop("action","/workflow/request/AddRequest.jsp");
//		jQuery('#subform').submit();
		
		openFullWindowHaveBar('/workflow/request/AddRequest.jsp?workflowid='+wfid+'&isagent'+isagent+'&beagenter'+beagenter);
	}
	//添加收藏
	addWorkflow(colected){
		const {wfbean,actions} = this.props;
		actions.doAddWfToColl(wfbean,colected);
	}
	//控制显示
	hideOperArea(indexid){
		const {actions,wfbean} = this.props;
		const wfid = wfbean.get("id");
		actions.setShowBeagenters(wfid, false);
		actions.setShowImportWf(wfid, false);
	}
	//代理创建
	agentCreate(){
		const {actions,wfbean,showBeagenters} = this.props;
		const wfid = wfbean.get("id");
		actions.setShowBeagenters(wfid, !showBeagenters);
		actions.setShowImportWf(wfid, false);
	}
	//流程导入
	importWf(){
		const {actions,wfbean,showImportWf} = this.props;
		const wfid = wfbean.get("id");
		if(showImportWf){
			actions.setShowImportWf(wfid, false);
		}else{
			const userid = wfbean.get("user").get("id");
			const params = {
				'f_weaver_belongto_userid':userid,
				"f_weaver_belongto_usertype":"0",
				"workflowid":wfbean.get("id"),
				"location":"Boston",
				"importuser":userid
			};
			actions.setImportSearchValue('');
			actions.getImportData(params);
		}
		actions.setShowBeagenters(wfid, false);
	}
}

export default LinkCardItem


function onNewWindows(redirectUrl){
	var width = screen.availWidth-10 ;
	var height = screen.availHeight-50 ;
	var szFeatures = "top=0," ;
	szFeatures +="left=0," ;
	szFeatures +="width="+width+"," ;
	szFeatures +="height="+height+"," ;
	szFeatures +="directories=no," ;
	szFeatures +="status=yes,toolbar=no,location=no," ;
	szFeatures +="menubar=no," ;
	szFeatures +="scrollbars=yes," ;
	szFeatures +="resizable=yes" ; //channelmode
	window.open(redirectUrl,"",szFeatures) ;
  }

function openwins(impobj,wfid){
  var  params="src=import&imprequestid="+impobj.get("data")+"&workflowid="+wfid+"&formid="+impobj.get("formid")+"&isbill="+impobj.get("isbill")+"&nodeid="
		  +impobj.get("nodeid")+"&nodetype="+impobj.get("nodetype")+"&requestname="+escape(impobj.get("value"));
  onNewWindows("/workflow/request/RequestImportOption.jsp?newmodeid=0&ismode=0&"+params);
}