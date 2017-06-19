import PropTypes from 'react-router/lib/PropTypes'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Button, Tabs } from 'antd'
const TabPane = Tabs.TabPane;

import * as MyAttentionAction from '../actions/myAttention'

import { WeaErrorPage, WeaTools } from 'ecCom'

import {
    WeaTop,
    WeaTab,
    WeaLeftRightLayout,
    WeaInputSearch,
} from 'ecCom'


import '../css/myAttention.css'
//import { } from '../../coms/index'

class MyAttention extends React.Component {
	static contextTypes = {
		router: PropTypes.routerShape
	}
	constructor(props) {
		super(props);
		this.onRightMenuClick = this.onRightMenuClick.bind(this);
	}
	componentDidMount() {
		//一些初始化请求
		const { actions } = this.props;
	}
	componentWillReceiveProps(nextProps) {
		const keyOld = this.props.location.key;
		const keyNew = nextProps.location.key;
		//点击菜单路由刷新组件
		if(keyOld !== keyNew) {

		}
		//设置页标题
		//		if(window.location.pathname.indexOf('/') >= 0 && nextProps.title && document.title !== nextProps.title)
		//			document.title = nextProps.title;
	}
	shouldComponentUpdate(nextProps, nextState) {
		//组件渲染控制
		//return this.props.title !== nextProps.title
	}
	componentWillUnmount() {
		//组件卸载时一般清理一些状态

	}
	render() {
		const { loading, title } = this.props;
		console.log('myattention')
		return (
			<div className='wea-blog-my-attention'>
				<WeaTop
	              	title={title}
	              	loading={loading}
	              	icon={<i className='icon-portal-workflow' />}
	              	iconBgcolor='#ff7725'
	              	buttons={this.getButtons()}
	              	buttonSpace={10}
	              	showDropIcon={true}
	              	dropMenuDatas={this.getRightMenu()}
	              	onDropMenuClick={this.onRightMenuClick}
	              	>
					<WeaLeftRightLayout defaultShowLeft={true} leftCom={this.getLeft()} leftWidth={25}>
						<div style={{height:'100%',overflow:'auto'}}>
							<div style={{height:1000}}>内容</div>
						</div>
	              	</WeaLeftRightLayout>
              	</WeaTop>
            </div>
		)
	}
	getLeft(){
		const list = [
		{
			img: '',
			name: '张三',
			dep: '人力资源组',
			car: '人力资源模块测试'
		},
		{
			img: '',
			name: '李四',
			dep: '知识管理组',
			car: '知识管理模块负责人'
		}];
		return (
			<div style={{width:'100%',height:'100%'}}>
				<Tabs defaultActiveKey="1" >
				    <TabPane tab="我的关注" key="1"/>
				    <TabPane tab="组织结构" key="2"/>
				    <TabPane tab="分享给我" key="3"/>
				</Tabs>
				<div style={{padding:10,width:'100%',backgroundColor:'#eaeaea'}}>
					<WeaInputSearch style={{width:'100%'}}/>
				</div>
				<ul className=''>
					{
						list.map( l => {
							return (
								<li style={{height:65,width:'100%',padding:'10px 10px 0 65px',position:'relative',borderBottom:'1px solid #dadada'}}>
									<img style={{width:40,height:40,position:'absolute',left:15,top:10,borderRadius:'50%'}} src={l.img} />
									<p style={{color:'#262626',fontSize:14,lineHeight:'20px'}}>{l.name}</p>
									<p style={{color:'#959595',fontSize:12,lineHeight:'20px',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{`${l.dep} ${l.car}`}</p>
								</li>
							)
						})
					}
				</ul>
			</div>
		)
	}
//	<div style={{width:78,height:30,lineHeight:'30px',textAlign:'center',fontSize:12}}><i className='icon-Right-menu--search'/> 取消关注</div>
	onRightMenuClick(key){
    	if(key == '0'){
    		console.log('下拉添加关注')
    	}
    }
    getRightMenu(){
    	let btns = [];
    	btns.push({
    		icon: <i className='icon-Right-menu--search'/>,
    		content:'添加关注'
    	});
    	return btns
    }
	getButtons() {
    	let btns = [];
        btns.push(<Button type="primary" onClick={()=>{console.log('顶部添加关注')}}>添加关注</Button>)
        return btns;
    }

}

//组件检错机制
class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return(
			<WeaErrorPage msg={ hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" } />
		);
	}
}

MyAttention = WeaTools.tryCatch( React, MyErrorHandler, { error: "" })(MyAttention);

//form 表单与 redux 双向绑定
//MyAttention = createForm({
//	onFieldsChange(props, fields) {
//		props.actions.saveFields({ ...props.fields, ...fields });
//	},
//	mapPropsToFields(props) {
//		return props.fields;
//	}
//})(MyAttention);


// 把 state map 到组件的 props 上
const mapStateToProps = state => {
	const { loading, title } = state.blogMyAttention;
	return { loading, title }
}

// 把 dispatch map 到组件的 props 上
const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators(MyAttentionAction, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAttention);