let __propertyChangeFnArray = {};

jQuery.fn.extend({
    bindPropertyChange: function(funobj){
        return this.each(function () {
            var thisid = jQuery(this).attr('id');
            var fnArr = __propertyChangeFnArray[thisid];
			if (!!!fnArr) {
				fnArr = new Array();
				__propertyChangeFnArray[thisid] = fnArr;
			}
			fnArr.push(funobj);
        });
    }
});

window.__propertyChangeFnArray = __propertyChangeFnArray;