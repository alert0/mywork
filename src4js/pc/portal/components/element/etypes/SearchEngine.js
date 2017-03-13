import classNames from 'classnames';
import { Input, Button } from 'antd';
const InputGroup = Input.Group;
//搜索元素
class SearchEngine extends React.Component {
	render() {
		const { eid, data } = this.props;
		return <div id={`searchengine_${eid}`} style={{paddingTop:'10px'}}>
			<SearchInput placeholder="请输入您要搜索的内容" onSearch={value => window.open(data.url+'&keyword='+value)} style={{ width: 300 }}/>
		</div>
	}
}



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

import { WeaErrorPage, WeaTools } from 'weaCom';
class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return (
			<WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
		);
	}
}
SearchEngine = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(SearchEngine);
export default SearchEngine;