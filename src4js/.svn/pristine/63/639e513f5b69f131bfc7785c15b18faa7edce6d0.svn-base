import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Input, Table, Button } from 'antd';
import { formatData } from '../../../util/formatdata';
import classNames from 'classnames';
const InputGroup = Input.Group;
import Toolbar from '../Toolbar';
import * as ContactsAction from '../../../actions/contacts';
//通讯录元素
class Contacts extends React.Component {
	handleChangeTab(tabid) {
		const { data, actions } = this.props;
		actions.getContactsData('', data.params, tabid);
	}
	render() {
		const { eid, data, toolbar, actions } = this.props;
		const { tabids, titles } = data;
		let cdata = this.props.cdata;
		let currtab = this.props.currtab;
		if (currtab === '') currtab = tabids[0];
		cdata = cdata.toJSON();
		if (_isEmpty(cdata)) cdata = data.data;
		return <div>
			<SearchInput placeholder="搜索姓名/首字母/手机号" type="contacts" onSearch={value => actions.getContactsData(value,data.params,currtab)} style={{width:'300px',marginTop:'5px'}} />
			<ContactsTitle eid={eid} currenttab={currtab} tabids={tabids} titles={titles} handleChangeTab={this.handleChangeTab.bind(this)} toolbar={toolbar}/>
			{_isEmpty(cdata.data) ? null: <ContactsContent list={ cdata.data} esetting={data.esetting}/>}
		</div>
	}
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
Contacts = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Contacts);
const mapStateToProps = state => {
	const { contacts } = state;
	return ({
		cdata: contacts.get("cdata"),
		currtab: contacts.get("currtab")
	})
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(ContactsAction, dispatch)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Contacts);


//tab的标题组件
const ContactsTitle = ({ eid, currenttab, tabids, titles, handleChangeTab, toolbar }) => {
	let tHtml = titles.map((title, i) => {
		const className = tabids[i] == currenttab ? "tab2selected" : "tab2unselected";
		return <td title={title} style={{wordWrap:'break-word',paddingTop:'5px',verticalAlign:'top'}} className={className} onClick={handleChangeTab.bind(this,tabids[i])}> {title}</td>
	});
	return <div id={`titleContainer_${eid}`} className="titlecontainer">
          <div id={`tabnavprev_${eid}`} className="picturebackhp"></div>
         <div id={`tabContainer_${eid}`} className="tabcontainer tab2">
         <table style={{tableLayout: "fixed"}} height="32" width={77*tabids.length}>
            <tbody>
            <tr>
            {tHtml}
            </tr>
            </tbody>
           </table>
          </div>
        <div id={`tabnavnext_${eid}`} className="picturenexthp"></div>
        {!_isEmpty(toolbar) ? <div className="optoolbar">
		<Toolbar eid={eid} toolbar={toolbar.toolbar} ele={toolbar.ele}/>
  </div>:null}
    </div>
}
const ContactsContent = ({ list, esetting }) => list.length !== 0 ? <div style={{overflowY:'scroll',maxHeight:'205px'}}><Table columns={formatData(list[0], esetting)} showHeader={false} pagination={false} dataSource={list} size="small"/></div> : <div></div>

const SearchInput = React.createClass({
	getInitialState() {
		return {
			value: '',
			focus: false,
		};
	},
	handleInputChange(e) {
		this.setState({
			value: e.target.value,
		});
		setTimeout(() => this.props.onSearch(this.state.value), 500);
	},
	handleFocusBlur(e) {
		this.setState({
			focus: e.target === document.activeElement,
		});
	},
	handleSearch() {
		if (this.props.onSearch) {
			this.props.onSearch(this.state.value);
		}
	},
	render() {
		const { style, size, placeholder } = this.props;
		const btnCls = classNames({
			'ant-search-btn': true,
			'ant-search-btn-noempty': !!this.state.value.trim(),
		});
		const searchCls = classNames({
			'ant-search-input': true,
			'ant-search-input-focus': this.state.focus,
		});
		return (
			<div className="ant-search-input-wrapper" style={style}>
        <InputGroup className={searchCls}>
          <Input placeholder={placeholder} value={this.state.value} onChange={this.handleInputChange}
            onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch}
          />
          <div className="ant-input-group-wrap">
            <Button icon="search" className={btnCls} size={size} onClick={this.handleSearch} />
          </div>
        </InputGroup>
      </div>
		);
	},
});
