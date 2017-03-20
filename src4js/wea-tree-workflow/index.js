import Icon from '../_antd1.11.2/icon'
import Input from '../_antd1.11.2/input'
import Tree from '../_antd1.11.2/tree'
const TreeNode = Tree.TreeNode;

function getTreeDatas(url,params) {
    // console.log("url",url,"params",params);
    return new Promise(function(resolve) {
        fetch(url,{
            method:'get',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
            credentials: 'include',
            body:params
        }).then(function(response) {
            resolve(response.json());
            // console.log("response.json",response.json())
        }).catch(function(ex) {
            resolve([]);
            console.log('parsing failed', ex);
        });
    });
}

let count = 0;
let that = new Object();
export default class WeaTreeWorkflow extends React.Component {
    constructor(props) {
        super(props);
        const {dataUrl,prefix,topPrefix,defaultExpandedKeys,treeData} = props;
        this.state = {
            treeData: [],
            expandedKeys:defaultExpandedKeys,
            selectedKeys:[],
            treeData:treeData,
            defaultExpandedKeys:defaultExpandedKeys,
            checkedKeys: [],
        }
        that = this;
    }
    componentDidMount() {
        // console.log("componentDidMount");
        let _this = this;
        const{treeData} = this.state;
        // console.log('treeData',treeData);
        _this.setState({
            treeData:generateTreeNodes(treeData,null),
        });
       /* const {dataUrl,topPrefix} = this.props;
        let  _this = this;
        let keysArr = [];
        getTreeDatas(dataUrl).then(datas => {
            // console.log("componentDidMount:",datas);
            if(!!datas.result.rootCompany){
                //keysArr.push(`${topPrefix}0-${datas.result.rootCompany.id}`);//默认展开一级树节点
                // console.log('keysArr',keysArr);
                _this.setState({
                    treeData:generateTreeNodes(datas.result.rootCompany,null),
                    expandedKeys:keysArr,
                });
            }else{
                // console.log("datas.result",datas.result);
                _this.setState({
                    treeData:generateTreeNodes(datas.result,null),
                });
            }
        });*/
    }
    componentWillReceiveProps(nextProps) {
        // console.log("nextProps.componyParam",nextProps.componyParam);
        const {dataUrl,componyParam} = this.props;
        let  _this = this;
        if(componyParam && componyParam != nextProps.componyParam){//虚拟维度
            // count = 0;
            // console.log("count_componentWillReceiveProps",count);
            // getTreeDatas(dataUrl+'&'+nextProps.componyParam).then(datas => {
            //     // console.log("componentWillReceiveProps:",datas);
            //     let keysArr = [];
            //     datas.result.rootCompany.subOrgs.map(data=>{
            //         keysArr.push(data.id);
            //     });
            //     _this.setState({
            //         treeData:generateTreeNodes(datas.result.rootCompany,null),
            //         expandedKeys:keysArr,
            //     });
            //  });
            _this.setState({
                expandedKeys:nextProps.defaultExpandedKeys,
                treeData:generateTreeNodes(nextProps.treeData,null),
            });
        }
        // console.log('nextProps',nextProps);
        if(this.props.treeData !== nextProps.treeData){//初始树数据
            // console.log("componentWillReceiveProps=====treeData",nextProps.treeData);
            _this.setState({
                treeData:generateTreeNodes(nextProps.treeData,null),
            });
        }
        if(this.props.defaultExpandedKeys !== nextProps.defaultExpandedKeys){//初始展开的树节点
            // console.log("nextProps.defaultExpandedKeys",nextProps.defaultExpandedKeys);
            _this.setState({defaultExpandedKeys:nextProps.defaultExpandedKeys});
        }
        
    }
  
    onSelect(info,e) {
        // console.log('info',info,"e",e);
        const {isMult} = this.props;
        if(!isMult) {
            const nodes = e.selectedNodes;
            const type = e.node.props.type;
            const selectTreeKey = e.node.props.treeKey;
            this.setTheDatas(nodes,type,selectTreeKey);
        }
    }
    onCheck(checkedKeys,e) {
        // console.log("onCheck:",checkedKeys,e);
        this.setState({
          checkedKeys
        });
        const {isMult} = this.props;
        // console.log('isMult',isMult);
        if(isMult) {
            const nodes = e.checkedNodes;
            const type = e.node.props.type;
            const selectTreeKey = e.node.props.treeKey;
            // console.log(nodes,type,selectTreeKey)
            this.setTheDatas(nodes,type,checkedKeys);
        }
    }
    setTheDatas(nodes,type,selectTreeKey) {
        // console.log("selectTreeKey",selectTreeKey);
        // console.log("nodes",nodes,'type',type,'selectTreeKey',selectTreeKey);
        const {title,isMult} = this.props;
        let idArr = [];
        let nameArr = [];
        let keys = [];
        keys.push(selectTreeKey);

        for(let i=0;i<nodes.length;i++) {
            const node = nodes[i].props;
            if(title.indexOf("部门") === 0 && type.indexOf("2") === 0 && !isMult){//type==2是部门
                idArr.push(node.id);
                nameArr.push(node.name);
            }else if (title.indexOf("分部") === 0 && type.indexOf("1") === 0 && !isMult){//type==1是分部
                idArr.push(node.id);
                nameArr.push(node.name);
            }else if(title.indexOf('文档目录') === 0){
                idArr.push(node.id);
                nameArr.push(node.name);
            }else if(title.indexOf('城市') === 0 && type.indexOf('city')===0){
                idArr.push(node.id);
                nameArr.push(node.name);
            }else if(title.indexOf('行业') === 0){
                idArr.push(node.id);
                nameArr.push(node.name);
            }else if(title.indexOf("部门") === 0 && isMult){//部门多选
                idArr.push(node.id);
                nameArr.push(node.name);
            }else if (title.indexOf("分部") === 0 && type.indexOf("1") === 0 && isMult){//type==1是分部
                idArr.push(node.id);
                nameArr.push(node.name);
            }
            
        }
        // let newIdArr = [...new Set(idArr)];
        // let newNameArr = [...new Set(nameArr)];
        let newIdArr = [];
        let newNameArr = [];
        jQuery.each(idArr, function(i, el){
            if(jQuery.inArray(el, newIdArr) === -1) newIdArr.push(el);
        });
        jQuery.each(nameArr, function(i, el){
            if(jQuery.inArray(el, newNameArr) === -1) newNameArr.push(el);
        });

        let ids = newIdArr.join(",");
        let names = newNameArr.join(",");
        if(typeof this.props.setData === "function"){
            if(ids !== ""){
                // console.log("ids",ids,'names',names);
                this.props.setData(ids,names);
            }else{
                if(title.indexOf("部门") === 0 && type.indexOf("2") === 0){//type==2是部门
                    this.props.setData("","");
                }else if (title.indexOf("分部") === 0 && type.indexOf("1") === 0){//type==1是分门
                    this.props.setData("","");
                }else if(title.indexOf('文档目录') === 0){
                    this.props.setData("","");
                }else if(title.indexOf('城市') === 0 && type.indexOf('city') === 0){
                    this.props.setData("","");
                }else if(title.indexOf('行业') === 0){
                    this.props.setData("","");
                }
            }
        }
        this.setState({
            selectedKeys:keys,
        });
    }
    onLoadData(treeNode) {
        let  _this = this;
        // count++;
        const treeData = [...this.state.treeData];
        const {eventKey,treeKey,isVirtual,type,psubcompanyid,id} = treeNode.props;
    
        let params = `&type=${type}&id=${id}&isVirtual=${isVirtual}`;//（当前节点是部门的需要传递psubcompanyid）
        if(!!isVirtual){
            params = `&type=${type}&id=${id}&isVirtual=${isVirtual}`;//部门分部
        }else{
            params = `&type=${type}&id=${id}`;//文档目录、城市、行业浏览按钮
        }
        // if(treeData[0].type == "0" && count == 1 ){
        //     params = `&type=${treeData[0].type}&id=${treeData[0].id}&isVirtual=${treeData[0].isVirtual}&companyid=${treeData[0].companyid}`;
        // }

        return new Promise(resolve => {
            getTreeDatas(_this.props.asyncUrl+params).then(datas => {
                // console.log("datas",datas);
                getNewTreeData(treeData, treeKey, generateTreeNodes(datas,treeNode), 2);
                // console.log("treeData:",treeData);
                _this.setState({treeData});
                resolve();
            });
        });
    }
    onExpandChange(expandedKeys, nodeObj){
        this.setState({expandedKeys:expandedKeys})
    }
    render() {
        const {expandedKeys,ids,selectedKeys} = this.state;
        // console.log("selectedKeys",selectedKeys);
        const {checkable,browserTree,icon,isMult}=this.props;
        // console.log("this.state.treeData",this.state.treeData);
        // console.log('expandedKeys',expandedKeys);   
        const loop = data => data.map(item => {
            let title=null; 
            if(item.type == "0"){
                title = <div>{icon}{item.name}<span style={{fontSize:"12px",color:"#979797"}}>{/*人数占位*/}</span></div>;
            }else if(item.type == "2"){
                title = <div><i className="icon-mail-folder"/> {item.name}</div>;
            }else{
                title = <div><i className="icon-process-scene"/>{item.name}</div>;
            }
            if (item.children) {
                for(let i =0;i<item.children.length;i++){
                    item.children[i].treeKey = `${item.treeKey}-${item.children[i].id}`;
                    item.children[i].isParent ? (item.children[i].isLeaf = false) : (item.children[i].isLeaf = true);
                }
                return <TreeNode  browserTree={browserTree} 
                            isVirtual={item.isVirtual}
                            type={item.type} 
                            psubcompanyid={!!item.psubcompanyid ? item.psubcompanyid:''} 
                            title={title} name={item.name} 
                            key={item.treeKey} 
                            id={item.id} 
                            treeKey={item.treeKey}>
                        {loop(item.children)}
                        </TreeNode>
            }
            return <TreeNode  browserTree={browserTree} 
                        isVirtual={item.isVirtual}
                        type={item.type} 
                        psubcompanyid={!!item.psubcompanyid ? item.psubcompanyid:''} 
                        title={title} name={item.name} 
                        key={item.treeKey} 
                        id={item.id} 
                        treeKey={item.treeKey} 
                        isLeaf={item.isLeaf} 
                        />
        });
        const treeNodes = this.state.treeData.length && loop(this.state.treeData);
        // console.log("render_treeNodes",treeNodes);selectedKeys={["wt0-0-5-28"]} checkedKeys={ids}
        // console.log('defaultExpandedKeys',this.state.defaultExpandedKeys);
        // console.log('this.state.checkedKeys',this.state.checkedKeys);
        return (
            <Tree className="my-tree" 
                defaultExpandedKeys={this.state.defaultExpandedKeys}
                expandedKeys={this.state.expandedKeys}
                onExpand={this.onExpandChange.bind(this)} 
                onSelect={this.onSelect.bind(this)} 
                onCheck={this.onCheck.bind(this)} 
                loadData={this.onLoadData.bind(this)}  
                checkable={isMult} 
                checkedKeys={this.state.checkedKeys}
                multiple={isMult} 
                selectedKeys={selectedKeys}>
            {treeNodes}
            </Tree>
        )
    }
};

function generateTreeNodes(data,treeNode) {
    let datas = data;
    if(!data.length){
        datas = new Array(datas);
    }
    // console.log("datas",datas,'treeNode',treeNode);
    let arr = new Array();
    const {topPrefix,prefix} = that.props;
    // console.log('topPrefix',topPrefix,'prefix',prefix);
    if(!treeNode){
        for (let i=0;i<datas.length;i++) {
            const data = datas[i];
            arr.push({
                id:data.id,
                name:data.name,  
                treeKey:`${topPrefix}0-${data.id}`,
                isParent:data.isParent,
                isLeaf:data.isParent ? false : true,
                isVirtual:data.isVirtual,
                type:data.type,
                companyid:data.companyid,
                children:data.subOrgs,
            });
        }
    }else{
        const loop = datas =>{
            for (let i=0;i<datas.length;i++) {
                const data = datas[i];
                const {treeKey,id} = treeNode.props;
                arr.push({ 
                    id:data.id,
                    name: data.name, 
                    treeKey:`${treeKey}-${data.id}`,
                    isParent:data.isParent,
                    isLeaf:data.isParent ? false : true,
                    isVirtual:data.isVirtual,
                    type:data.type,
                });
            }
        }
        loop(datas[0].result);
    }
    // console.log('arr',arr);
    return arr;
}

function getNewTreeData(treeData, curKey, child, level) {
    // console.log("treeData, curKey, child, level",treeData, curKey, child, level);
    const loop = data => {
        // if (level < 1 || curKey.length - 3 > level * 2) return;
        data.forEach((item) => {
            //console.log(curKey.indexOf(item.treeKey) === 0);
            if ((curKey+"-").indexOf(item.treeKey+"-") === 0) {
                // console.log("curKey",curKey,item.treeKey);
            //if (curKey.indexOf(item.treeKey) === 0) {
                if (item.children) {
                    loop(item.children);
                } else {
                    item.children = child;
                }
            }
        });
    };
    loop(treeData);
}



