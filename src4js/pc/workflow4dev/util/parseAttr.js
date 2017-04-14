export const getCellAttr = (cellObj,colCusAttr,rowHeight) =>{
    let cellAttr = {};
    let styleObj = {};
    let innerStyleObj = {};

    //单元格边框
    appendBorder(cellObj, styleObj);
    //单元格样式
    appendStyle(cellObj, styleObj, innerStyleObj, false);
    const financial = cellObj && cellObj.get("financial");
    //财务格式所在单元格div增加高度100%
    if(financial && (financial.indexOf("1-")>-1 || financial.indexOf("2-")>-1)){
        styleObj["height"] = rowHeight + "px";
        innerStyleObj["height"] = "100%";
    }
    //列自定义属性
    if(colCusAttr && colCusAttr.get("hide")==="y")
        styleObj["display"] = "none";
    if(colCusAttr && colCusAttr.get("class"))
        cellAttr.tdClass = colCusAttr.get("class");
    //单元格自定义属性
    const cusattrs = cellObj.get("attrs");
    cusattrs && appendCusAttrObj(cellAttr, cusattrs, innerStyleObj);
    
    cellAttr.styleObj = styleObj;
    cellAttr.innerStyleObj = innerStyleObj;
    return cellAttr;
}

export const getMcCellAttr = (cellObj) =>{
    let mcCellAttr = {};
    let styleObj = {};
    let innerStyleObj = {};

    //单元格样式
    appendStyle(cellObj, styleObj, innerStyleObj, true);
    for(var key in styleObj){
        if(key !== "text-align" && key != "vertical-align")
            innerStyleObj[key] = styleObj[key];
    }
    //自定义属性
    const cusattrs = cellObj.get("attrs");
    cusattrs && appendCusAttrObj(mcCellAttr, cusattrs, innerStyleObj);

    mcCellAttr.innerStyleObj = innerStyleObj;
    return mcCellAttr;
}

export const getRowAttr = (rowHeight, rowCusAttr) =>{
    let rowAttr = {};
    rowAttr.id = rowCusAttr ? rowCusAttr.get("id") : "";
    rowAttr.name = rowCusAttr ? rowCusAttr.get("name") : "";
    rowAttr.trClass = rowCusAttr ? rowCusAttr.get("class") : "";
    let styleObj = {};
    styleObj["height"] = rowHeight;
    if(rowCusAttr && rowCusAttr.get("hide")==="y")
        styleObj["display"] = "none";
    if(rowCusAttr && rowCusAttr.get("style"))
        appendCusAttrStyle(styleObj, rowCusAttr.get("style"));
    rowAttr.styleObj = styleObj;
    return rowAttr;
}


const appendBorder = (cellObj, styleObj)=>{
    const eBorder = cellObj.get("eborder");
    const etype = cellObj && cellObj.get("etype");
    eBorder && eBorder.map((v,k)=>{
        const kind = v.get("kind");
        if(etype === "7" && (kind === "top" || kind === "bottom"))  //明细所在区域不解析上下边框
            return true;
        if(v.get("color"))
            styleObj["border-"+kind+"-color"] = v.get("color");
        const borderstyle = v.get("style") ? parseInt(v.get("style")) : 0;
        if(borderstyle === 0){
        }else if(borderstyle === 2){
            styleObj["border-"+kind+"-width"] = "2px";
            styleObj["border-"+kind+"-style"] = "solid";
        }else if(borderstyle === 3){
            styleObj["border-"+kind+"-width"] = "1px";
            styleObj["border-"+kind+"-style"] = "dashed";
        }else if(borderstyle === 5){
            styleObj["border-"+kind+"-width"] = "3px";
            styleObj["border-"+kind+"-style"] = "solid";
        }else if(borderstyle === 6){
            styleObj["border-"+kind+"-width"] = "3px";
            styleObj["border-"+kind+"-style"] = "double";
        }else if(borderstyle === 7){
            styleObj["border-"+kind+"-width"] = "1px";
            styleObj["border-"+kind+"-style"] = "dotted";
        }else if(borderstyle === 8){
            styleObj["border-"+kind+"-width"] = "2px";
            styleObj["border-"+kind+"-style"] = "dashed";
        }else{
            styleObj["border-"+kind+"-width"] = "1px";
            styleObj["border-"+kind+"-style"] = "solid";
        }
    })
    return styleObj;
}

const appendStyle = (cellObj, styleObj, innerStyleObj, isMc) => {
    const etype = cellObj && cellObj.get("etype");
    if(etype === "7" || etype === "12")
        return;
    //背景色
    if(cellObj.get("backgroundColor"))
        styleObj["backgroundColor"] = cellObj.get("backgroundColor");
    //单元格图片
    if(etype === "6"){
        styleObj["backgroundImage"] = "url('"+cellObj.get("field")+"') !important";
        styleObj["backgroundRepeat"] = "no-repeat !important";
    }
    const font = cellObj.get("font");
    if(font) {
        font.map((v,k)=>{
            if(v === "")
                return true;
            if(k === "text-align")
                styleObj["text-align"] = v;
            else if(k === "valign")
                styleObj["vertical-align"] = v;
            else if(k === "bold") {
                if(v === "true")
                    innerStyleObj["font-weight"] = "bold";
            }else if(k === "italic"){
                if(v === "true")
                    innerStyleObj["font-style"] = "italic";
            }else if(k === "underline"){
                if(v === "true")
                    innerStyleObj["text-decoration"] = "underline";
            }else if(k === "deleteline"){
                if(v === "true")
                    innerStyleObj["text-decoration"] = "line-through";
            }else if(k === "font-size") {
                innerStyleObj["font-size"] = v;
            }else if(k === "color") {
                innerStyleObj["color"] = v;
            }else if(k === "font-family") {
                innerStyleObj["font-family"] = v;
            }
        });
    }
    //默认样式
    if(!styleObj["text-align"])     styleObj["text-align"] = "left";
    if(!styleObj["vertical-align"])  styleObj["vertical-align"] = isMc?"middle":"top";
    if(!innerStyleObj["font-size"])  innerStyleObj["font-size"] = "9pt";
    if(!innerStyleObj["font-family"])    innerStyleObj["font-family"] = "Microsoft YaHei";
    //缩进
    let etxtindent = cellObj.get("etxtindent");
    if(etxtindent && etxtindent !== "0"){
        etxtindent = parseFloat(etxtindent)*8 + "px";
        if(styleObj["text-align"] === "left")
            styleObj["padding-left"] = etxtindent;
        else if(styleObj["text-align"] === "right")
            styleObj["padding-right"] = etxtindent;
    }
    innerStyleObj["word-break"] = "break-all";
    innerStyleObj["word-wrap"] = "break-word";
}

const appendCusAttrObj = (obj, cusattrs, styleObj) =>{
    if(!cusattrs)
        return;
    if(cusattrs.get("hide")==="y")
        styleObj["display"] = "none";
    if(cusattrs.get("id"))
        obj.cusid = cusattrs.get("id");
    if(cusattrs.get("name"))
        obj.cusname = cusattrs.get("name");
    if(cusattrs.get("class"))
        obj.cusclass = cusattrs.get("class");
    if(cusattrs.get("style"))
        appendCusAttrStyle(styleObj, cusattrs.get("style"));
}

const appendCusAttrStyle = (styleObj, cusstylestr) => {
    let styleArr = cusstylestr.split(";");
    for(let i=0; i<styleArr.length; i++){
        let item = styleArr[i];
        let itemArr = item.split(":");
        if(itemArr.length >= 2)
            styleObj[itemArr[0]] = itemArr[1];
    }
    return styleObj;
}