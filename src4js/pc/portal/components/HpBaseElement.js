import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { WeaErrorPage, WeaTools } from 'ecCom';
import * as BeListAction from '../actions/belist';
import classNames from 'classnames';
import { Input, Button,Icon } from 'antd';
import { WeaNewScroll } from 'ecCom';
const InputGroup = Input.Group;

class HpBaseElement extends React.Component{
    componentWillMount(){
        const { actions } = this.props;
        actions.filterElement('');
    }
    handleAddElement(ebaseid){
    	const { actions } = this.props;
    	if($(".item").length===10) {
    		if(confirm("继续添加会影响页面性能，还要继续吗？")){
    			actions.onAddReactElement(ebaseid);
    		}
    	}else{
    		actions.onAddReactElement(ebaseid);
    	}
    }
    handleOnSearch(value){
        const { actions } = this.props;
        actions.filterElement(value);
    }
    render(){
        const { list, value } = this.props;
        let htmlArr = new Array;
        list.map((item)=>{
            if(value && item.title.toLowerCase().indexOf(value.toLowerCase()) == -1 && item.id.toLowerCase() !== value.toLowerCase()){
                return;
            }
            htmlArr.push(<div className="portal-setting-left-hpbaseelement-item" ><div style={{float:'left'}}><img src={item.icon}/></div><div><a href="javascript:void(0);" onMouseDown={dragJQuery.bind(this,item.id)} style={{marginLeft:'10px'}} onClick={this.handleAddElement.bind(this,item.id)}>{item.title}</a></div></div>);
        });
        return <div className="portal-setting-left-hpbaseelement">
            <SearchInput placeholder="输入关键词" type="contacts" onSearch={value => this.handleOnSearch(value)} style={{width:'100%',backgroundColor:'#e1e5eb',height:'28px'}} />
            {htmlArr}
        </div>
    }
}
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
            return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" }/>
        );
    }
}

HpBaseElement = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(HpBaseElement);
const mapStateToProps = state => {
    const { belist } = state;
    return ({
        value: belist.get("value")
    })
}
const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(BeListAction, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(HpBaseElement);

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
        this.props.onSearch(e.target.value);
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
             <div className="ant-input-group-wrap">
                 {/*<Button icon="search" style={{marginLeft:'5px',backgroundColor:'#e1e5eb'}} className={btnCls} size={size} onClick={this.handleSearch} />*/}
                 <Button  style={{marginLeft:'5px',border:'0px',backgroundColor:'#e1e5eb'}} className={btnCls} size={size} onClick={this.handleSearch} >
                    <Icon type='search' style= {{color:'#0161b2'}}></Icon></Button>
             </div>
          <Input style={{backgroundColor:'#e1e5eb',border:'0px',borderRadius:'0px',width:'70%'}} placeholder={placeholder} stylevalue={this.state.value} onChange={this.handleInputChange}
            onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch}
          />

        </InputGroup>
      </div>
        );
    },
});
