function convertNameToTwo(str) {
	var newName = "";
	var len = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		//单字节加1
		if (len >= 4) {
			break;
		}
		len += getCharLength(c)
		newName += String.fromCharCode(c);
	}
	return newName;
}
window.convertNameToTwo = convertNameToTwo
function countCharLengthInByte(str) {
	var len = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		len += getCharLength(c)
	}
	return len;
}
window.countCharLengthInByte = countCharLengthInByte
function getCharLength(c) {
	var len = 2
	if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
		len = 1;
	}
	return len
}
var showDialog = function(url, title, width, height, callbackfunc) {
	if (!width) {
		width = 700
	}
	if (!height) {
		height = 600
	}
	var diag_xx = new Dialog();
	diag_xx.Width = width;
	diag_xx.Height = height;
	diag_xx.ShowCloseButton = true;
	diag_xx.Title = title;
	diag_xx.opacity = 0.4;
	diag_xx.URL = url;
	diag_xx.callbackfunc4CloseBtn = () => {
		callbackfunc()
	}
	diag_xx.show();
}
window.showDialog = showDialog
export function fecthCommon(url, callbackfunc) {
	if (url.indexOf("?") != -1) {
		url += "&" + Math.random()
	} else {
		url += "?" + Math.random()
	}
	fetch(url, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
			"X-Requested-With": "XMLHttpRequest"
		},
		credentials: "include"
	}).then((response) => {
		if (response.ok) {
			response.json().then((data) => {
				callbackfunc(data)
			});
		} else {
			console.log("Looks like the response wasn't perfect, got status", response.status);
		}
	}).catch(e => console.log("Fetch failed!", e));
}
function quitSystemForRoute() {
	top.Dialog.confirm("确定要退出系统吗？", function() {
		$.post('/login/LoginUtil.jsp', {
			type: "logout"
		}, () => {
			$("#IMbg", parent.document).remove();
			$("#immsgdiv", parent.document).remove();
			$("#addressdiv", parent.document).remove();
			window.location.hash = '/';
		})
	})
}
window.quitSystemForRoute = quitSystemForRoute
function quitSystem() {
	top.Dialog.confirm("确定要退出系统吗？", function() {
		window.location.href = '/login/Logout.jsp';
	})
}
window.quitSystem = quitSystem
function changeAccount(event,singleUser) {
	var userid = $(event.currentTarget).attr("data-userid")
	if($(event.target).attr("class") == "css-topmenu-hrminfo-username"){
		window.open("/hrm/HrmTab.jsp?_fromURL=HrmResource&id=" + userid);
	}else if(!singleUser){
		window.location = "/login/IdentityShift.jsp?shiftid=" + userid;
	}
}
window.changeAccount = changeAccount
function canUpdateComponent(nextState, nextProps, curState, curProp) {
	let canUpdate = false
	if (JSON.stringify(nextProps) !== JSON.stringify(curProp)) {
		canUpdate = true
	}
	return canUpdate
}
window.canUpdateComponent = canUpdateComponent