//重写map函数，实现间隔遍历
Array.prototype.map = function(fn, mul) {
	mul = _str2Int(mul, 1);
	var a = [];
	for (var i = 0; i < this.length; i += mul) {
		var value = fn(this[i], i);
		if (value == null) {
			continue; //如果函数fn返回null，则从数组中删除该项
		}
		a.push(value);
	}
	return a;
};

//数组contains函数
Array.prototype.contains = function (element) {  
	for (var i = 0; i < this.length; i++) { 
		if (this[i] == element) {  
			return true; 
		}
	}
	return false; 
} 


//获取当前时间戳(以s为单位)
Date.prototype.format = function(format) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
}

jQuery.curCSS = function( elem, name ) {
  var ret = '0px';
  var style = elem.style;
  if(window.getComputedStyle){
      var computed = window.getComputedStyle( elem, null );
      if ( computed ) {
          //getPropertyValue兼容ie9获取filter:Alpha(opacity=50)
          ret = computed.getPropertyValue( name ) || computed[ name ];
          //如果是动态创建的元素，则使用style方法获取样式
          if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
              ret = jQuery.style( elem, name );
          }
      }
  }
  return ret;
};