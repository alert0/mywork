/** --------- 元素拖动功能js函数 -----------**/
function addEvent(obj, type, handle) {
	try { // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
		obj.addEventListener(type, handle, false);
	} catch (e) {
		try { // IE8.0及其以下版本
			obj.attachEvent("on" + type, handle);
		} catch (e) { // 早期浏览器
			obj["on" + type] = handle;
		}
	}
}

window.addEvent = addEvent;

function dragStart(ishead,d_event){
	var e = d_event.nativeEvent;
	var target =  d_event.currentTarget
	e=e||event
	srcElement=e.srcElement||e.target;
	if(ishead) {
		if(!(srcElement.className=="header" || srcElement.className=="title")) return;

		if(!(e.button==1||e.button==0)){
			return;
		}
		if(dragobj.o){
			return;
		}
		if(target.className=="title" ) target=target.parentNode;
	}else{
		if(!(srcElement.className=="tabcontainer tab2")) {
			return;
		}
		if(!(e.button==1||e.button==0)){
			return;
		}
		if(dragobj.o){
			return;
		}
		target=target.parentNode.parentNode.parentNode;
	}
	dragobj.o=target.parentNode;
	//alert(dragobj.o.className+"------"+target.className);
	srcGroupFlag=$($(target).parents(".group")[0]).attr(_handleAttrName("areaflag"));
	//对象左上的坐标
	dragobj.xy=getxy(dragobj.o);
	//鼠标的相对位置
	dragobj.xx=new Array((e.x-dragobj.xy[1]),(e.y-dragobj.xy[0]))
	dragobj.o.style.width=dragobj.xy[2]+"px";
	dragobj.o.style.height=dragobj.xy[3]+"px";
	dragobj.o.style.left=(e.x-dragobj.xx[0] - 61)+"px";
	dragobj.o.style.top=(e.y-dragobj.xx[1] - 55)+"px";   
	dragobj.o.style.position="absolute";
	//创建临时对象用于记住其原始位置，占位
	var om=document.createElement("div");
	dragobj.otemp=om
	om.style.width=dragobj.xy[2]+"px"
	om.style.height=dragobj.xy[3]+"px"
	om.className="location";
	om.style.width="auto";
	dragobj.o.parentNode.insertBefore(om,dragobj.o)
	return false
}

window.dragStart = dragStart;

function MoveEData(srcFlag,targetFlag){
	var srcItemEids=""; 
	var areaflag = _handleAttrName("areaflag");
	$(".group["+areaflag+"="+srcFlag+"]>").find(".item").each(function(i){
		if(this.className=="item")	{
			srcItemEids+=$(this).attr("data-eid")+",";
		}
	})
	var targetItemEids="";   
	$(".group["+areaflag+"="+targetFlag+"]>").find(".item").each(function(i){
		if(this.className=="item")	{
			targetItemEids+=$(this).attr("data-eid")+",";
		}
	})  
	if(targetItemEids == "") return;
	var url="/homepage/element/EsettingOperate.jsp?method=editLayout&hpid="+global_hpid+"&subCompanyId="+global_subCompanyId+"&srcFlag="+srcFlag+"&targetFlag="+targetFlag+"&srcStr="+srcItemEids+"&targetStr="+targetItemEids;		
	GetContentReact(url);
	if(window.global_drag_ebaseid === '29'){
		var configs = window.store_e9_element.getState().elements.get("config").toJSON();
		if(!_isEmpty(configs)){
			for (var k_eid in configs) {
				var config = configs[k_eid];
				if(config.item.ebaseid === '29'){
					window.store_e9_element.dispatch(window.action_e9_element.ECustomPageAction.handleRefresh(config.params));
				}
			}
		}
	}
}

window.MoveEData = MoveEData;

function GetContentReact(url){
	$.ajax({
		 type: "GET",
		 url: url,
		 dataType: "text",
		 success: function(data){
			 var params = {
				 hpid: global_hpid,
				 subCompanyId:global_subCompanyId
			 }
			 $.ajax({
				 type: "POST",
				 url: '/api/portal/homepage/hpdata',
				 data: params,
				 dataType: "json",
				 success: function(data){
					 ecLocalStorage.clearByModule('portal-'+global_hpid);
				 }
			  });
		 }
	});
}

window.GetContentReact = GetContentReact;

window.intMoveEid;
window.srcItem;
window.srcGroupFlag;
window.divLoc;
window.dragobj={};

window.onerror=function(){return false}

function on_ini(){
	String.prototype.inc=function(s){
		return this.indexOf(s)>-1?true:false;
	}
	var agent=navigator.userAgent
	window.isOpr=agent.inc("Opera")
	window.isIE=agent.inc("IE")&&!isOpr
	window.isMoz=agent.inc("Mozilla")&&!isOpr&&!isIE
	if(isMoz){
	   Event.prototype.__defineGetter__("x",function(){return this.clientX+2})
	   Event.prototype.__defineGetter__("y",function(){return this.clientY+2})
	}
	basic_ini()
}

window.on_ini = on_ini;

function basic_ini(){
	window.oDel=function(obj){if($(obj)!=null){$(obj).remove()}}
}

window.basic_ini = basic_ini;

$(function(){
	on_ini();
	//初始化拖动
	var o=$(".header");
});

document.onselectstart=function(){
	if(dragobj.o!=null){
		return false;
	}
}
//window.onfocus=function(){document.onmouseup()}
//window.onblur=function(){document.onmouseup()}
window.addEvent(document, "mouseup", function(e){
	if(dragobj.o!=null){
		var _eid = -1;
		try{
			_eid = dragobj.o.id.split("item_")[1];
		}catch(e){
			//alert(e.message);
		}
	   dragobj.otemp.parentNode.insertBefore(dragobj.o,dragobj.otemp);
	   dragobj.o.style.position="static";
	   dragobj.o.style.width="100%";
	   dragobj.o.style.height="auto";
	   var targetAreaFlag=$(dragobj.otemp).parents(".group").attr(_handleAttrName("areaflag"));
		
	   MoveEData(srcGroupFlag,targetAreaFlag);
	   oDel(dragobj.otemp)
	   //停止拖放
	   dragobj={}
	   
		try{
			var tab_eid = $("td[name='td_tab_"+_eid+"']");
			if(tab_eid.length>0){
				jQuery("#content_view_id_"+_eid).trigger("reload");
			}
			var ebaseid = $("#item_"+_eid).attr("data-ebaseid");
			if(ebaseid == 1 || ebaseid == 7 || ebaseid == 8 || ebaseid == 'news' || ebaseid == 'reportForm') {
				onRefresh(_eid,ebaseid);
			}
		}catch(e){
			//alert(e.message);
		}
	}
});

window.addEvent(document, "mousemove", function(e){
	e=e||event;
	if(dragobj.o!=null){
		dragobj.o.style.zIndex="1";
	   dragobj.o.style.left=(e.x-dragobj.xx[0]-61)+"px";
	   dragobj.o.style.top=(e.y-dragobj.xx[1]-55)+"px";
	   //dragobj.o.style.left=e.clientX;
		//dragobj.o.style.top=e.clientY+document.body.scrollTop;
	   //自动调整布局，显示拖放效果
	   createtmpl(e);
	}
});

//取得鼠标的坐标
function mouseCoords(ev){
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.clientY+document.getElementById("e9routeMain").scrollTop-document.getElementById("e9routeMain").clientTop};
	}
	return {
		x:ev.clientX + document.getElementById("e9routeMain").scrollLeft - document.getElementById("e9routeMain").clientLeft,
		y:ev.clientY + document.getElementById("e9routeMain").scrollTop  - document.getElementById("e9routeMain").clientTop
	};
}

window.mouseCoords = mouseCoords;

//取得位置分别为上，左，宽，高,所有元素必须在同一容器内
function getxy(e){
	var a=new Array();
	var t=e.offsetTop;
	var l=e.offsetLeft;
	var w=e.offsetWidth;
	var h=e.offsetHeight;
	while(e=e.offsetParent){
	   t+=e.offsetTop;
	   l+=e.offsetLeft;
	}
	a[0]=t;a[1]=l;a[2]=w;a[3]=h;
	   return a;
}

window.getxy = getxy;

//判断e与o的位置
function inner(o,e){
	var a=getxy(o)
	//鼠标是否在o的内部
	if(e.x>a[1]&&e.x<(a[1]+a[2])&&e.y>a[0]&&e.y<(a[0]+a[3]))
	{	
	 if(e.y<(a[0]+a[3]/2))
		   //上半部分
			return 1;
	 else
			return 2;
	}else
	 return 0;
}

window.inner = inner;

//
function createtmpl(e){
	var items=$(".item");
	for(var i=0;i<items.length;i++){
	   if(!items[i] || items[i]==dragobj.o)
		continue;
		//修正鼠标坐标
		var mousePos  = mouseCoords(e);
	   var b=inner(items[i],mousePos);
	   if(b==0)
			continue;
	  dragobj.otemp.style.width="auto";

	   if(b==1){
			items[i].parentNode.insertBefore(dragobj.otemp,items[i]);
	   }
	   else{
			if(items[i].nextSibling==null){
				items[i].parentNode.appendChild(dragobj.otemp);
			}else{
				items[i].parentNode.insertBefore(dragobj.otemp,items[i].nextSibling);
			}
	   }
}

window.createtmpl = createtmpl;


//处理拖放至边界外的情况
window.groups=$(".group");
	for(var j=0;j<groups.length;j++){
	   if(groups[j].innerHTML.inc("div")||groups[j].innerHTML.inc("DIV"))
			continue;
	   var op=getxy(groups[j]);
	   if(e.x>(op[1]+10)&&e.x<(op[1]+op[2]-10)){
			groups[j].appendChild(dragobj.otemp);
			dragobj.otemp.style.width=(op[2]-10)+"px";
	   }
	}
}
/** --------- 元素拖动功能js函数 -----------**/

/**-----------左边栏baseelement拖动特效------------**/
window.dragJQuery=drag_jquery;
 function drag_jquery(ebaseid){
    var hoveritem=undefined;
    var itemholder=$("#itemholder");
    var itemholderClass=$(".itemholderClass");
    var index=0;
    $(".portal-setting-left-hpbaseelement-item div a" ).draggable({
        helper: "clone",
        start: function( event, ui ) {
            var helper=ui.helper;
            helper.addClass("dragitemholder");

        }, drag:function( event, ui ){
            if(hoveritem!==undefined){
                var items=hoveritem.find(".item");
                var itemtemp;
                var offset=ui.offset;
                var itemoffset;
                var itemheight;
                var flag=true;
                for(var i=0,len=items.length;i<len;i++){
                    itemtemp=$(items[i]);
                    itemoffset=itemtemp.offset();
                    itemheight=itemtemp.height();
                    if(offset.top>itemoffset.top  && offset.top<itemoffset.top+itemheight){
                        if(itemtemp.prev()===itemholder) {return;}
                        itemholder.insertBefore(itemtemp);
                        // console.log("offset.top"+offset.top+"---itemoffset.top"+itemoffset.top+"--------itemheight"+itemheight)
                        itemholder.show();
                        index=i;
                        return;
                    }
                    if(i===(len-1))
                        flag=false;
                }
                if(!flag || items.length===0){
                    hoveritem.find(".group").append(itemholder);
                    itemholder.show();
                }
            }
        }
    });
     //将td注册drop事件
     $(".group").parent().droppable({
         over: function( event, ui ) {
             hoveritem=$(event.target);
         },
         drop: function( event, ui ) {
             var areaflag=hoveritem.find(".group").attr("data-areaflag");
             if(ebaseid==null){
                 return;
             }
             window.store_e9_element.dispatch(window.action_e9_element.HpBaseElementAction.onAddReactElement(ebaseid,areaflag,index));
             //鼠标移除则隐藏占位框
         },out: function(event,ui) {
             // itemholderClass.hide();
             $(".dragitemholder").hide();
         }
     });
}