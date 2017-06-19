import {is} from 'immutable'
import debounce from 'lodash/debounce'
import trim from 'lodash/trim'
import objectAssign from 'object-assign'
import {WeaBrowser,WeaDatePicker,WeaTimePicker,WeaUpload,WeaSelectCtrl} from 'ecCom'
import {Row, Col, Button, Icon, Upload, DatePicker, TimePicker} from 'antd'
import WeaSystemField from '../../cloudComponents/wea-system-field/index'
import WeaInputCtrl from '../../cloudComponents/wea-input-ctrl/index'
import WeaWfCode from '../../cloudComponents/wea-wfcode/index'
import WeaCheckboxCtrl from '../../cloudComponents/wea-checkbox-ctrl/index'
import WeaTextareaCtrl from '../../cloudComponents/wea-input-mult/index'

class FieldContent extends React.Component {
    shouldComponentUpdate(nextProps) {
		return this.props.symbol !== nextProps.symbol 
            || this.props.rowIndex !== nextProps.rowIndex
            || !is(this.props.fieldValueObj, nextProps.fieldValueObj)
            || !is(this.props.dependValueObj, nextProps.dependValueObj)
            || !is(this.props.fieldVar, nextProps.fieldVar)
            || !is(this.props.cellObj, nextProps.cellObj)
            || this.props.isDetailExistField !== nextProps.isDetailExistField
            || (this.props.cellObj.get("field") === "-4" && !is(this.props.params, nextProps.params))      //只有表单签字意见信息才会更改params
            || this.props.conf.size !== nextProps.conf.size;
	}
    getFieldMark(){
        const {symbol,cellObj,rowIndex} = this.props;
        const fieldid = cellObj.get("field").toString();
        return symbol.indexOf("detail_")>-1 ? `field${fieldid}_${rowIndex}` : `field${fieldid}`;
    }
	doChangeEvent(value){
		const valueInfo = { value: value || ''};
		this.props.actions.changeSingleFieldValue(this.getFieldMark(), valueInfo);
	}
	doBrowChangeEvent(ids,names,datas){
		const valueInfo = { value: ids || '',specialobj:datas||[]};
		this.props.actions.changeSingleFieldValue(this.getFieldMark(), valueInfo);
	}
	fileChangeEvent(idsT,idsB){
		const {symbol,cellObj,conf} = this.props;
		const isDetail = symbol.indexOf("detail_")>-1;
		const fieldvalue  = idsT.concat(idsB).join(',');
		console.log("fileChangeEvent - idsT",idsT,"idsB",idsB,this.getFieldMark(),"isDetail",isDetail);
		if(isDetail){
			const fieldid = cellObj.get("field").toString();
			const fieldObj = conf.getIn(["tableInfo", symbol, "fieldinfomap", fieldid]);
			const detailtype = fieldObj.get("detailtype")||0;
			this.props.actions.getUploadFileInfo(fieldvalue,detailtype,this.getFieldMark());
		}else{
			this.props.actions.changeSingleFieldValue(this.getFieldMark(), {value:fieldvalue});
		}
	}
	
	onUploading(type){
		this.props.actions.changeSingleFieldValue(this.getFieldMark(), null,{"fileUploadStatus":type});
	}
	
    dateChangeEvent(value,dateString){
    	const valueInfo = { value: dateString };
		this.props.actions.changeSingleFieldValue(this.getFieldMark(), valueInfo);
    }
    render() {
        const {actions,conf,params,symbol,rowIndex,cellObj,fieldValueObj,dependValueObj,fieldVar,isDetailExistField} = this.props;
        const fieldid = cellObj.get("field").toString();
        const isDetail = symbol.indexOf("detail_")>-1;
        const tableMark = isDetail ? symbol : "main";
        const viewOnly = parseInt(params.get("isviewonly") || 0);
        const isaffirmance = parseInt(params.get("isaffirmance") || 0);     //提交待确认
        let fieldValue = fieldValueObj && fieldValueObj.has("value") ? fieldValueObj.get("value").toString() : "";
        if(!conf.hasIn(["tableInfo", tableMark, "fieldinfomap", fieldid]))  //模板字段被删除情况
            return <span></span>;
        const fieldObj = conf.getIn(["tableInfo", tableMark, "fieldinfomap", fieldid]);
        //console.log("fieldid--",fieldid, "rowIndex--",rowIndex,"fieldValue--",fieldValue,"fieldObj---",fieldObj.toJS());
        const htmltype = fieldObj.get("htmltype")||0;
        const detailtype = fieldObj.get("detailtype")||0;
        const fieldName  = isDetail ? ('field'+fieldid+'_'+rowIndex) : ('field'+fieldid);
        //字段的只读、必填属性
        let viewAttr = parseInt(fieldObj.get("viewattr")||0);     //默认的字段属性
        if(viewAttr === 0)
            return <span style={{display:"none"}}>Field viewAttr is Hidden,Exist Exception!</span>;
        if(fieldVar && fieldVar.has("viewAttr")){    //显示属性联动改变的字段属性
            const changeViewAttr = fieldVar.get("viewAttr");
            if(changeViewAttr === 1)
                viewAttr = 2;
            else if(changeViewAttr === 2)
                viewAttr = 3;
            else if(changeViewAttr === 3)
                viewAttr = 1;
        }
        if(viewAttr === 2 || viewAttr === 3){
            //已办、不允许修改已有明细情况
            if(viewOnly === 1 || isaffirmance === 1 || (isDetailExistField && conf.getIn(["tableInfo",symbol,"detailtableattr","isedit"]) !== 1))  
                viewAttr = 1;
        }
       	const baseProps = {};
        baseProps.isDetail = isDetail;
        baseProps.value = fieldValue;
        baseProps.detailtype = detailtype;
        baseProps.fieldName  = fieldName;
        baseProps.viewAttr  = viewAttr;
        baseProps.fieldid = fieldid;
        baseProps.fieldlabel = fieldObj && fieldObj.get("fieldlabel");
        baseProps.rowIndex = rowIndex;
        let fieldStyle = {};
        baseProps.style = fieldStyle;
        if(fieldVar && fieldVar.get("promptRequired") === true){
            //再次判断viewAttr及字段值，提示必填后输入值/联动情况下取消提示
            //if(fieldValue === "" || (fieldid === "-1" && jQuery.trim(fieldValue) === ""))         
            baseProps.defaultFocus = true;
        }
        //console.log("baseProps",baseProps);
        if(parseInt(fieldid) < 0){      //系统字段
            const markInfo = params.get("markInfo");
            const requestType = params.get("requestType");
            return (
                <WeaSystemField requestType={requestType} 
                				markInfo={markInfo} 
                				onChange={this.doChangeEvent.bind(this)}
                				{...baseProps}/>
            )
        }else if(htmltype === 1){
            //判断是否为流程编号
            const codeInfo = conf.get("codeInfo");
            const isUse = codeInfo && codeInfo.get("isUse");
            const fieldCode = codeInfo && codeInfo.get("fieldCode");
            const relateCodeFields = codeInfo && codeInfo.get("codeFields");
            const hasHistoryCode = codeInfo && codeInfo.get("hasHistoryCode");
            if(isUse && fieldCode === fieldid){
                const relateFieldValues = this.getCodeRelateFieldValues(relateCodeFields);
                return <WeaWfCode actions={actions}
                            relateFieldValues={relateFieldValues}
                            hasHistoryCode={hasHistoryCode} 
                            {...baseProps}
                            iscreate={params.get("iscreate")}
                            onChange={this.doChangeEvent.bind(this)}
                        />
            }
            const qfws = fieldObj.get("qfws");
            const length = fieldObj.get("length");
            let format = cellObj.has("format") ? cellObj.get("format").toJS():{};
            const transtype = parseInt(conf.getIn(["linkageCfg", "transTypeCfg", fieldid]) || 0);   //字段赋值转格式，模拟用格式化实现
            if(transtype === 1){    //转金额大写
                format = {numberType:101}; 
            }else if(transtype === 2){      //转金额千分位，模拟数值格式化
                format = {numberType:2,decimals:qfws,formatPattern:2,thousands:1};
            }
            if(cellObj.has("financial")){      //财务格式优先级最高
                const financial = cellObj.get("financial");
                if(financial.indexOf("2-") > -1){
                    const finaNum = parseInt(financial.split("-")[1] || "3");
                    format = {numberType:100,finaNum:finaNum}; 
                }else if(financial === "3"){        //转金额大写
                    format = {numberType:101}; 
                }else if(financial === "4"){        //转金额千分位，模拟数值格式化两位
                    format = {numberType:2,decimals:2,formatPattern:2,thousands:1};
                }
            }
            fieldStyle["height"] = "100%";
            return(
                <WeaInputCtrl length={length} 
                            qfws={qfws} 
                            onChange={this.doChangeEvent.bind(this)}
                            format={format}
                            {...baseProps}
                    />
            );
        }else if(htmltype === 2){
            const textheight = fieldObj ? fieldObj.get('textheight') : 4;
            const length = fieldObj ? fieldObj.get('length') : 4000;
            return( <WeaTextareaCtrl textheight = { textheight } 
	                             length = { length } 
	                             onChange = {this.doChangeEvent.bind(this)}
	                             {...baseProps}
                    />
            )
        }else if(htmltype === 3){
            const browInfo = this.getBrowserInfo(fieldObj);
            let specialobj  = fieldValueObj && fieldValueObj.has("specialobj") ? fieldValueObj.get("specialobj").toJS():[];
            const linkUrl = browInfo && browInfo.get('linkUrl');
            const browserProp  = browInfo ? browInfo.toJS() : {};
            browserProp.viewAttr = viewAttr;
            browserProp.isDetail = isDetail;
            browserProp.type = detailtype;
            browserProp.value= fieldValue;
            browserProp.replaceDatas = specialobj;
            if(detailtype == 162 || detailtype == 257){
            	browserProp.isSingle = false;
            	browserProp.isMultCheckbox = true;
            }
            const relateFieldid = fieldObj && fieldObj.getIn(["browserattr","relateFieldid"]);
            if(relateFieldid){
           		let tempConditionDataParams = browserProp.conditionDataParams||{};
           		browserProp.conditionDataParams = objectAssign({},this.getBrowserDataDefinition(relateFieldid),tempConditionDataParams);
            }
            let el;
            if(detailtype === 2){
                el = <WeaDatePicker {...baseProps} layout={jQuery('.wea-popover-hrm-relative-parent')[0]} onChange={this.doChangeEvent.bind(this)} format="yyyy-MM-dd"/>
            }else if(detailtype === 19){
                el = <WeaTimePicker {...baseProps} layout={jQuery('.wea-popover-hrm-relative-parent')[0]} onChange={this.doChangeEvent.bind(this)} format="HH:mm"/> 
            }else if(detailtype === 118 || detailtype === 124 || detailtype === 125 || detailtype === 126){
                //只读，特殊字段处理： 空会议室使用情况、计划、目标、报告
                let valueSpan = '';
                specialobj.map(o=>{
                    if(linkUrl){
                        valueSpan = valueSpan + `<a href='${linkUrl}${o.id}' target='_new'>${o.name||o.lastname}</a> `
                    }else{
                        valueSpan = valueSpan + o.name + ' ';
                    }
                });
                if(detailtype === 118){
                    valueSpan =  <a href='/meeting/report/MeetingRoomPlan.jsp' target='blank'>{specialobj[0].name}</a>
                }
                el =  (
                    <div>
                        <span dangerouslySetInnerHTML={{__html: valueSpan}}></span>
                        <input type='hidden' name={fieldName} id={fieldName} value={fieldValue}/>
                    </div>
                )
            }else{
                el = <WeaBrowser fieldName={fieldName} 
                        {...browserProp}
                        selectSize='default'
                        onChange={this.doBrowChangeEvent.bind(this)}
                        resize={viewAttr !== 1} />
            }
            return el;
        }else if(htmltype === 4){
            if(fieldValue === "")     fieldValue = "0";
            return <WeaCheckboxCtrl {...baseProps} value={fieldValue} onChange={this.doChangeEvent.bind(this)} />
        }else if(htmltype === 5){
            const optionRange = fieldVar && fieldVar.has("optionRange") ? fieldVar.get("optionRange") : null;
            let options = [];
            if(detailtype === 0 || detailtype === 1)    //下拉选择框才需要空选项
                options.push({ 'key': '', 'showname': '' });
            const itemList = fieldObj.getIn(['selectattr', 'selectitemlist']);
            itemList && itemList.map(item => {
                const selectvalue = item.get('selectvalue').toString();		//必须转字符串
                if(item.get("cancel") === 1 && (viewAttr === 2 || viewAttr === 3))
                    return true;
                if(optionRange !== null && !optionRange.includes(selectvalue))	//选择框联动控制范围
                    return true;
                options.push({ 'key': selectvalue, 'showname': item.get('selectname') });
            });
            const fieldshowtypes = fieldObj.getIn(['selectattr','fieldshowtypes']);
            
            baseProps.options = options;
            baseProps.fieldshowtypes = fieldshowtypes;
            baseProps.style = {'min-width':'100px'};
            baseProps.layout = jQuery('.wea-popover-hrm-relative-parent')[0];
            
            return(
                <WeaSelectCtrl  {...baseProps} onChange={this.doChangeEvent.bind(this)}/> 
            )
        }else if(htmltype === 6){
            const specialobj = fieldValueObj && fieldValueObj.get("specialobj");
            const filedatas = specialobj && specialobj.get("filedatas");
            const fileattr = fieldObj && fieldObj.get('fileattr').toJS();
            const datas  = specialobj && specialobj.get('filedatas').toJS();
            const showBatchLoad = specialobj && specialobj.get('showBatchLoad');
            //计算目录
            let category = '';
            //catelogType = 0:固定目录 1：选择目录
            let {catelogType,docCategory,selectedCateLog}  = fileattr;
            if(catelogType === 0 && trim(docCategory).length > 0){
                category = trim(docCategory);
            }else{
                const selectedCatalog = this.getFileSelectedCatalog();
                category = selectedCatalog && selectedCatalog.docCategory;
            }
            const workflowid  = params.get("workflowid");
            let uploadUrl = `/api/workflow/reqform/docUpload?category=${category}&workflowid=${workflowid}`;
            //计算附件是上传目录
            
            baseProps.showBatchLoad = isDetail ? false:showBatchLoad;
            baseProps.uploadUrl = uploadUrl;
            baseProps.maxUploadSize = 10;
            baseProps.category = category;
            baseProps.datas = datas;
            baseProps.btnSize = isDetail ? "small":"default";
            baseProps.autoUpload = isDetail;
            baseProps.listType = detailtype === 2 ? "img":"list";
            
            if(showBatchLoad && !isDetail){
				const requestid  = params.get("requestid");
            	let batchDowloadUrl  = "/weaver/weaver.file.FileDownload?fieldvalue="+fieldValue+"&download=1&downloadBatch=1&desrequestid=0&reqeustid="+requestid;
            	baseProps.batchDowloadUrl = batchDowloadUrl;
            }
            //console.log("baseProps",baseProps,"fileattr",fileattr);
            return(
            	<WeaUpload ref={fieldName} {...objectAssign({},baseProps,fileattr)} onChange={this.fileChangeEvent.bind(this)} onUploading={this.onUploading.bind(this)}/>
            )
        }else if(htmltype === 7){
            if(detailtype === 1){
                const displayname = fieldObj&&fieldObj.get("specialattr") ? fieldObj.getIn(["specialattr","displayname"]) : "";
                const linkaddress = fieldObj&&fieldObj.get("specialattr") ? fieldObj.getIn(["specialattr","linkaddress"]) : "";
                return <a href={linkaddress} target="_blank" dangerouslySetInnerHTML={{__html: displayname}}></a>
            }else if(detailtype === 0 || detailtype === 2){   //老表单有type为0的描述性文字
                const descriptivetext = fieldObj&&fieldObj.get("specialattr") ? fieldObj.getIn(["specialattr","descriptivetext"]) : "";
                return <span dangerouslySetInnerHTML={{__html:descriptivetext}}></span>;
            }
        }else if(htmltype === 8){
            
        }else if(htmltype === 9){

        }
        return <span>No Support</span>
    }
    //获取流程编号字段相关字段信息
    getCodeRelateFieldValues(relateCodeFields){
        const {dependValueObj} = this.props;
        const relateFieldValues = {};
        relateCodeFields && relateCodeFields.map(field =>{
            const relateFieldid = `field${field.split("_")[0]}`;
            const relateFieldValue = dependValueObj && dependValueObj.getIn([relateFieldid, "value"]);
            relateFieldValues[relateFieldid] = relateFieldValue;
        });
        return relateFieldValues;
    }
    //获取附件字段对应的选择框目录信息
    getFileSelectedCatalog(){
        const {symbol,conf,cellObj,dependValueObj} = this.props;
        const tableMark = symbol.indexOf("detail_") > -1 ? symbol : "main";
        const fileFieldid = cellObj.get("field").toString();
        const fileattr = conf.getIn(["tableInfo", tableMark, "fieldinfomap", fileFieldid, "fileattr"]);
        if(!fileattr || fileattr.get("catelogType") !== 1 || !fileattr.has("selectedCateLog"))      //附件字段非选择框控制目录
            return {};
        const selectedFieldid = fileattr.get("selectedCateLog");
        const selectedFieldValue = dependValueObj && dependValueObj.getIn([`field${selectedFieldid}`, "value"]);
        let selectedCatalog = {};
        if(selectedFieldid !== "" && selectedFieldValue != null && selectedFieldValue !==""){
            conf.getIn(["tableInfo", "main", "fieldinfomap", selectedFieldid, "selectattr", "selectitemlist"]).map(v =>{
                if(v && v.get("selectvalue").toString() === selectedFieldValue.toString()){
                    selectedCatalog = {docCategory:v.get("docCategory"), maxUploadSize:v.get("maxUploadSize")};
                }
            });
        }
        return selectedCatalog;
    }
    //浏览数据定义获取表单字段数据
    getBrowserDataDefinition(relateFields){
    	const {dependValueObj} = this.props;
    	let relateFieldValue = {};
    	relateFields && relateFields.map(field=>{
    		const fieldid = field.split("_")[0];
            const dependFieldValue = dependValueObj && dependValueObj.getIn([`field${fieldid}`, "value"]);
            relateFieldValue["field"+fieldid] = dependFieldValue || "";
    	});
    	return relateFieldValue;
    }
    
    //获取浏览框相关的表单字段值
    getBrowserInfo(fieldObj){
        if(!fieldObj)
            return null;
        const {symbol,conf,dependValueObj} = this.props;
        const isCusBrow = (fieldObj.get("detailtype") === 161 || fieldObj.get("detailtype") ===162);
        const browKey = isCusBrow ? fieldObj.get("fielddbtype") : fieldObj.get("detailtype").toString();
        let browInfo = conf.getIn(["browserInfo", browKey]);
        let relateFieldValue = {};
        browInfo && browInfo.get("relateFieldid") && browInfo.get("relateFieldid").map(field =>{
            const fieldid = field.split("_")[0];
            const isDetail = field.split("_")[1] === "1";
            const tableMark = isDetail ? symbol : "main";
            let key = conf.getIn(["tableInfo", tableMark, "fieldinfomap", fieldid, "fieldname"]);
            if(key){
                if(isDetail)
                    key = conf.getIn(["tableInfo", tableMark, "tablename"])+"_"+key;
                const dependFieldValue = dependValueObj ? dependValueObj.getIn([`field${fieldid}`, "value"]):"";
                //避免参数重复
                if(isCusBrow){ 
                	relateFieldValue[key+"_"+browInfo.getIn(['dataParams','currenttime'])] = dependFieldValue||"";
                }else{
                	relateFieldValue[key] = dependFieldValue||"";
                }
            }
        });
        //console.log("browInfo",browInfo.toJS(), "relateFieldValue",relateFieldValue);
        if(browInfo){
            browInfo = browInfo.update("dataParams", val=>{
                return val && val.merge(relateFieldValue);
            })
        }
        return browInfo;
    }
}

export default FieldContent