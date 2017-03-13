export const defaultIcon = {
	"Mr.": "/images/messageimages/temp/man_wev8.png",
	"Ms.": "/images/messageimages/temp/women_wev8.png"
}
export function splitUserInfo(data){
	var re = /\$+([^\$]+)/ig;
	var arr = "";
	var i = 0;
	let userinfo = {
		userimg: defaultIcon["Mr."],
		name: "",
		sex: "",
		code: "",
		qrcode: "",
		dept: "",
		sub: "",
		job: "",
		manager: "",
		status: "",
		mobile: "",
		tel: "",
		email: "",
		location: ""
	}
	while ((arr = re.exec(data)) != null) {
		var result = arr[1];
		if (result == "noright") {
			break;
		} else {
			if ("," == result) {
				result = ""
			}
			if (i == 0) {} else if (i == 1) {
				userinfo.name = result;
			} else if (i == 2) {
				userinfo.sex = result;
			} else if (i == 3) {
				userinfo.mobile = result;
			} else if (i == 4) {
				userinfo.tel = result;
			} else if (i == 5) {
				userinfo.email = result;
			} else if (i == 6) {
				userinfo.dept = result;
			} else if (i == 7) {
				userinfo.manager = result;
			} else if (i == 8) {
				result = result.substring(8, result.length)
				if (result != "") {
					userinfo.userimg = "/weaver/weaver.file.FileDownload?fileid=" + result	
				} else {
					userinfo.userimg = defaultIcon[userinfo.sex]
				}
			} else if (i == 9) {
				userinfo.sub = result;
			} else if (i == 10) {
				userinfo.job = result;
			} else if (i == 11) {
				userinfo.status = result;
			} else if (i == 12) {
				userinfo.location = result;
			} else if (i == 13) {
				userinfo.code = result;
			}
			i++;
		}
	}
	return userinfo	
}
export function changeHrmCardPos(posX, posY, eleW, eleH) {
	var homepageOffset = $('.homepage').offset()

	var winW = $(window).width();
	var winH = $(window).height() - homepageOffset.top;

	posX -= homepageOffset.left
	posY -= homepageOffset.top
	var realPosY = posY + $('.homepage').scrollTop()

	var hpH = $("#Container").height()

	var left = posX;
	var top = realPosY + eleH

	if (posX > winW - 455) {
		left = posX - 455 + eleW;
	}
	//默认向下展示，如果展示时超出当前窗口高度或者超出最大滚动范围，则向上展示
	if (realPosY > 293 && (posY > winH - 293 || realPosY > hpH - 293)) {
		top = realPosY - 293;
	}
	if (left < 0) {
		left = 0
	}
	if (top < 0) {
		top = 0
	}
	return {top:top,left:left}
}

export function createQRCode(userinfo) {
	var txt = "BEGIN:VCARD \n" +
		"VERSION:3.0 \n" +
		"N:" + userinfo.name + " \n" +
		"TEL;CELL;VOICE:" + userinfo.mobile + " \n" +
		"TEL;WORK;VOICE:" + userinfo.tel + " \n" +
		"EMAIL:" + userinfo.email + " \n" +
		"TITLE:" + userinfo.job + " \n" +
		"ROLE:" + userinfo.dept + " \n" +
		"ADR;WORK:" + userinfo.location + " \n" +
		"END:VCARD";
	jQuery('#showSQRCodeDiv').qrcode({
		render: 'canvas',
		background: "#ffffff",
		foreground: "#000000",
		msize: 0.3,
		size: 120,
		mode: 0,
		//mode 1,2 二维码中插入lable、mode=3或4 二维码中插入 插入，注意IE8及以下版本不支持插图及labelmode设置无效
		label: userinfo.name,
		image: "/images/hrm/weixin_wev8.png",
		text: utf16to8(txt)
	});
}

function utf16to8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}