import { Tabs, Button, Checkbox } from 'antd'
import { WeaTools } from 'ecCom'
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
			selectids: '',
			selectTabKey: '1',
			selectAll: false
		};

		const { requestid } = this.props;
		const _this = this;
		WeaTools.callApi('/api/workflow/reqforward/' + requestid, 'GET', {}).then(data => {
			_this.setState({ alldatas: data });
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(this.state.alldatas !== nextState.alldatas) {
			this.initData(nextState.alldatas);
		}
		return true;
	}

	render() {
		const { allitems, unsubmititems, submititems, selectAll, selectTabKey } = this.state;
		const { handleShowNodeOperator, setOperatorIds } = this.props;
		const nodata = (<div className="no-data">没有数据</div>);
		return(
			<div className="wea-req-node-operator">
				<div className="title">
					<span>选择节点参与人作为转发对象</span>
				</div>
				<div className="content">
					  <Tabs tabBarExtraContent={<Checkbox checked={selectAll} onChange={this.selectAll.bind(this)}>全选</Checkbox>} onChange={this.changeTab.bind(this)}>
					    <TabPane tab="全部" key="1">
					    {allitems.length > 0 ?
				    		allitems.map(item =><NodeItem item={item} selecttab={selectTabKey} selectAll={selectAll} updateSelectIds={this.updateSelectIds.bind(this)}/>)
				    		:
				    		nodata
					    }
					    </TabPane>
					    <TabPane tab="未提交" key="2">
					    {unsubmititems.length > 0 ?
					    	unsubmititems.map(item =><NodeItem item={item} selecttab={selectTabKey} selectAll={selectAll}  updateSelectIds={this.updateSelectIds.bind(this)}/>)
					    	:
					    	nodata
					    }
					    </TabPane>
					    <TabPane tab="已提交" key="3">
					    {submititems.length > 0 ?
					    	submititems.map(item =><NodeItem item={item} selecttab={selectTabKey} selectAll={selectAll}  updateSelectIds={this.updateSelectIds.bind(this)}/>)
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
		setOperatorIds(this.state.selectids);
		handleShowNodeOperator(false);
	}

	changeTab(key) {
		this.setState({ selectTabKey: key, selectAll: false, selectids: '' });
	}

	selectAll(e) {
		if(e.target.checked) {
			const { selectTabKey } = this.state;
			let selectids = '';
			if(selectTabKey == '1') {
				const { allitems } = this.state;
				allitems.map(o => {
					selectids = selectids ? (selectids + ',' + o.ids) : o.ids;
				});
			} else if(selectTabKey == '2') {
				const { unsubmititems } = this.state;
				unsubmititems.map(o => {
					selectids = selectids ? (selectids + ',' + o.ids) : o.ids;
				});
			} else {
				const { submititems } = this.state;
				submititems.map(o => {
					selectids = selectids ? (selectids + ',' + o.ids) : o.ids;
				});
			}
			this.setState({ selectAll: true, selectids: selectids });
		} else {
			this.setState({ selectAll: false, selectids: '' });
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
			allitems.map(a => {
				if(a.nodeid == o.nodeid) {
					a.ids = a.ids ? (a.ids + ',' + o.uid) : o.uid;
					a.names = a.names ? (a.names + '  ' + o.data) : o.data;
					f1 = false;
				}
			});
			if(f1) {
				allitems.push({ 'nodeid': o.nodeid, 'nodename': o.nodename, 'ids': o.uid, 'names': o.data });
			}
			if(o.handed == '1') {
				submititems.map(b => {
					if(b.nodeid == o.nodeid) {
						b.ids = b.ids ? (b.ids + ',' + o.uid) : o.uid;
						b.names = b.names ? (b.names + '  ' + o.data) : o.data;
						f2 = false;
					}
				});
				if(f2) {
					submititems.push({ 'nodeid': o.nodeid, 'nodename': o.nodename, 'ids': o.uid, 'names': o.data });
				}
			}
			if(o.handed == '0') {
				unsubmititems.map(c => {
					if(c.nodeid == o.nodeid) {
						c.ids = c.ids ? (c.ids + ',' + o.uid) : o.uid;
						c.names = c.names ? (c.names + '  ' + o.data) : o.data;
						f3 = false;
					}
				});

				if(f3) {
					unsubmititems.push({ 'nodeid': o.nodeid, 'nodename': o.nodename, 'ids': o.uid, 'names': o.data });
				}
			}
		});
		this.setState({ allitems: allitems, submititems: submititems, unsubmititems: unsubmititems });
	}

	updateSelectIds(bool, ids) {
		const { selectids } = this.state;
		if(bool) {
			this.setState({ selectids: selectids ? (selectids + ',' + ids) : ids });
		} else {
			let result = selectids.replace(ids, '').replace(/,,/, ',').replace(/^,/, '').replace(/,$/, '');
			this.setState({ selectids: result });
		}
	}
}

export default NodeOperator