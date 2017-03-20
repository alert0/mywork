import Tree from '../_antd1.11.2/Tree';
import Row from '../_antd1.11.2/Row';
import Col from '../_antd1.11.2/Col';
import Modal from '../_antd1.11.2/Modal';
import Tooltip from '../_antd1.11.2/Tooltip';
import Tabs from '../_antd1.11.2/Tabs';
import Table from '../_antd1.11.2/Table';
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
import Select from '../_antd1.11.2/Select';
const Option = Select.Option;
import Menu from '../_antd1.11.2/menu';
import Button from '../_antd1.11.2/Button';
import Spin from '../_antd1.11.2/Spin';
import Input from '../_antd1.11.2/Input';
import WeaInputFocus from '../wea-input-focus';
import WeaScroll from '../wea-scroll';
import cloneDeep from 'lodash/cloneDeep';
import WeaWorkflowListRadio from '../wea-workflow-list-radio';
import WeaWorkflowTreeRadio from '../wea-workflow-tree-radio';
import WeaAssociativeSearch from '../wea-associative-search';
import isEmpty from 'lodash/isEmpty'


export default class WeaWorkflowRadio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            loading: true,
            showDrop: false,
            record:new Object(),
            id:"",
            name:'',
            resetSearch: false,
            isClearData: false,
            resetValue:'',
            idCache: '',
            nameChache: '',
            hasSearchValue:false,

        }
    }
    initialState =()=> {
        this.setState({
            hasSearchValue:!this.state.hasSearchValue,
        });
        
    }
    componentDidMount(){
    	const {value, showName} = this.props;
    	if(!isEmpty(value) && showName){
    		this.setState({id: value, name: showName});
    	}
    }
    componentWillReceiveProps(nextProps,nextState) {
        if (this.props.value !== nextProps.value && isEmpty(nextProps.value)) {
            this.setState({id: '', name: '', isClearData: !this.state.isClearData});
        }
        if(this.props.value !== nextProps.value && !isEmpty(nextProps.value) && nextProps.showName){//form value改变&&有值
            this.setState({id:nextProps.value, name:nextProps.showName});
        }
    }

     // shouldComponentUpdate(nextProps, nextState){
     //    console.log('nextProps',nextProps,'nextState',nextState);
     //    if(this.state.id !== nextState.id){
     //        console.log('shouldComponentUpdate')
     //     }
     // }
    showModal() {
        this.setState({
            visible: true
        });
    }
    handleOk() {
        const {id,name,idCache,nameChache} = this.state;
        this.setState({
            id:idCache,
            name:nameChache,
            visible: false,
        });
        if (typeof this.props.onChange === "function") {
            // console.log("id",id,"name",name);
            idCache != "" ? this.props.onChange(idCache): this.props.onChange("");
        }
    }
    handleCancel() {
        this.setState({
            visible: false,
            resetSearch: !this.state.resetSearch,   
        });
    }
    handleClear() {
        this.setState({
            visible: false,
            id: "",
            name: "",
            isClearData: !this.state.isClearData,
        });
        if (typeof this.props.onChange === "function") {    
            this.props.onChange("");
        }
    }
    associateSearch = (v)=>{
        // console.log('initialState',initialState);
        this.initialState();//初始化浏览框
        this.showModal();
        // console.log(v);
    }
    selectedSearch = (id,name)=>{
        // console.log('selectedSearch',id,name);
        this.throwCurrentState(id,name);
    }
    render() {
        // console.log('wea-workflow-radio====resetValue',this.state.resetValue);
        // console.log("this.state.listDatas",this.state.listDatas);
        // console.log("this.state.record",this.state.record);
        const {icon,iconBgcolor,title,topPrefix,prefix,listUrl,asyncUrl,countUrl,dataUrl,
                otherPara,dataKey,ifCheck,isMult,contentType,value,type}  = this.props;
        const {showDrop,activeKey,listDatas,listColumns,id,name,visible,} = this.state;
        // console.log('render==',value,this.props);
        let titleEle = (
            <Row>
                <Col span="8" style={{paddingLeft:20,lineHeight:'48px'}}>
                    <div className="wea-workflow-radio-title">
                        {iconBgcolor ?
                        <div className="wea-workflow-radio-icon-circle" style={{background:iconBgcolor ? iconBgcolor : ""}}>
                            {icon}
                        </div>
                        : <span style={{verticalAlign:'middle',marginRight:10}}>
                        {icon}
                        </span>}
                        <span style={{verticalAlign:'middle'}}>{title}</span>
                    </div>
                </Col>
            </Row>
        );
        let inputArr = (
            <div className="ant-search-custom">
                <Input key="theInput"  addonAfter={<div style={{ "cursor": "pointer" }}>
                    <i onClick={this.showModal.bind(this) } className="anticon anticon-search" ></i>
                </div>} value={typeof value === 'undefined' ? '' : name} />
            </div>
        );
        if(!!type){
            // console.log("进入联想组件");//isClearData={!value}
            // console.log('id',id);
            inputArr = (<WeaAssociativeSearch
                            isClearData={this.state.isClearData}
                            reset={this.state.resetSearch}
                            type={type}
                            value={value}
                            ids={id}
                            names={name}
                            clickCallback={this.associateSearch}
                            onChange={this.selectedSearch}
                        />);
        }
        /*if (typeof id !== '') {
            inputArr = (<Tooltip title={typeof value === 'undefined' || value === '' ? '' : name}>{inputArr}</Tooltip>)
        };*/

        let tablePan = null;
        if(!contentType){tablePan = "list"}
        let isList = contentType.indexOf("list") >= 0;
        let isTree = contentType.indexOf("tree") >= 0;
        if (isList) {
            tablePan = (
                <WeaWorkflowListRadio
                    title={title}
                    dataUrl={dataUrl}
                    otherPara={otherPara}
                    setData={this.setListData.bind(this)}
                    resetValue={this.state.hasSearchValue}
                    handleClear={this.handleClear.bind(this)}
                    handleCancel={this.handleCancel.bind(this)}
                    {...this.props}
                    />
            )
        }else if(isTree){
            tablePan = (
                <WeaWorkflowTreeRadio
                    title={title}
                    topPrefix={topPrefix}
                    prefix={prefix}
                    dataUrl={dataUrl}
                    dataKey={dataKey}
                    otherPara={otherPara}
                    asyncUrl={asyncUrl}
                    ifCheck={ifCheck}
                    isMult={isMult}
                    setData={this.setTreeData.bind(this)}
                    handleOk={this.handleOk.bind(this)}
                    handleClear={this.handleClear.bind(this)}
                    handleCancel={this.handleCancel.bind(this)}
                    {...this.props}
                    />
            )
        }
        return (
            <div>
               {inputArr}
               <input type="hidden" id={this.props.id} name={name} value={id} />
               <Modal
                  wrapClassName="wea-workflow-radio"
                  title={titleEle} style={{height:"579px"}}
                  width={630}
                  maskClosable={false}
                  visible={visible}
                  onCancel={this.handleCancel.bind(this)}
                  footer= {[
                        isTree && <Button key="submit" type="primary" size="large"  onClick={this.handleOk.bind(this)}>
                          确 定
                        </Button>,
                        <Button key="clear" type={isTree?"ghost":"primary"} size="large" onClick={this.handleClear.bind(this)}>清 除</Button>,
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel.bind(this)}>取 消</Button>,
                        ]
                    }
                >
                {tablePan}
               </Modal>
            </div>
        )
    }
    throwCurrentState(id,name){
        if (typeof this.props.onChange === "function") {
            if('showName' in this.props){
                this.props.onChange(id ? `${id}_@_${name}` : '');
            }else{
                this.props.onChange(id ? id : '');
            }
        }
        if(typeof this.props.getShowName === "function"){
            this.props.getShowName(id ? name : '');
        }
    }
    setListData(id,name){
        // console.log("isTree",isTree,'id',id,'name',name);
        this.throwCurrentState(id,name);
        this.setState({
            id,
            name,
            visible:false,
        });
    }
    setTreeData(id,name){
        // console.log("isTree",isTree,'id',id,'name',name);
        this.throwCurrentState(id,name);
        this.setState({
            idCache:id,
            nameChache:name,
        });
    }
}

