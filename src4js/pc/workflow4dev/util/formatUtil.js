import trim from 'lodash/trim'

export const convertFormatValue = (realval,formatJSON) =>{
	try{
		var formatval="";
		var numberType=parseInt(formatJSON["numberType"]);
		if(numberType===1){			//1常规
		}else if(numberType===2){	//2数值
			const transQfw = parseInt(formatJSON["thousands"]||0) === 1;
			const transAbs = formatJSON["formatPattern"] == "3" || formatJSON["formatPattern"] == "4";
			formatval = window.formatFloatValue(realval, parseInt(formatJSON["decimals"]), transQfw, transAbs);
		}else if(numberType===3){	//3日期
			formatval = formatToDate(realval,formatJSON["formatPattern"]);
		}else if(numberType===4){	//4时间
			formatval = formatToTime(realval,formatJSON["formatPattern"]);
		}else if(numberType===5){	//5百分比
			formatval = formatToPercent(realval,formatJSON["decimals"]);
		}else if(numberType===6){	//6科学计数
			formatval = formatToScience(realval,formatJSON["decimals"]);
		}else if(numberType===7){	//7文本
		}else if(numberType===8){	//8特殊
			formatval = formatToSpecial(realval,formatJSON["formatPattern"]);
		}
		return formatval;
	}catch(e){
		if(window.console)	console.log(fieldid+"format error");
	}
}

window.convertFormatValue = convertFormatValue;

export const formatToDate = (realVal,formatPattern) => {
	const pattern  =  new RegExp("\\d{2,4}-\\d{1,2}-\\d{1,2}");
	if(!pattern.test(realVal)){
		return realVal;
	}
	/**
	 * formatPattern
	 * 1：yyyy/MM/dd
	 * 2：yyyy-MM-dd
	 * 3：yyyy年MM月dd日
	 * 4：yyyy年MM月
	 * 5：MM月dd日
	 * 6：EEEE
	 * 7：日期大写
	 * 8：yyyy/MM/dd hh:mm a
	 * 9：yyyy/MM/dd HH:mm
	 */
	switch(parseInt(formatPattern)){
		case 1:
			return formatDate(new Date(realVal),"yyyy/MM/dd");
		case 2:
			return formatDate(new Date(realVal),"yyyy-MM-dd");
		case 3:
			return formatDate(new Date(realVal),"yyyy年MM月dd日");
		case 4:
			return formatDate(new Date(realVal),"yyyy年MM月");
		case 5:
			return formatDate(new Date(realVal),"MM月dd日");
		case 6:
			return formatDate(new Date(realVal),"EEEE");	
		case 7:
			return dataToChinese(new Date(realVal));
		case 8:
			return formatDate(new Date(realVal),"yyyy/MM/dd hh:mm a");		
		case 9:
			return formatDate(new Date(realVal),"yyyy/MM/dd HH:mm");
		default:
			return realVal;
	}
}

//日期格式
export const formatDate = (date, fmt) =>{
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
    const obj = {
        'y': date.getFullYear(), // 年份，注意必须用getFullYear
        'M': date.getMonth() + 1, // 月份，注意是从0-11
        'd': date.getDate(), // 日期
        'q': Math.floor((date.getMonth() + 3) / 3), // 季度
        'w': date.getDay(), // 星期，注意是0-6
        'H': date.getHours(), // 24小时制
        'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
        'm': date.getMinutes(), // 分钟
        's': date.getSeconds(), // 秒
        'S': date.getMilliseconds() // 毫秒
    };
	var week = ['天', '一', '二', '三', '四', '五', '六'];
	for(var i in obj)
	{
	    fmt = fmt.replace(new RegExp(i+'+', 'g'), function(m)
	    {
	        var val = obj[i] + '';
	        if(i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
	        for(var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
	        return m.length == 1 ? val : val.substring(val.length - m.length);
	    });
	}
    return fmt;
}

//日期中文
export const dataToChinese = (date) =>{
	   	const arr1 =  ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    	const arr2 =  ["十", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    	const arr3 =  ["〇", "十", "二", "三"];
    	
    	let year  = date.getFullYear();
    	let month = date.getMonth() + 1;
    	let day = date.getDate();
    	
    	let tempYear = year.toString().split('').map((o)=>{
    		return arr1[parseInt(o)];
    	}).toString();
    	
    	let tempMonth = month < 10 ? arr2[month] : month.toString().split('').map((o,index)=>{
    		if(index === 0){
    			return arr3[1];
    		}else{
    			return arr2[parseInt(o)];
    		}
    	}).toString();
    	
    	let tempDay = day < 10 ? arr2[day] : day.toString().split('').map((o,index)=>{
    		if(index === 0){
    			let i = parseInt(o) > 1 ? arr3[1]:'';
    			return arr3[1] + i;
    		}else{
    			return arr2[parseInt(o)];
    		}
    	}).toString();
    	return (tempYear + "年" + tempMonth + "月" + tempDay + "日").replace(/\,/g,'');
}

export const formatToTime = (realVal,formatPattern) =>{
	const pattern  =  new RegExp("(\\d{1,2}:\\d{1,2})(:\\d{1,2})?");
	if(!pattern.test(realVal)){
		return realVal;
	}
	/**
	 * formatPattern
	 * 1：HH:MI:SS
	 * 2：HH:MI:SS AM/PM
	 * 3：HH:MI
	 * 4：HH:MI AM/PM
	 * 5：HH时MI分SS秒
	 * 6：HH时MI分
	 * 7：HH时MI分SS秒 AM/PM
	 * 8：HH时MI分 AM/PM
	 **/
	const realValArr = realVal.split(":");
	const hour  = realValArr[0];
	const minute = realValArr[1];
	const separatorChar = ":";
	const suffix  = parseInt(hour) < 12 ? " AM":" PM";
	switch(parseInt(formatPattern)){
		case 1:
			return hour + separatorChar +  minute + separatorChar + "00";
		case 2:
			return hour + separatorChar +  minute + separatorChar + "00" +　suffix;
		case 3:
			return hour + separatorChar +  minute;
		case 4:
			return hour + separatorChar +  minute + suffix;
		case 5:
			return hour + "时" + minute + "分00秒"; 
		case 6:
			return hour + "时" + minute + "分";
		case 7:
			return hour + "时" + minute + "分00秒" + suffix;
		case 8:
			return hour + "时" + minute + "分" + suffix;
		default:
			return realVal;
	}
}

//百分比
export const formatToPercent = (realVal,decimals) => {
	const pattern  =  new RegExp("(-?\\d+)(\\.\\d+)?");
	if(!pattern.test(realVal)){
		return realVal;
	}
	return window.formatFloatValue(Number(realVal) * 100,parseInt(decimals),false) + "%";
}

//科学计数
export const formatToScience = (realVal,decimals) => {
	const pattern  =  new RegExp("(-?\\d+)(\\.\\d+)?");
	if(!pattern.test(realVal)){
		return realVal;
	}
	return Number(realVal).toExponential(decimals);
}

//特殊
export const formatToSpecial = (realVal,formatPattern) =>{
	const pattern  =  new RegExp("(-?\\d{1,12})(\\.\\d+)?");
	if(!pattern.test(realVal)){
		return realVal;
	}
	
	if(parseInt(formatPattern) === 1){
		const digit = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
		const unit = [["", "万", "亿"],["", "十", "百", "千"]];
		return specialTrans(realVal,digit,unit);
	}else{
		const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
		const unit = [["", "万", "亿"],["", "拾", "佰", "千"]];
		return specialTrans(realVal,digit,unit);
	}
}

export const specialTrans = (realVal,digit,unit) =>{
	if(parseFloat(realVal) === 0){
		return digit[0];
	}
	let headfix = "";
	let intPar_t = "";
	let pointPar_t = "";
	
	if(parseFloat(realVal) < 0){
		realVal = realVal.substring(1);		
		headfix = "-";
	}
	let realValArr = realVal.split(".");
	let intPar  = trim(realValArr[0]);
	while(intPar.length > 0 && parseInt(intPar[0]) === 0 ){
		intPar = intPar.substr(1);
	}
	let pointPar = realValArr.length === 2 ? trim(realValArr[1]) : "";
	let lastflag =  false;
	let intParArr = intPar.length > 0 ? intPar.toString().split('') : [];
	let pointParArr = pointPar.length > 0 ? pointPar.toString().split(''):[];
	let j = 0;
	
	pointPar_t = pointPar.length > 0 ? "." : pointPar_t;
	pointParArr.map(v=>{
		pointPar_t = pointPar_t + digit[parseInt(v)];
	});
	
	for(let i=intParArr.length - 1;i >= 0 ;i--,j++ ){
		let v = parseInt(intParArr[i]);
		let m  = j%4;
		if(m === 0){
			lastflag = false;
			intPar_t = unit[0][j/4]+intPar_t;
		}
		
		if(v === 0){
			if(lastflag && intPar_t[0] === digit[0]) {
				intPar_t = digit[v]+intPar_t;
			}
		}else{
			lastflag = true;
			intPar_t = digit[v] + unit[1][m] + intPar_t;
		}
	}
	intPar_t = trim(intPar_t).length === 0 ? digit[0] : intPar_t;
	return headfix + intPar_t + pointPar_t;
}
