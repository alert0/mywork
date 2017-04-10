function $GetEle(identity, _document) {
	var rtnEle = null;
	if (_document == undefined || _document == null) _document = document;
	
	rtnEle = _document.getElementById(identity);
	if (rtnEle == undefined || rtnEle == null) {
		rtnEle = _document.getElementsByName(identity);
		if (rtnEle.length > 0) rtnEle = rtnEle[0];
		else rtnEle = null;
	}
	return rtnEle;
}


function $G(identity, _document) {
	return $GetEle(identity, _document);
}

function $GetEles(identity) {
	var rtnEle = null;
	
	rtnEle = document.getElementsByName(identity);
	
	if (rtnEle.length == 1) {
		return rtnEle[0]; 
	} else if (rtnEle.length == 0) {
		return document.getElementById(identity);
	}
	return rtnEle;
}

function  readCookie(name){  
   var  cookieValue  =  "7";  
   var  search  =  name  +  "=";
   try{
	   if(document.cookie.length  >  0) {    
	       offset  =  document.cookie.indexOf(search);  
	       if  (offset  !=  -1)  
	       {    
	           offset  +=  search.length;  
	           end  =  document.cookie.indexOf(";",  offset);  
	           if  (end  ==  -1)  end  =  document.cookie.length;  
	           cookieValue  =  unescape(document.cookie.substring(offset,  end))  
	       }  
	   }  
   }catch(exception){
   }
   return  cookieValue;  
} 

var wuiUtil = {
	/**
	 * isNotNull 目标值不为null || undefined，返回true，否则返回false
	 */
	isNotNull: function (target) {
		if (target == undefined || target == null) {
			return false;
		}
		return true;
	}, 
	/**
	 * isNullOrEmpty 目标值为null、undefined、空，返回true，否则返回false
	 */
	isNullOrEmpty : function (target) {
		if (target == undefined || target == null || target == "") {
			return true;
		}
		return false;
	}, 
	/**
	 * isNotEmpty 目标值不为null、undefined、空，返回true，否则返回false
	 */
	isNotEmpty : function (target) {
		if (target == undefined || target == null || target == "") {
			return false;
		}
		return true;
	},
	getJsonValueByIndex: function (josinobj, index) {
		var _index = 0;
		try {
			for(var key in josinobj){
				if (index == _index) {
					return josinobj[key]; 			
				}
				_index++;
			}
		} catch (e) {alert("browser return value is error!");}
		return "";
	},
	getJsonValueByIndexNew: function (josinobj, index) {
		var _index = 0;
		try {
			var josinobj = eval("("+josinobj+")");
			if(typeof(josinobj) != undefined && typeof(josinobj) != 'undefined'&&null!=josinobj){
				var isjosin = josinobj.id;
				//alert("isjosin : "+isjosin);
				if(typeof(isjosin) != undefined && typeof(isjosin) != 'undefined'&&null!=isjosin)
				{
					for(var key in josinobj){
						if (index == _index) {
							return josinobj[key]; 			
						}
						_index++;
					}
				}
				else
				{
					jsids = new VBArray(josinobj).toArray();
					return jsids[index];
				}
			}
		} catch (e) {alert("browser return value is error!");}
		return "";
	}
};



window.$GetEle = $GetEle;
window.$G =$G;
window.$GetEles = $GetEles;
window.readCookie =readCookie;
window.wuiUtil = wuiUtil;