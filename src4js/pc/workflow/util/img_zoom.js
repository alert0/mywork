var tempWidth, tempHeight; //图片实际宽高
var divWidth, divHeight; //图片外层div宽高
const cache = {minStep:0,maxStep:3};

function show(e) {
	var options = { scaleImg: true };
	var ahref = $(e).find('a').attr("pichref");
	var dive = $(e).parent().parent().find("#" + ahref);
	var hrefhtml = dive.html();
	var content_w = dive.width();
	var content_h = dive.height();

	var savesrc = jQuery(hrefhtml).attr("src"); //文件保存路径
	tempWidth = content_w;
	tempHeight = content_h;

	var content_div_w = content_w;
	var content_div_h = content_h;
	var iframeWidth = 1200 * 0.9;

	var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth);
	var height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
	var x = window.pageXOffset || (window.document.documentElement.scrollLeft || window.document.body.scrollLeft);
	var y = window.pageYOffset || (window.document.documentElement.scrollTop || window.document.body.scrollTop);
	var window_size = { 'width': width, 'height': height, 'x': x, 'y': y }

	if(iframeWidth > content_w) {
		content_div_w = iframeWidth;
	}

	if(content_w > width * 0.9) {
		content_div_w = width * 0.9;
	}
	//var line_div_h 

	if(270 > content_h) {
		content_div_h = 300;
	}
	if(content_h > height * 0.9) {
		content_div_h = height * 0.9;
	}

	var width = content_w + 40;
	var height = content_h + 40;
	var d = window_size;
	// ensure that newTop is at least 0 so it doesn't hide close button
	var newTop = Math.max((d.height / 2) - (height / 2) + y - 300, 0);
	var newLeft = (d.width / 2) - (width / 2);
	var newTop_div = Math.max((d.height / 2) - (content_div_h / 2), 0) - 100;

	//alert(d.height/2);
	//alert(content_div_h/2);
	//alert(y);
	var newLeft_div = (d.width / 2) - (content_div_w / 2) - 20;

	var imgtop = 0;
	var imgleft = 0;
	if(iframeWidth > content_w) {
		imgleft = (iframeWidth - content_w) / 2;
	}

	if(content_h < height * 0.9) {
		imgtop = (content_div_h - content_h) / 2 + 30;
	} else {
		imgtop = 30;
	}
	//var curTop             = e.pageY;
	//var curLeft            = e.pageX;
	var curTop = content_h;
	var curLeft = $(e).find('a').pageX + 100;

	var zoom  = jQuery('#zoom');
	var zoom_close = jQuery('#zoom_close');
	var zoom_left = jQuery('#zoom_left');
	var zoom_right = jQuery('#zoom_right');
	var zoom_content1 = jQuery('#zoom_content1');

	zoom_close.attr('curTop', curTop);
	zoom_close.attr('curLeft', 173);
	zoom_close.attr('scaleImg', options.scaleImg ? 'true' : 'false');

	zoom_left.attr('curTop', curTop);
	zoom_left.attr('curLeft', curLeft - 50);

	zoom_right.attr('curTop', curTop);
	zoom_right.attr('curLeft', curLeft + 50);

	jQuery('#zoom').hide().css({
		position: 'absolute',
		top: curTop + 'px',
		left: curLeft + 'px',
		width: '1px',
		height: '1px'
	});

	if(options.closeOnClick) {
		jQuery('#zoom').click(hide);
	}

	divWidth = content_div_w;
	divHeight = content_div_h;
	if(options.scaleImg) {
		zoom_content1.html(hrefhtml);
		jQuery("#zoom_content").css({ "width": content_div_w + 20, "height": content_div_h + 10, "text-align": "center", "vertical-align": "middle", "z-index": "9999" });
		jQuery("#zoom_content1").css({ "width": content_div_w, "height": content_div_h, "display": "table-cell", "text-align": "center", "vertical-align": "middle", "z-index": "9999" });
		jQuery("#zoom_content").find("img").css({ "z-index": "9999", "vertical-align": "middle" });
	} else {
		zoom_content.html('');
	}

	if(newTop_div < 0) newTop_div = 10;
	jQuery('#zoom').animate({
		top: newTop_div + 'px',
		left: newLeft_div + 'px',
		opacity: "show",
		width: content_div_w + 50,
		height: content_div_h + 60
	}, 0, null);

	jQuery('#zoom_close').unbind('click').bind('click', function() {
		jQuery('#zoom').animate({
			top: zoom_close.attr('curTop') + 'px',
			left: zoom_close.attr('curLeft') + 'px',
			opacity: "hide",
			width: '1px',
			height: '1px'
		}, 0, null, function() {
			jQuery('#zoom_content1').html('');
			jQuery('#zoom').css('display', 'none');
		});
	});

	jQuery("#zoom_content").find("img").unbind('mousedown').bind("mousedown", function(e) {
		// 拖拽
		initDrag(e);
	});

	jQuery("#zoom_content").find("img").unbind('mouseup').bind("mouseup", function(e) {
		// 拖拽释放
		release();
	});

	jQuery("#zoom_both").unbind('mousedown').bind("mousedown", function(e) {
		// 拖拽
		initDrag(e);
	});

	jQuery("#zoom_both").unbind('mouseup').bind("mouseup", function(e) {
		// 拖拽释放
		release();
	});

	jQuery('#zoom_right').unbind('click').bind('click', function(e) {
		// 右旋转
		var target = zoom.find('.maxImg');
		_rotate(target, 'right', width);
	});
	jQuery('#zoom_left').unbind('click').bind('click', function(e) {
		// 左旋转
		var target = zoom.find('.maxImg');
		_rotate(target, 'left', width);
	});
	jQuery('#zoom_1').unbind('click').bind('click', function(e) {
		// 1:1
		var target = zoom.find('.maxImg');
		imgToOldSize(target, content_w, content_h);
	});
	jQuery('#zoom_add').unbind('click').bind('click', function(e) {
		// 放大
		var target = zoom.find('.maxImg');
		imgToSize(target, 'add', content_w, content_h);
	});
	jQuery('#zoom_minus').unbind('click').bind('click', function(e) {
		// 缩小
		var target = zoom.find('.maxImg');
		imgToSize(target, 'minus', content_w, content_h);
	});
	jQuery('#zoom_save').unbind('click').bind('click', function(e) {
		// 保存
		downloads_sf(savesrc);
	});

}



function _rotate(target, direction, width) {
	var img = $(target)[0],
		step = img.getAttribute('step');
	if(img.length <= 0) {
		return;
	}
	if(step == null) {
		step = cache.minStep;
	}
	//图片宽高
	var width = img.width,
		height = img.height;
	if(direction == 'left') {
		step--;
		if(step < cache.minStep) {
			step = cache.maxStep;
		}
	} else if(direction == 'right') {
		step++;
		if(step > cache.maxStep) {
			step = cache.minStep;
		}
	}
	img.setAttribute('step', step);
	// IE
	if(navigator.userAgent.indexOf('MSIE') >= 0) {
		var s = $(img).attr('step');
		if(typeof(FileReader) !== "undefined") {
			s = parseInt(s) + 1;
			switch(s) {
				case 1:
					img.style.cssText = "-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);transform:rotate(0deg);-o-transform:rotate(0deg);";
					break;
				case 2:
					img.style.cssText = "-webkit-transform: rotate(90deg);-moz-transform: rotate(90deg);transform:rotate(90deg);-o-transform:rotate(90deg);";
					break;
				case 3:
					img.style.cssText = "-webkit-transform: rotate(180deg);-moz-transform: rotate(180deg);transform:rotate(180deg);-o-transform:rotate(180deg);";
					break;
				case 4:
					img.style.cssText = "-webkit-transform: rotate(270deg);-moz-transform: rotate(270deg);transform:rotate(270deg);-o-transform:rotate(270deg);";
					break;
			}
		} else {
			var ieversonnew = document.documentMode;
			if(ieversonnew > 8) { //兼容IE8及以下版本
				s = parseInt(s) + 1;
				switch(s) {
					case 1:
						img.style.cssText = "-ms-transform: rotate(0deg);-ms-transform-origin:50% 50%;";
						break;
					case 2:
						img.style.cssText = "-ms-transform: rotate(90deg);-ms-transform-origin:50% 50%;";
						break;
					case 3:
						img.style.cssText = "-ms-transform: rotate(180deg);-ms-transform-origin:50% 50%;";
						break;
					case 4:
						img.style.cssText = "-ms-transform: rotate(270deg);-ms-transform-origin:50% 50%;";
						break;
				}
			} else {
				var angle = 90 * s;
				var scale = 1;
				var rad = angle * (Math.PI / 180);
				var m11 = Math.cos(rad) * scale,
					m12 = -1 * Math.sin(rad) * scale,
					m21 = Math.sin(rad) * scale,
					m22 = m11;
				img.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + m11 + ",M12=" + m12 + ",M21=" + m21 + ",M22=" + m22 + ",SizingMethod='auto expand')";
			}
		}
		img.width = width;
		img.height = height;
		var middlewidth = tempWidth;
		var middleheight = tempHeight;
		//if(s == 1 || s == 3){
		if(divWidth > tempHeight) {
			width = divWidth;
		} else {
			width = tempHeight;
		}
		if(divHeight > tempWidth) {
			height = divHeight;
		} else {
			height = tempWidth;
		}
		tempWidth = middleheight
		tempHeight = middlewidth;

		parent.jQuery("#zoom_content1").css({ "width": width, "height": height, "display": "table-cell", "text-align": "center", "vertical-align": "middle", "z-index": "9999" });
	} else { // 对于现代浏览器 使用canvas
		var canvas = $(img).next('canvas')[0];
		if($(img).next('canvas').length == 0) {
			img.style.display = 'none';
			canvas = document.createElement('canvas');
			canvas.setAttribute('class', 'canvas');
			img.parentNode.appendChild(canvas);
		}
		//旋转角度以弧度值为参数
		var degree = step * 90 * Math.PI / 180;
		var ctx = canvas.getContext('2d');
		switch(step) {
			case 0:
				canvas.width = width;
				canvas.height = height;
				ctx.drawImage(img, 0, 0, width, height);
				break;
			case 1:
				canvas.width = height;
				canvas.height = width;
				ctx.rotate(degree);
				ctx.drawImage(img, 0, -height, width, height);
				break;
			case 2:
				canvas.width = width;
				canvas.height = height;
				ctx.rotate(degree);
				ctx.drawImage(img, -width, -height, width, height);
				break;
			case 3:
				canvas.width = height;
				canvas.height = width;
				ctx.rotate(degree);
				ctx.drawImage(img, -width, 0, width, height);
				break;
		}
	}
	$(target).attr("step", cache.step);
}

drag = 0
move = 0

// 拖拽对象
// 参见：http://blog.sina.com.cn/u/4702ecbe010007pe
var ie = document.all;
var nn6 = document.getElementById && !document.all;
var isdrag = false;
var y, x;
var oDragObj;

/*
 * 图片按10%缩放
 */
var indexi = 0;

function imgToSize(target, obj, hWidth, hHeight) {
	var img = $(target)[0],
		step = img.getAttribute('step');
	if(step == null) {
		step = cache.minStep;
	}
	step = parseInt(step);
	var oWidth = img.width, //取得图片的实际宽度
		oHeight = img.height; //取得图片的实际高度
	parent.jQuery("#zoom_1").bind('click', function(e) {
		// 1:1
		var target = parent.jQuery("#zoom").find('.maxImg');
		imgToOldSize(target, hWidth, hHeight);
	});
	//图片放大10%
	if(obj == "add") {
		indexi++;
		if(indexi > 13) {
			indexi--;
			return false;
		}
		if(indexi == 0) {
			parent.jQuery("#zoom_1").unbind();
			parent.jQuery("#zoom_1").css("background", "#FFFFFF url(/images/preview/noash_wev8.png) no-repeat");
		} else {
			parent.jQuery("#zoom_1").css("background", "#FFFFFF url(/images/preview/contrast_wev8.png) no-repeat");
		}
		var addwidth = oWidth + hWidth / 10,
			addheight = oHeight + hHeight / 10;
		if(navigator.userAgent.indexOf('MSIE') >= 0) {
			var s = $(img).attr('step');
			img.width = addwidth;
			img.height = addheight;
			$(img).css({ "width": addwidth, "height": addheight, "z-index": "9999", "vertical-align": "middle" });
			if(s == 1 || s == 3) {
				tempWidth = addheight;
				tempHeight = addwidth;
			} else {
				tempWidth = addwidth;
				tempHeight = addheight;
			}

			if(divWidth > tempWidth) {
				addwidth = divWidth;
			} else {
				addwidth = tempWidth;
			}
			if(divHeight > tempHeight) {
				addheight = divHeight;
			} else {
				addheight = tempHeight;
			}
			parent.jQuery("#zoom_content1").css({ "width": addwidth, "height": addheight, "text-align": "center", "vertical-align": "middle", "z-index": "9999", "display": "table-cell" });
		} else { // 对于现代浏览器 使用canvas
			img.width = addwidth;
			img.height = addheight;
			$(img).css({ "width": addwidth, "height": addheight, "z-index": "9999", "vertical-align": "middle" });
			var canvas = $(img).next('canvas')[0];
			var degree = step * 90 * Math.PI / 180;
			if($(img).next('canvas').length != 0) {
				var ctx = canvas.getContext('2d');
				switch(step) {
					case 0:
						canvas.width = addwidth;
						canvas.height = addheight;
						ctx.drawImage(img, 0, 0, addwidth, addheight);
						break;
					case 1:
						canvas.width = addheight;
						canvas.height = addwidth;
						ctx.rotate(degree);
						ctx.drawImage(img, 0, -addheight, addwidth, addheight);
						break;
					case 2:
						canvas.width = addwidth;
						canvas.height = addheight;
						ctx.rotate(degree);
						ctx.drawImage(img, -addwidth, -addheight, addwidth, addheight);
						break;
					case 3:
						canvas.width = addheight;
						canvas.height = addwidth;
						ctx.rotate(degree);
						ctx.drawImage(img, -addwidth, 0, addwidth, addheight);
						break;
				}
			}
		}
	}
	//图片缩小10%
	if(obj == "minus") {
		indexi--;
		if(indexi < -7) {
			indexi++;
			return false;
		}
		if(indexi == 0) {
			parent.jQuery("#zoom_1").unbind();
			parent.jQuery("#zoom_1").css("background", "#FFFFFF url(/images/preview/noash_wev8.png) no-repeat");
		} else {
			parent.jQuery("#zoom_1").css("background", "#FFFFFF url(/images/preview/contrast_wev8.png) no-repeat");
		}
		var minuswidth = oWidth - hWidth / 10,
			minusheight = oHeight - hHeight / 10;
		if(navigator.userAgent.indexOf('MSIE') >= 0) {
			var s = $(img).attr('step');

			img.width = minuswidth;
			img.height = minusheight;
			$(img).css({ "width": minuswidth, "height": minusheight, "z-index": "9999", "vertical-align": "middle" });
			if(s == 1 || s == 3) {
				tempWidth = minusheight;
				tempHeight = minuswidth;
			} else {
				tempWidth = minuswidth;
				tempHeight = minusheight;
			}
			if(divWidth > tempWidth) {
				minuswidth = divWidth;
			} else {
				minuswidth = tempWidth;
			}
			if(divHeight > tempHeight) {
				minusheight = divHeight;
			} else {
				minusheight = tempHeight;
			}
			parent.jQuery("#zoom_content1").css({ "width": minuswidth, "height": minusheight, "text-align": "center", "vertical-align": "middle", "z-index": "9999", "display": "table-cell" });
		} else { // 对于现代浏览器 使用canvas
			img.width = minuswidth;
			img.height = minusheight;
			$(img).css({ "width": minuswidth, "height": minusheight, "z-index": "9999", "vertical-align": "middle" });
			var canvas = $(img).next('canvas')[0];
			var degree = step * 90 * Math.PI / 180;
			if($(img).next('canvas').length != 0) {
				var ctx = canvas.getContext('2d');
				switch(step) {
					case 0:
						canvas.width = minuswidth;
						canvas.height = minusheight;
						ctx.drawImage(img, 0, 0, minuswidth, minusheight);
						break;
					case 1:
						canvas.width = minusheight;
						canvas.height = minuswidth;
						ctx.rotate(degree);
						ctx.drawImage(img, 0, -minusheight, minuswidth, minusheight);
						break;
					case 2:
						canvas.width = minuswidth;
						canvas.height = minusheight;
						ctx.rotate(degree);
						ctx.drawImage(img, -minuswidth, -minusheight, minuswidth, minusheight);
						break;
					case 3:
						canvas.width = minusheight;
						canvas.height = minuswidth;
						ctx.rotate(degree);
						ctx.drawImage(img, -minuswidth, 0, minuswidth, minusheight);
						break;
				}
			}
		}
	}
}

/*
 * 图片还原1:1
 */
function imgToOldSize(target, oWidth, oHeight) {
	var img = $(target)[0],
		step = img.getAttribute('step');
	if(step == null) {
		step = cache.minStep;
	}
	step = parseInt(step);
	indexi = 0;
	//parent.jQuery("#zoom_1").width();
	var nowWidth = img.width; //取得图片的实际宽度
	parent.jQuery("#zoom_1").css("background", "#FFFFFF url(/images/preview/noash_wev8.png) no-repeat");
	parent.jQuery("#zoom_1").unbind();
	if(nowWidth != oWidth) {
		img.width = oWidth - 15;
		img.height = oHeight - 15;
		$(img).css({ "width": oWidth - 15, "height": oHeight - 15, "z-index": "9999", "vertical-align": "middle" });
		if(navigator.userAgent.indexOf('MSIE') >= 0) {
			var s = $(img).attr('step');

			img.width = oWidth;
			img.height = oHeight;
			if(s == 1 || s == 3) {
				tempWidth = oHeight;
				tempHeight = oWidth;
				var middlewidth = oHeight;
				var middleheight = oWidth;
				if(divWidth > middlewidth) {
					oWidth = divWidth;
				} else {
					oWidth = middleheight;
				}
				if(divHeight > middleheight) {
					oHeight = divHeight;
				} else {
					oHeight = middleheight
				}
			} else {
				tempWidth = oWidth;
				tempHeight = oHeight;
				if(divWidth > oWidth) {
					oWidth = divWidth;
				}
				if(divHeight > oHeight) {
					oHeight = divHeight;
				}
			}
			parent.jQuery("#zoom_content1").css({ "width": oWidth, "height": oHeight, "text-align": "center", "vertical-align": "middle", "position": "absolute;", "z-index": "9999", "display": "table-cell" });
		} else { // 对于现代浏览器 使用canvas
			img.width = oWidth;
			img.height = oHeight;
			$(img).css({ "width": oWidth, "height": oHeight, "z-index": "9999", "vertical-align": "middle" });
			var canvas = $(img).next('canvas')[0];
			var degree = step * 90 * Math.PI / 180;
			if($(img).next('canvas').length != 0) {
				var ctx = canvas.getContext('2d');
				switch(step) {
					case 0:
						canvas.width = oWidth;
						canvas.height = oHeight;
						ctx.drawImage(img, 0, 0, oWidth, oHeight);
						break;
					case 1:
						canvas.width = oHeight;
						canvas.height = oWidth;
						ctx.rotate(degree);
						ctx.drawImage(img, 0, -oHeight, oWidth, oHeight);
						break;
					case 2:
						canvas.width = oWidth;
						canvas.height = oHeight;
						ctx.rotate(degree);
						ctx.drawImage(img, -oWidth, -oHeight, oWidth, oHeight);
						break;
					case 3:
						canvas.width = oHeight;
						canvas.height = oWidth;
						ctx.rotate(degree);
						ctx.drawImage(img, -oWidth, 0, oWidth, oHeight);
						break;
				}
			}
		}
	}
}

/*
 * 图片下载
 */
function downloads_sf(files) {
	document.location.href = files + "&download=1";
}

function release() {
	isdrag = false;
}

function moveMouse(e) {
	if(isdrag) {
		oDragObj.style.top = (nn6 ? nTY + e.clientY - y : nTY + parent.event.clientY - y) + "px";
		oDragObj.style.left = (nn6 ? nTX + e.clientX - x : nTX + parent.event.clientX - x) + "px";
		return false;
	}
}

function initDrag(e) {
	var oDragHandle = nn6 ? e.target : parent.event.srcElement;
	var topElement = "HTML";
	while(oDragHandle.tagName != topElement && oDragHandle.className != "round_shade_box") {
		oDragHandle = nn6 ? oDragHandle.parentNode : oDragHandle.parentElement;
	}
	if(oDragHandle.className == "round_shade_box") {
		isdrag = true;
		oDragObj = oDragHandle;
		nTY = parseInt(oDragObj.style.top + 0);
		y = nn6 ? e.clientY : parent.event.clientY;
		nTX = parseInt(oDragObj.style.left + 0);
		x = nn6 ? e.clientX : parent.event.clientX;
		parent.document.onmousemove = moveMouse;
		return false;
	}
}

//滚轮缩放
function onWheelZoom(obj) {
	zoom = parseFloat(obj.style.zoom);
	tZoom = zoom + (event.wheelDelta > 0 ? 0.05 : -0.05);
	if(tZoom < 0.1) return true;
	obj.style.zoom = tZoom;
	return false;
}

const showOriginalImage = e => {
	show(e);
}

window.showOriginalImage = showOriginalImage;


/**
 * 图片懒加载
 */
window.formImgLazyLoad = function(container){
	// 获取父元素的高度
	var contHeight = container.outerHeight();
	var contWidth = container.outerWidth();
	// 获取父元素相对于文档页顶部的距离，这边要注意了，分为以下两种情况；
	if (container.get(0) === window) {
		// 第一种情况父元素为window，获取浏览器滚动条已滚动的距离；$(window)没有offset()方法；
		var contop = $(window).scrollTop();
		var conleft = $(window).scrollLeft();
	} else {
		// 第二种情况父元素为非window元素，获取它的滚动条滚动的距离；
		var contop = container.offset().top;
		var conleft = container.offset().left;
	}
	container.find("img[original-src]").each(function(){
		//对象顶部与文档顶部之间的距离，如果它小于父元素底部与文档顶部的距离，则说明垂直方向上已经进入可视区域了；
		//console.log("jQuery(this).offset().top--",jQuery(this).offset().top,"contop--",contop,"contHeight--",contHeight)
		var post = jQuery(this).offset().top - (contop + contHeight);
		//对象底部与文档顶部之间的距离，如果它大于父元素顶部与文档顶部的距离，则说明垂直方向上已经进入可视区域了；
		var posb = jQuery(this).offset().top + jQuery(this).height() - contop;
		// 水平方向上同理；
		var posl = jQuery(this).offset().left - (conleft + contWidth);
		var posr = jQuery(this).offset().left + jQuery(this).width() - conleft;

		//console.log("jQuery(this).is(':visible')",jQuery(this).is(':visible'),"post--",post,"posb--",posb,"posl--",posl,"posr--",posr);
		if ((post < 0 && posb > 0) && (posl < 0 && posr > 0)) {
			var originalSrc = jQuery(this).attr("original-src");
			if (originalSrc != "") {
				jQuery(this).removeAttr("src").attr("src", originalSrc).removeAttr("original-src");
				jQuery(this).removeAttr("style").attr("style", jQuery(this).attr("original-style")).removeAttr("original-style");
				jQuery(this).attr("width", jQuery(this).attr("original-width")).removeAttr("original-width");
				jQuery(this).attr("height", jQuery(this).attr("original-height")).removeAttr("original-height");
			}
		}
	});
}
