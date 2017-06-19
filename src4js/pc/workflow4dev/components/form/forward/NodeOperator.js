import { Tabs, Button, Checkbox, Icon } from 'antd'
import { WeaTools, WeaScroll } from 'ecCom'
import NodeItem from './NodeItem'
const TabPane = Tabs.TabPane;

class NodeOperator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			alldatas: [],
			allitems: [],
			unsubmititems: [],
			submititems: [],
			selectusers: [],
			selectnodes: [],
			selectTabKey: '1',
			selectAll: false,
			operatorname: ''
		};
	}

	componentDidMount() {
		const {
			requestid
		} = this.props;
		const _this = this;
		WeaTools.callApi('/api/workflow/reqforward/' + requestid, 'GET', {}).then(data => {
			_this.setState({
				alldatas: data
			});
			_this.initData(data);
		});
	}

	showNodeAllOperatorName(operatorname) {
		this.setState({
			operatorname: operatorname
		});
	}

	goList() {
		this.setState({
			operatorname: ''
		});
	}

	render() {
		const {
			allitems,
			unsubmititems,
			submititems,
			selectAll,
			selectTabKey,
			selectnodes,
			operatorname
		} = this.state;
		const {
			handleShowNodeOperator,
			setOperatorIds
		} = this.props;
		const nodata = (<div className="no-data">没有数据</div>);

		let allOperatorNameDiv = (
			<div>
					<div className="all-operator-name">
						{operatorname}
					</div>
					<div className="btn-back">
						<Icon type="rollback" onClick={this.goList.bind(this)}/>
					</div>
				</div>
		);

		return(
			<div className="wea-req-node-operator">
				<div className="title">
					<span>选择节点参与人作为转发对象</span>
				</div>
				<div className="content">
					  <Tabs activeKey={selectTabKey} tabBarExtraContent={<Checkbox checked={selectAll} onChange={this.selectAll.bind(this)}>全选</Checkbox>} onChange={this.changeTab.bind(this)}>
					    <TabPane tab="全部" key="1">
					    {allitems.length > 0 ?
					    	<WeaScroll className="wea-scroll" typeClass="scrollbar-macosx" >
						    	<div className="node-table">
						    		{operatorname != '' && allOperatorNameDiv}
					    			{operatorname == '' && allitems.map(item =><NodeItem item={item} selecttab={selectTabKey} selectAll={selectAll} updateSelectIds={this.updateSelectIds.bind(this)} selectnodes={selectnodes} showNodeAllOperatorName={this.showNodeAllOperatorName.bind(this)}/>)}
					    		</div>
				    		</WeaScroll>
				    		:
				    		nodata
					    }
					    </TabPane>
					    <TabPane tab="未提交" key="2">
					    {unsubmititems.length > 0 ?
					    	<WeaScroll className="wea-scroll" typeClass="scrollbar-macosx" >
						    	<div className="node-table">
						    		{operatorname != '' && allOperatorNameDiv}
						    		{operatorname == '' && unsubmititems.map(item =><NodeItem item={item} selecttab={selectTabKey} selectAll={selectAll}  updateSelectIds={this.updateSelectIds.bind(this)} selectnodes={selectnodes} showNodeAllOperatorName={this.showNodeAllOperatorName.bind(this)}/>)}
						    	</div>
					    	</WeaScroll>
					    	:
					    	nodata
					    }
					    </TabPane>
					    <TabPane tab="已提交" key="3">
					    {submititems.length > 0 ?
					    	<WeaScroll className="wea-scroll" typeClass="scrollbar-macosx" >
						    	<div className="node-table">
						    		{operatorname != '' && allOperatorNameDiv}
						    		{operatorname == '' && submititems.map(item =><NodeItem item={item} selecttab={selectTabKey} selectAll={selectAll}  updateSelectIds={this.updateSelectIds.bind(this)} selectnodes={selectnodes} showNodeAllOperatorName={this.showNodeAllOperatorName.bind(this)}/>)}
						    	</div>
					    	</WeaScroll>
					    	:
					    	nodata
					    }
					    </TabPane>
					  </Tabs>
				</div>
				<div className="footer">
					 <Button type="primary" onClick={this.btnOnClick.bind(this,setOperatorIds,handleShowNodeOperator)}>确定</Button>
				</div>
			</div>
		)
	}

	btnOnClick(setOperatorIds, handleShowNodeOperator) {
		setOperatorIds({
			datas: this.state.selectusers,
			isAllUser: false
		});
		handleShowNodeOperator(false);
		this.setState({
			selectTabKey: '1',
			selectnodes: [],
			selectusers: []
		});
	}

	changeTab(key) {
		this.setState({
			selectTabKey: key,
			selectAll: false,
			selectusers: [],
			selectnodes: [],
			operatorname: ''
		});
	}

	selectAll(e) {
		if(e.target.checked) {
			const {
				selectTabKey
			} = this.state;
			let selectusers = [];
			let selectnodes = [];
			if(selectTabKey == '1') {
				const {
					allitems
				} = this.state;
				allitems.map(o => {
					selectusers = selectusers.concat(o.users);
					selectnodes = selectnodes.concat(o.nodeid);
				});
			} else if(selectTabKey == '2') {
				const {
					unsubmititems
				} = this.state;
				unsubmititems.map(o => {
					selectusers = selectusers.concat(o.users);
					selectnodes = selectnodes.concat(o.nodeid);
				});
			} else {
				const {
					submititems
				} = this.state;
				submititems.map(o => {
					selectusers = selectusers.concat(o.users);
					selectnodes = selectnodes.concat(o.nodeid);
				});
			}
			this.setState({
				selectAll: true,
				selectusers: selectusers,
				selectnodes: selectnodes
			});
		} else {
			this.setState({
				selectAll: false,
				selectusers: [],
				selectnodes: []
			});
		}
	}

	//初始化列表数据
	initData(datas) {
		let allitems = [];
		let submititems = [];
		let unsubmititems = [];
		datas.map(o => {
			let f1 = true;
			let f2 = true;
			let f3 = true;
			let user = {
				'id': o.uid,
				'lastname': o.data,
				'jobtitlename': o.jobtitlename,
				'icon': o.icon,
				'type': 'resource',
				'departmentname': o.departmentname,
				'subcompanyname': o.subcompanyname,
				'supsubcompanyname': o.supsubcompanyname
			};
			allitems.map(a => {
				if(a.nodeid == o.nodeid) {
					a.users.push(user);
					a.names = a.names ? (a.names + '  ' + o.data) : o.data;
					f1 = false;
				}
			});
			if(f1) {
				allitems.push({
					'nodeid': o.nodeid,
					'nodename': o.nodename,
					'names': o.data,
					'users': [user]
				});
			}
			if(o.handed == '1') {
				submititems.map(b => {
					if(b.nodeid == o.nodeid) {
						b.users.push(user);
						b.names = b.names ? (b.names + '  ' + o.data) : o.data;
						f2 = false;
					}
				});
				if(f2) {
					submititems.push({
						'nodeid': o.nodeid,
						'nodename': o.nodename,
						'ids': o.uid,
						'names': o.data,
						'users': [user]
					});
				}
			}
			if(o.handed == '0') {
				unsubmititems.map(c => {
					if(c.nodeid == o.nodeid) {
						c.users.push(user);
						c.names = c.names ? (c.names + '  ' + o.data) : o.data;
						f3 = false;
					}
				});

				if(f3) {
					unsubmititems.push({
						'nodeid': o.nodeid,
						'nodename': o.nodename,
						'ids': o.uid,
						'names': o.data,
						'users': [user]
					});
				}
			}
		});
		this.setState({
			allitems: allitems,
			submititems: submititems,
			unsubmititems: unsubmititems
		});
	}

	updateSelectIds(bool, nodeid) {
		const {
			selectTabKey,
			selectnodes,
			allitems,
			submititems,
			unsubmititems
		} = this.state;
		let selectusers = [];
		let _selectnodes = selectnodes;
		if(bool) {
			_selectnodes.push(nodeid);
		} else {
			_selectnodes = _selectnodes.filter(o => {
				if(o == nodeid) {
					return false;
				}
				return true;
			});
		}

		if(selectTabKey == '1') {
			_selectnodes.map(o => {
				allitems.map(i => {
					if(o == i.nodeid) {
						selectusers = selectusers.concat(i.users);
					}
				});
			})
		}

		if(selectTabKey == '2') {
			_selectnodes.map(o => {
				unsubmititems.map(i => {
					if(o == i.nodeid) {
						selectusers = selectusers.concat(i.users);
					}
				});
			})
		}

		if(selectTabKey == '3') {
			_selectnodes.map(o => {
				submititems.map(i => {
					if(o == i.nodeid) {
						selectusers = selectusers.concat(i.users);
					}
				});
			})
		}
		this.setState({
			selectusers: selectusers,
			selectnodes: _selectnodes
		});
	}
}

export default NodeOperator