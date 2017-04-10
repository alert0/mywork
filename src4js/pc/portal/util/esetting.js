
function onWorktaskSetting(obj){
	var objParent=obj.parentNode;
	var children=objParent.getElementsByTagName("INPUT");
	var value="";
	for(var i=0;i<children.length;i++){
		var child=children[i];			
		if(child.type=="checkbox" && child.checked){
			value+=child.value+"|";
		}						
	}
	if(value!="") value=value.substring(0,value.length-1);
	//objParent.firstChild.value=value;	
    jQuery(objParent).find("input[type='hidden']:first").val(value);
}

window.onWorktaskSetting = onWorktaskSetting;

function onShowMenus(input, span, eid) {
    //console.dir(arguments);
	var dlg=new window.top.Dialog();//定义Dialog对象
	dlg.Model=true;
	dlg.Width=550;//定义长度
	dlg.Height=560;
	dlg.URL="/systeminfo/BrowserMain.jsp?url=/page/element/Menu/MenusBrowser.jsp";
	//console.log("=======================");
	dlg.callbackfun=function(data){
		if (data) {
	        if (data.id != "") {
	           if (data.id == "hp") {
	                span.innerHTML = "<a href='/homepage/maint/HomepageLocation.jsp' target='_blank'>" + data.name + "</a>";
	            } else if (data.id == "sys") {
	                span.innerHTML = "<a href='/systeminfo/menuconfig/MenuMaintFrame.jsp?type=" + data.id + "' target='_blank'>" + data.name + "</a>";
	            } else {
	               span.innerHTML = "<a href='/page/maint/menu/MenuEdit.jsp?id=" + data.id + "' target='_blank'>" + data.name + "</a>";
	            }
	           input.value = data.id;
	        } else {
	           span.innerHTML = "";
	           input.value = "0";
	        }
	    }
	}
	dlg.show();
}

window.onShowMenus = onShowMenus;

function onClickMenuType(obj,eid){
        var menuType = document.getElementById("menuTypeId_"+eid);
		var spanMenuType = document.getElementById("spanMenuTypeId_"+eid);
		var tempMenuType = document.getElementById("tempMenuTypeId_"+eid);
		var mTypes = document.getElementById("menuType_"+eid);
		menuType.value = "";
		spanMenuType.innerHTML = "";
		tempMenuType.value = obj.value;
}
window.onClickMenuType = onClickMenuType;


function onShowMenuTypes(input, span, eid, menutype) {
    menutype = menutype.value;
    var dlg=new window.top.Dialog();//定义Dialog对象
	dlg.Model=true;
	dlg.Width=550;//定义长度
	dlg.Height=560;
	dlg.URL="/systeminfo/BrowserMain.jsp?url=/page/element/Menu/MenuTypesBrowser.jsp?type=" + menutype;
	dlg.callbackfun=function(data){
		menulink = "";
	    if (menutype == "element") {
	        menulink = "ElementStyleEdit.jsp";
	    } else if (menutype == "menuh") {
	        menulink = "MenuStyleEditH.jsp";
	    } else {
	        menulink = "MenuStyleEditV.jsp";
	    }
	    if (data) {
	        if (data.id != "") {
	            span.innerHTML = "<a href='/page/maint/style/" + menulink + "?styleid=" +data.id + "&type=" + menutype + "&from=list' target='_blank'>" + data.name + "</a>";
	            input.value = data.id;
	        } else {
	            span.innerHTML = "";
	            input.value = "0";
	        }
	    }
	}
	dlg.show();
}
window.onShowMenuTypes = onShowMenuTypes;

function onShowMenuTypes2(input, span, eid, menutype) {
    menutype = menutype.value;
    var dlg=new window.top.Dialog();//定义Dialog对象
	dlg.Model=true;
	dlg.Width=550;//定义长度
	dlg.Height=560;
	dlg.URL="/systeminfo/BrowserMain.jsp?url=/page/element/Menu/MenuTypesBrowser.jsp?type=" + menutype;
	dlg.callback=function(data){
		menulink = "";
	    if (menutype == "element") {
	        menulink = "ElementStyleEdit.jsp";
	    } else if (menutype == "menuh") {
	        menulink = "MenuStyleEditH.jsp";
	    } else {
	        menulink = "MenuStyleEditV.jsp";
	    }
	    if (data) {
	        if (data.id != "") {
	            span.innerHTML = "<a href='/page/maint/style/" + menulink + "?styleid=" +data.id + "&type=" + menutype + "&from=list' target='_blank'>" + data.name + "</a>";
	            input.value = data.id;
	        } else {
	            span.innerHTML = "";
	            input.value = "0";
	        }
	    }
	}
	dlg.show();
}
window.onShowMenuTypes2 = onShowMenuTypes2;

function onShowNewNews(input,span,eid,publishtype){
	var iTop = (window.screen.availHeight-30-550)/2+"px"; //获得窗口的垂直位置;
	var iLeft = (window.screen.availWidth-10-550)/2+"px"; //获得窗口的水平位置;
	var dlg=new window.top.Dialog();//定义Dialog对象
	dlg.Model=true;
	dlg.Width=550;//定义长度
	dlg.Height=550;
	dlg.URL = "/systeminfo/BrowserMain.jsp?url=/docs/news/NewsBrowser.jsp?publishtype="+publishtype;
	dlg.callback=function(datas){
		if (datas){
					if (datas.id){
						$(span).html( "<a href='/docs/news/NewsDsp.jsp?id="+datas.id+"' target='_blank'>" +datas.name+"</a>");
						$(input).val(datas.id);
					}else{ 
						$(span).html( "");
						$(input).val("");
					}
			   }
	   }
    dlg.show();
}

window.onShowNewNews = onShowNewNews;

function onShowDoc(input,span,eid){
    var dlg=new window.top.Dialog();//定义Dialog对象
    dlg.Model=true;
    dlg.Width=550;//定义长度
    dlg.Height=550;
    dlg.URL="/docs/DocBrowserMain.jsp?url=/docs/docs/DocBrowser.jsp?from=hpelement";
    dlg.Title="内容来源";
	   dlg.callbackfun=function(params,datas){
		    if(datas){
				if(datas.id!=""){
					$(input).val(datas.id);
					$(span).html( "<a href='/docs/docs/DocDsp.jsp?id="+datas.id+"'  target='_blank'>"+datas.name+"</a>");
				}
				else{
					$(input).val("");
					$(span).html("");
				}
		     }
    }
    dlg.show();
}

window.onShowDoc = onShowDoc;