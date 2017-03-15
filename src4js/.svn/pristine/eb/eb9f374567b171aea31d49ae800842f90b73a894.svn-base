//公告元素
class NewNotice extends React.Component {
	render() {
		const { eid, data, esetting } = this.props;
		let html = data.map(item => {
			return <tr style={{cursor:'pointer',verticalAlign: 'middle',marginBottom:'5px'}} onClick={showNewNotice.bind(this,eid,item.id)} name={`newnoticeitem_${eid}`}>
				<td>
					<div style={{height:'66px',width:'97px',position:'relative',border:'1px solid #d7d8e0',background:'url('+item.imgUrl+') center center no-repeat',backgroundSize:'100% 100%'}}>
					</div>
					<input type="hidden" name="" value={item.id}/>
				</td>
				<td>
				</td>
				<td style={{verticalAlign: 'middle'}}>
					<div className="siteminputblock">
						<div className="noticeinfoline" style={{height:'11px !important'}}></div>
						<div className="noticeitemtitle">{item.name}</div>
						<div className="noticeinfoline"></div>
						<div className="noticeitemdesc">
						{item.content}
						</div>
					</div>
				</td>
			</tr>
		});
		return <div>
      	<table id={`newNoticeViewTalbe_${eid}`} width="100%" height="100%" style={{borderSpacing:0,tableLayout:'fixed'}}>
			<colgroup><col width="97px"/><col width="18px"/><col width="*"/></colgroup>
			{html}
		</table>
		{esetting.esharelevel === '2' ? <div className="noticeitemnew">
			<div style={{position:'absolute',height:'24px',width:'24px',zIndex:10000,top:'50%',left:'50%',cursor:'pointer'}}>
				<a href="javascript:void(0);" onClick={addItem.bind(this,eid)}><img src="/page/element/newNotice/resource/image/new.png" height="24px" width="24px" style={{marginTop:'-12px',marginLeft:'-12px'}} title="添加公告"/></a>
			</div>
		</div>: null}
      </div>
	}
}

const addItem = eid => {
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	dialog.URL = "/page/element/newNotice/detailsetting.jsp?eid=" + eid;
	dialog.Title = "新建公告";
	dialog.Width = 600;
	dialog.Height = 768;
	dialog.normalDialog = false;
	dialog.maxiumnable = true;
	dialog.callbackfun = function(paramobj, id1) {};
	dialog.show();
}

const showNewNotice = (eid, id) => {
	var dialog = new window.top.Dialog();
	dialog.currentWindow = window;
	dialog.URL = "/page/element/newNotice/detailviewTab.jsp?eid=" + eid + "&id=" + id;
	dialog.Title = "查看公告";
	dialog.Width = 600;
	dialog.Height = 768;
	dialog.normalDialog = false;
	dialog.maxiumnable = true;
	dialog.callbackfun = function(paramobj, id1) {};
	dialog.show();
}


import { WeaErrorPage, WeaTools } from 'weaCom';
class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return (
			<WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
		);
	}
}
NewNotice = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(NewNotice);
export default NewNotice;