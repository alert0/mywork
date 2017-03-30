import { Icon } from 'antd'
import { WeaTools } from 'ecCom'

export default class OGroup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showall: false,
			hrmgroups: []
		};

		const _this = this;
		WeaTools.callApi('/api/workflow/hrmgroup/datas', 'GET', {}).then(data => {
			_this.setState({ hrmgroups: data.datas });
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.hrmgroups !== nextState.hrmgroups ||
			this.state.showall !== nextState.showall;
	}

	//添加常用组
	addgroup(handleVisibleChange) {
		handleVisibleChange(false);
		const languageid = readCookie("languageidweaver");
		const title = SystemEnv.getHtmlNoteName(4672, languageid);
		const dialog = new window.top.Dialog();
		dialog.currentWindow = window;
		dialog.Title = title;
		dialog.Width = 550;
		dialog.Height = 550;
		dialog.Drag = true;
		dialog.maxiumnable = true;
		dialog.URL = "/hrm/HrmDialogTab.jsp?_fromURL=hrmGroup&method=HrmGroupAdd&isdialog=1";
		dialog.show();
	}

	add(setOperatorIds, ids, handleVisibleChange) {
		setOperatorIds(ids);
		handleVisibleChange(false);
	}

	render() {
		const { handleVisibleChange, setOperatorIds } = this.props;
		const { showall, hrmgroups } = this.state;

		return(
			<div className="wea-req-operate-group">
				<div className="wea-req-all-operators">
					<span>所有人</span>
				</div>
				<div className="wea-req-operate-content">
					<ul>
						{hrmgroups && 
							hrmgroups.map((o,index)=>{
								if(index > 2 && !showall){
									return true;
								}
								const count = o.ids.split(',').length;
								return  <li onClick={this.add.bind(this,setOperatorIds,o.ids,handleVisibleChange)}>
											<span className='cg_title'>{`${o.typename}（${count}人）`}</span>
											<span className='cg_detail'>{o.names}</span>
										</li>
							})
						}
					</ul>
				</div>
				{hrmgroups.length > 3 && !showall &&
					<div className="wea-req-operate-load-more" onClick={()=>this.setState({showall:true})}>
						<Icon type="down" />
						<span style={{'color':'#4397d3','margin-left':'10px'}}>显示全部</span>
					</div>
				}
				<div className="wea-req-operate-add" onClick={() => this.addgroup(handleVisibleChange)}>
					<span style={{'color':'#59b632'}}><Icon type="plus-square" /></span>
					<span style={{'color':'#323232','margin-left':'10px'}}>添加常用组</span>
				</div>
			</div>
		)
	}
}