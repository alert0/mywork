import {Row, Col, Icon } from 'antd';
import Immutable from 'immutable'
import PropTypes from 'react-router/lib/PropTypes'
const is = Immutable.is;
const List = Immutable.List;

class SignListItem extends React.Component {
	static contextTypes = {
        router: PropTypes.routerShape
    }
	constructor(props) {
		super(props);
        this.state ={
        	showrivebtnspan:false
        }
    }
	shouldComponentUpdate(nextProps,nextState) {
		const logid = this.props.data.get('logid');
		let ischange = this.props.showuserlogids.includes(logid) == nextProps.showuserlogids.includes(logid);
        return  !is(this.props.data,nextProps.data)||
	        !is(this.props.isShowUserheadimg,nextProps.isShowUserheadimg)||!ischange||
	        !is(this.state.showrivebtnspan,nextState.showrivebtnspan)||
	        !is(this.props.forward,nextProps.forward);
    }
	componentWillUnmount() {
		
    }
    render() {
    	const {actions,data,isShowUserheadimg,forward,requestid,workflowid,showuserlogids} = this.props;
    	const {showrivebtnspan} = this.state;
    	let showUsers = false;
    	if(showuserlogids.includes(data.get('logid'))){
    		showUsers = true;
    	}
    	const dpurl = "/hrm/company/HrmDepartmentDsp.jsp?id="+data.get('displaydepid');
        return (
    		<div className='wea-workflow-req-sign-list-content' onMouseEnter ={() => this.setState({showrivebtnspan:true})} onMouseLeave={() => this.setState({showrivebtnspan:false})}>
				<div className='content-left'>
					{isShowUserheadimg && 
						<img src={data.get('img_path')} className='content-text-left-user-img'/>
					}
					<div style={{'width':'132px'}}>
						<p>
							{data.get('isexsAgent') && <a href={`javaScript:openhrm(${data.get('log_agentorbyagentid')})`} onClick={event => window.pointerXY(event)}>{data.get('displaybyagentname')}</a>}
							{data.get('isexsAgent') && <span>{`->`}</span>}
							<a href={`javaScript:openhrm(${data.get('displayid')})`} onClick={event => window.pointerXY(event)}>{data.get('displayname')}</a>
						</p>
						<span>
							<a href={dpurl} target="_blank" style={{color:'#9b9b9b','white-space':'pre-wrap'}}>
								{data.get('displaydepname')}
							</a>
						</span>
					</div>
				</div>
				<div className='content-right'>
					<div className='content-right-remark-html' dangerouslySetInnerHTML={{__html: (data.get('log_remarkHtml') ? data.get('log_remarkHtml') : '')}} />
					{List.isList(data.get('annexdocs')) && <div className='content-right-docs'>
						<i className='icon-mail-enclosure' />
						<div>
							{data.get('annexdocs').map(d=>{
								return <p><a target='_blank' href={d.get('filelink')}>{`${d.get('tempshowname')}.${d.get('fileExtendName')}`}</a>{' '}<a href={d.get('downloadlink')}>{`[下载(${(d.get('docImagefileSize')/1000).toFixed(1)}k)]`}</a></p>
							})}
						</div>
					</div>
					}
					{List.isList(data.get('signdocs')) && <div className='content-right-docs'>
						<i className='icon-search-File' />
						<div>
							{data.get('signdocs').map(d=>{
								return <p><a target='_blank' href={d.get('filelink')}>{d.get('tempshowname')}</a></p>
							})}
						</div>
					</div>
					}
					{List.isList(data.get('signwfs')) && <div className='content-right-docs'>
						<i className='icon-portal-workflow' />
						<div>
							{data.get('signwfs').map(w=>{
								return <p><a target='_blank' onClick={()=>{
									if(w.get('isRoute')){
										window.open(`${window.location.href.split('?')[0]}?requestid=${w.get('requestid')}&isrequest=1`)
									}else{
										window.open(`/workflow/request/ViewRequest.jsp?requestid=${w.get('requestid')}&isrequest=1`)
									}
								}}>{w.get('title')}</a></p>
							})}
						</div>
					</div>
					}
		    		{!showUsers && 
						<p style={{lineHeight:'24px',color:'#8a8a8a'}}>
							<span>接收人 : </span>
							{
								data.get('receiveUser') && data.get('receiveUser').split(',').map(p=>{
									return p + ' '
	 							})
							}
							{
								data.get('receiveUserCount') > 10 && <Icon className='content-text-right-open-btn' type='down' onClick={()=>actions.setShowUserlogid(data.get('logid'))} />
							}
						</p>
					}
		    		{showUsers &&
			    		<div className='wea-workflow-req-sign-list-users'>
			    			<div style={{color:'#323232',paddingRight:20}}>
								<span style={{color:'#c0c0c0'}}>接收人 : </span>
								{
									data.get('allReceiveUser') && data.get('allReceiveUser').split(',').map(p=>{
										return p + ' '
			 						})
								}
							</div>
							<Icon className='content-text-right-open-btn' type='up' onClick={()=>actions.setShowUserlogid(data.get('logid'))} />
				    	</div>
		    		}
					<p style={{lineHeight:'22px',marginTop:10,color:'#9a9a9a'}}>
						<span style={{marginRight:8}}>{`${data.get('log_operatedate')} ${data.get('log_operatetime')} `}</span>
						<span>{`[${data.get('log_nodename')} / ${data.get('operationname')}]`}</span>
						{showrivebtnspan &&
							<span style={{float:'right'}} className="reqlogbtn">
								<span style={{marginRight:16,cursor:'pointer'}}>{data.get('isReference') && <span onClick={()=>quoteClick(data)}><i className='icon-xxx-form-Quote' style={{marginRight:6}} />引用</span>}</span>
								<span style={{cursor:'pointer'}}>{forward == '1'&& <span onClick={()=>actions.setShowForward({"showForward":true,"forwardOperators":data.get('displayid'),"forwardflag":"1"})}><i className='icon-xxx-form-Forward' style={{marginRight:6}}/>转发</span>}</span>
							</span>
						}
					</p>
				</div>
    		</div>
        )
    }
}
export default SignListItem