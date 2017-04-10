import { Input, Button } from 'antd';
import classNames from 'classnames';
const InputGroup = Input.Group;
import { WeaScroll } from 'ecCom';
class ContactsCom extends React.Component {
	openHrm(url){
		if(url) window.open(url);
	}
	render(){
		const { eid, list, esetting } = this.props;
		const { widths, imgSymbol } = esetting;
		let trArr = new Array;
		list.map((item,i)=>{
			let size = 1;
			var tdArr = new Array;
			var index = 0;
			tdArr.push(<td height="31" width="8px">{imgSymbol ? <img name='esymbol' src={imgSymbol}/>: null}</td>);
			for (var k in item) {
				if('name'=== k){
					tdArr.push(<td style={{minWidth:'90px'}} height="31" data-order={size-1}>
						<a href="javascript:void(0);" onClick={this.openHrm.bind(this,item[k].link)}><font className="font" style={{cursor: 'pointer'}}>{item[k].name}</font></a>
					</td>);
				}
				if('department'=== k){
					tdArr.push(<td width="*" data-order={size-1} height="31" style={{textAlign:'right'}}>
						<font className="font">{item[k]}</font>
					</td>)
				}
				if('tel'=== k){
					tdArr.push(<td width={widths[index]} height="31" data-order={size-1} style={{textAlign:'right'}}>
						<font className="font">{item[k]}</font>
					</td>)
				}
				if('mobile'=== k){
					tdArr.push(<td width={widths[index]} height="31" data-order={size-1} style={{textAlign:'right'}}>
						<font className="font">{item[k]}</font>
					</td>)
				}
				if('email'=== k){
					tdArr.push(<td width={widths[index]} height="31" data-order={size-1} style={{textAlign:'right'}}>
						<font className="font">{item[k]}</font>
					</td>)
				}
				index+=1;
			}
			trArr.push(<tr height="31">{tdArr}</tr>);
		});
			return <WeaScroll typeClass="scrollbar-macosx" className="e-contacts-scroll" conClass="e-contacts-scroll" conHeightNum={0}>
				<table id={`_contenttable_${eid}`} className="Econtent elementdatatable"  style={{tableLayout:'auto',margin:0}} width="100%">
					<tbody>
					{trArr}
					</tbody>
				</table>	
            </WeaScroll> 
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

module.exports = {
    ContactsCom,
    SearchInput
};
