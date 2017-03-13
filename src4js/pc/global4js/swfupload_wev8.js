/**
 * SWFUpload: http://www.swfupload.org, http://swfupload.googlecode.com
 *
 * mmSWFUpload 1.0: Flash upload dialog - http://profandesign.se/swfupload/,  http://www.vinterwebb.se/
 *
 * SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilz閚 and Mammon Media and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * SWFUpload 2 is (c) 2007-2008 Jake Roberts and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
/* ******************* */
/* Constructor & Init  */
/* ******************* */
var SWFUpload;
//var NewUploads;

function getBrowserInfo() {
	var agent = navigator.userAgent.toLowerCase();
	var regStr_chrome = /chrome\/[\d.]+/gi;
	var regStr_saf = /safari\/[\d.]+/gi;
	var browser = agent.match(regStr_chrome);
	var verinfo = (browser + "").replace(/[^0-9.]/ig, "");
	//Chrome
	if(agent.indexOf("chrome") > 0) {
		return verinfo.substring(0, 2) >= 55 //chrome版本号
	} else if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
		return true; //safari
	} else {
		return false;
	}
}
//alert(getBrowserInfo() + "! \n 【true为chrome55+或者safari】");
if(SWFUpload == undefined) {
	SWFUpload = function(settings) {
		if(settings && settings["upload_url"]) {
			settings["upload_url"] = settings["upload_url"] + ";jsessionid=" + (this.getJSessionId() || window["_jsessionid"]);
		}
		this.initSWFUpload(settings);

	};
}

SWFUpload.prototype.getJSessionId = function() {
	var c_name = 'JSESSIONID';
	if(document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=");
		if(c_start != -1) {
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if(c_end == -1) c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
};
//var _instance = [];
SWFUpload.prototype.initSWFUpload = function(settings) {
	//console.log("settings",settings);
	if(typeof settings.button_placeholder_id === "object") {
		//console.log("UUID！！！");
		//console.log("UUID",settings.button_placeholder_id);
		settings.button_placeholder_id = settings.button_placeholder_id.id;
		//return false
	}
	//console.log("settings.button_placeholder_id:", settings.button_placeholder_id); //&& settings.button_placeholder_id=="spanButtonPlaceHolder6577"
	try {
		this.customSettings = {}; // A container where developers can place their own settings associated with this instance.
		this.settings = settings;
		this.eventQueue = [];
		this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
		this.movieElement = null;
		// Setup global control tracking
		SWFUpload.instances[this.movieName] = this;
		// Load the settings.  Load the Flash movie.
		this.initSettings();
		//载入按钮
		getBrowserInfo() ? loadNoFlash() : this.loadFlash(); //是safari、chrome55+载入非flash
		this.displayDebugInfo();
		//console.log("this",this);
	} catch(ex) {
		delete SWFUpload.instances[this.movieName];
		throw ex;
	}
	//console.log("SWFUpload.instances[this.movieName]",SWFUpload.instances);
	function loadNoFlash() {
		if(settings.button_placeholder_id !== "") {
			replaced_originPlace()
		}
	}

	function replaced_originPlace() {
		var targetElement, tempParent;
		targetElement = document.getElementById(settings.button_placeholder_id);
		if(targetElement == undefined) {
			throw "Could not find the placeholder element.";
		}
		tempParent = document.createElement("div");
		//根据页面地址判断按钮类型
		if(window.location.href.indexOf("/workflow/request") >= 0 && !jQuery("#" + settings.button_placeholder_id).closest("span.phrase_btn")) {
			tempParent.innerHTML = getHTML("visible", "104px");
		} else if(window.location.href.indexOf("/workflow/request") >= 0 && !!jQuery("#" + settings.button_placeholder_id).parent().hasClass("phrase_btn")) {

			tempParent.innerHTML = getHTML_img(0, "22px");
		} else if(window.location.href.indexOf("/workflow/request") >= 0 && !!jQuery("#" + settings.button_placeholder_id).parent().hasClass("e8fileupload")) {

			tempParent.innerHTML = getHTML_pin(0, "22px");
		} else if(window.location.href.indexOf("/cowork/") >= 0 && !!jQuery("#" + settings.button_placeholder_id).parent().hasClass("e8fileupload")) {
			tempParent.innerHTML = getHTML("hidden", "22px");
		} else if(window.location.href.indexOf("/cowork/") >= 0 && !jQuery("#" + settings.button_placeholder_id).parent().hasClass("e8fileupload")) {
			tempParent.innerHTML = getHTML_workplanAndMeeting(1);
		}else if(window.location.href.indexOf("/docs/docs/") >= 0 ) {//文档

			tempParent.innerHTML = getHTML_docs(0, "22px");
		}else if(window.location.href.indexOf("/docs/reply") >= 0 && jQuery("#" + settings.button_placeholder_id).parent().hasClass("e8fileupload")){
			tempParent.innerHTML = getHTML_docs(0, "22px");
			
		}else if(window.location.href.indexOf("/docs/reply") >= 0 && jQuery("#" + settings.button_placeholder_id).parent().hasClass("phrase_btn")){
			tempParent.innerHTML = getHTML_docs(0, "22px");
			
		}else if(window.location.href.indexOf("/blog/") >= 0) {//微博
			tempParent.innerHTML = getHTML_weibo(1);	
		}else if(window.location.href.indexOf("/workplan/") >= 0 || window.location.href.indexOf("/meeting/") >= 0){//日程
			tempParent.innerHTML = getHTML_workplanAndMeeting(1);
		}else{
			tempParent.innerHTML = getHTML("visible", "104px");
		}
		targetElement.parentNode.replaceChild(tempParent.firstChild, targetElement);
		if(window.location.href.indexOf("/docs/docs/DocDspExt") >= 0 && !jQuery("#" + settings.button_placeholder_id).parent().hasClass("phrase_btn")) {//文档
			//alert("走设置60");
			jQuery("#"+settings.button_placeholder_id).width("60px")
		}
	};
	function getHTML_workplanAndMeeting(isVisib) {
		return '<div  id=' + settings.button_placeholder_id + ' style="display:inline-block;opacity:' + isVisib + ';background: url(/cowork/images/add_wev8.png) no-repeat left top;bottom:4px;padding-left:15px;cursor:pointer;" > 选取多个文件(' + settings.file_size_limit+')</div>';
	}
	function getHTML_docs(isVisib, width) {
		return '<div  id=' + settings.button_placeholder_id + ' style="opacity:' + isVisib + ';width:' + width + ';height:26px;background-color:#1565a9;color:#fff!important;top:-7px;right:3px" >附件</div>';
	}
	function getHTML_pin(isVisib, width) {
		return '<div  id=' + settings.button_placeholder_id + ' style="opacity:' + isVisib + ';width:' + width + ';height:26px;background-color:#1565a9;color:#fff!important" >附件</div>';
	}

	function getHTML_img(isVisib, width) {
		return '<div  id=' + settings.button_placeholder_id + ' style="opacity:' + isVisib + ';width:' + width + ';height:26px;background-color:#1565a9;color:#fff!important" >图片</div>';
	}

	function getHTML(isVisib, width) {
		return '<button  id=' + settings.button_placeholder_id + ' style="visibility:' + isVisib + ';width:' + width + ';height:26px;background-color:#1565a9;color:#fff!important" >选取多个文件 </button>';
	}

	function getHTML_weibo(isVisib) {
		return '<div  id=' + settings.button_placeholder_id + ' style="opacity:' + isVisib + ';background: url(/blog/images/app-attach_wev8.png) no-repeat left -10%;bottom:4px;padding-left:15px;" > 附件(' + settings.file_size_limit+')</div>';
	}
	
	//var nuFieldId = settings.button_placeholder_id.substring(21);
	var nuMovieName = this.movieName;
	//this.newUploader.fieldId = settings.button_placeholder_id.substring(21);
	//this.newUploader.movieName = this.movieName;
	if(getBrowserInfo()) {
		this.newUploader = new plupload.Uploader({
			file_data_name: "Filedata",
			browse_button: settings.button_placeholder_id, //触发文件选择对话框的按钮，为那个元素id
			//container: "field"+nuFieldId+"_tab",
			// drop_element: "field"+nuFieldId+"_tab",
			url: settings.upload_url, //服务器端的上传页面地址
			multipart_params: settings.post_params, //参数
			filters: {
				mime_types: [{
					title: "ALL files or img",
					extensions: settings.file_types.replace(/\*./g,"").replace(/;/g,",")
				}], //最后要修改！！!
				max_file_size: settings.file_size_limit,
				prevent_duplicates: false //允许选取重复文件
			},
			init: {
				PostInit: function() {
					//console.log("this.movieName:",this.movieName);
					this.movieName = nuMovieName;
					//				SWFUpload.prototype.startUpload = function() {
					//					console.log("startUpload走了！")
					//					var _this = SWFUpload.instances[this.movieName];
					//
					//					if(!!_this.newUploader) {
					//						_this.newUploader.start();
					//					}
					//					//uploader.start();
					//
					//					return false;
					//				};
					/*
					SWFUpload.prototype.callFlash = function() {};
					SWFUpload.prototype.getStats = function() {
						var _this = SWFUpload.instances[this.movieName];
						//console.log("new getStats["+_this.fieldId+"]:",_this);
						//return  {files_queued:that.files_queued||1};
						//console.log("uploader:", uploader);
						//files_queued :that.settings.files_queued==0?0:1,
						return {
							files_queued:_this.newUploader.files.length - _this.newUploader.total.uploaded,
							in_progress: _this.newUploader.files.length - _this.newUploader.total.uploaded,
							queue_errors: _this.newUploader.total.failed,
							successful_uploads: _this.newUploader.total.uploaded,
							upload_cancelled: 0,
							upload_errors: 0
						}
					};
					*/
					SWFUpload.prototype.cancelUpload = function(fileID, triggerErrorEvent) {
						var _this = SWFUpload.instances[this.movieName];
						//console.log("new cancelUpload[" + _this.fieldId + "]");
						if(triggerErrorEvent !== false) {
							triggerErrorEvent = true;
						}
						//this.callFlash("CancelUpload", [fileID, triggerErrorEvent]);
						//console.log("fileID",fileID);
						if(!!fileID) {
							_this.newUploader.removeFile(_this.newUploader.getFile(fileID));
						}
						//FileProgress.disappear()
					};
					//					SWFUpload.prototype.uploadError = function(file, errorCode, message) {
					//						var _this = SWFUpload.instances[this.movieName];
					//						//console.log("new uploadError["+_this.fieldId+"]");
					//						file = _this.unescapeFilePostParams(file);
					//						//this.queueEvent("upload_error_handler", [file, errorCode, message]);
					//						uploadError(file, errorCode, message);
					//					};

					SWFUpload.prototype.cancelQueue = function() {
						//console.log("cancelQueue");
						var _this = SWFUpload.instances[this.movieName];
						//console.log("new cancelQueue["+_this.fieldId+"]");
						_this.customSettings.queue_cancelled_flag = true;
						//that.stopUpload();
						_this.newUploader.stop();
						//var _this = this;
						plupload.each(_this.newUploader.files, function(file) {                    
							//console.log("cancelQueue-file",file);
							var progress = new FileProgress(file, _this.customSettings.progressTarget);
							progress.setStatus("Cancelled");
							progress.setCancelled(_this);

							_this.cancelUpload(file.id);
							if(_this.newUploader.files.length > 0) {
								_this.cancelQueue();
							} else {
								document.getElementById(_this.customSettings.cancelButtonId).disabled = true;
								document.getElementById(_this.customSettings.cancelButtonId).style.backgroundColor = "#ccc";
								document.getElementById(_this.customSettings.cancelButtonId).style.cursor = "not-allowed";
							}

						}); 

					};

					FileProgress.prototype.toggleCancel = function(show, swfUploadInstance) {
						//var _this = SWFUpload.instances[this.movieName];
						//console.log("new toggleCancel["+_this.fieldId+"]");
						//console.log("toggleCancel_1:","show",show,"swfUploadInstance",swfUploadInstance,"this",this);
						var _this = this;
						this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
						if(swfUploadInstance) {
							var fileID = this.fileProgressID;
							this.fileProgressElement.childNodes[0].onclick = function() {
								//console.log("点击叉叉了_11","swfUploadInstance:",swfUploadInstance);
								//console.log("_this",_this,"FileProgress",FileProgress);								
								_this.disappear();
								swfUploadInstance.cancelUpload(fileID);
								return false;
							};
						}
					};

				},

				FilesAdded: function(up, files) {
					if(up.files.length > settings.file_upload_limit) {
						var _this = SWFUpload.instances[this.movieName];
						//console.log("up1",up,"files",files);
						up.files.splice(settings.file_upload_limit, up.files.length - settings.file_upload_limit);
						//console.log("up2",up,"files",files);
						plupload.each(up.files, function(file) {
							//that.fileQueued(file[i]);
							_this.queueEvent("file_queued_handler", file);                
						});
						_this.fileDialogComplete(up.queued, up.queued);
						alert('只能上传' + settings.file_upload_limit + '个文件');
						up.destroy();
						return false;
					} else {
						//console.log("FilesAdded走了");
						var _this = SWFUpload.instances[this.movieName];
						//console.log("new FilesAdded["+_this.fieldId+"]");
						//console.log("_this:",_this);
						plupload.each(up.files, function(file) {
							//uploader.addFile(file, file.name);
							_this.fileQueued(file);
							//_this.queueEvent("file_queued_handler", file);                
						});
						//console.log("up.total.queued",up.total.queued);
						_this.fileDialogComplete(files.length, files.length);
					}

				},
				FilesRemoved: function(up, files) { 
					var _this = SWFUpload.instances[this.movieName];
					//console.log("new FilesRemoved[" + _this.fieldId + "]");                
					plupload.each(files, function(file) {                    
						//console.log('[FilesRemoved]  File:', file);

						//uploadError(file, uploader.files.length);

					});         

				},
				UploadFile: function(up, file) {
					var _this = SWFUpload.instances[this.movieName];
					//console.log("new UploadFile["+_this.fieldId+"]");  
					_this.uploadStart(file);
				},

				UploadProgress: function(up, file) {     
					var _this = SWFUpload.instances[this.movieName];
					//console.log("new UploadProgress[" + _this.fieldId + "]");             
					//console.log('File:', file, "Total:", up.total);
					_this.uploadProgress(file, up.total.loaded, up.total.size);
					if(up.total.loaded < up.total.size) {
						_this.uploadProgress(file, up.total.size, up.total.size);
					}
					//settings.upload_progress_handler(file, up.total.loaded, up.total.size);          
				},
				QueueChanged: function(up) {
					var _this = SWFUpload.instances[this.movieName];
					//console.log("new QueueChanged[" + _this.fieldId + "]");                 
					//console.log('[QueueChanged]');            
				},
				BeforeUpload: function(up, file) {
					var _this = SWFUpload.instances[this.movieName];
					//console.log("new BeforeUpload[" + _this.fieldId + "]");  
				},

				UploadComplete: function(up, file) {
					var _this = SWFUpload.instances[this.movieName];
					//console.log("new UploadComplete[" + _this.fieldId + "]"); 
					//console.log("UploadComplete-file", file);
					//that.uploadComplete(file);
					//up.destroy();
				},
				FileUploaded: function(up, file, responseObj) {    
					var _this = SWFUpload.instances[this.movieName];
					//console.log("new FileUploaded1[" + _this.fieldId + "]");             
					//console.log('[FileUploaded] File222:', file, "response:", responseObj);
					_this.uploadSuccess(file, responseObj.response);
					_this.uploadComplete(file);            
				},
				 
				Destroy: function(up) {
					// Called when uploader is destroyed
					var _this = SWFUpload.instances[this.movieName];
					//console.log("[Destroy][" + _this.fieldId + "]");

				},
				Error: function(up, errObject) {                
					alert("\nError #" + errObject.code + ": " + errObject.message);
					//uploadError(errObject.file, errObject.code, errObject.message);
					//var progress = new FileProgress(errObject.file, that.customSettings.progressTarget);
					//progress.setStatus("Upload limit exceeded.");

				}            
			}
		});

		//this.newUploader.fieldId = settings.button_placeholder_id.substring(21);
		//this.newUploader.movieName = this.movieName;
		this.newUploader.init();
		//console.log("NewUploads["+this.fieldId+"]:",this.newUploader);
	}

}

/* *************** */
/* Static Members  */
/* *************** */
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.2.0 Beta 3";
SWFUpload.QUEUE_ERROR = {
	QUEUE_LIMIT_EXCEEDED: -100,
	FILE_EXCEEDS_SIZE_LIMIT: -110,
	ZERO_BYTE_FILE: -120,
	INVALID_FILETYPE: -130
};
SWFUpload.UPLOAD_ERROR = {
	HTTP_ERROR: -200,
	MISSING_UPLOAD_URL: -210,
	IO_ERROR: -220,
	SECURITY_ERROR: -230,
	UPLOAD_LIMIT_EXCEEDED: -240,
	UPLOAD_FAILED: -250,
	SPECIFIED_FILE_ID_NOT_FOUND: -260,
	FILE_VALIDATION_FAILED: -270,
	FILE_CANCELLED: -280,
	UPLOAD_STOPPED: -290
};
SWFUpload.FILE_STATUS = {
	QUEUED: -1,
	IN_PROGRESS: -2,
	ERROR: -3,
	COMPLETE: -4,
	CANCELLED: -5
};
SWFUpload.BUTTON_ACTION = {
	SELECT_FILE: -100,
	SELECT_FILES: -110,
	START_UPLOAD: -120
};
SWFUpload.CURSOR = {
	ARROW: -1,
	HAND: -2
};
SWFUpload.WINDOW_MODE = {
	WINDOW: "window",
	TRANSPARENT: "transparent",
	OPAQUE: "opaque"
};

/* ******************** */
/* Instance Members  */
/* ******************** */

// Private: initSettings ensures that all the
// settings are set, getting a default value if one was not assigned.
SWFUpload.prototype.initSettings = function() {
	this.ensureDefault = function(settingName, defaultValue) {
		this.settings[settingName] = (this.settings[settingName] == undefined) ? defaultValue : this.settings[settingName];
	};

	// Upload backend settings
	this.ensureDefault("upload_url", "");
	this.ensureDefault("file_post_name", "Filedata");
	this.ensureDefault("post_params", {});
	this.ensureDefault("use_query_string", false);
	this.ensureDefault("requeue_on_error", false);
	this.ensureDefault("http_success", []);

	// File Settings
	this.ensureDefault("file_types", "*.*");
	this.ensureDefault("file_types_description", "All Files");
	this.ensureDefault("file_size_limit", 0); // Default zero means "unlimited"
	this.ensureDefault("file_upload_limit", 0);
	this.ensureDefault("file_queue_limit", 0);

	// Flash Settings
	this.ensureDefault("flash_url", "swfupload.swf");
	this.ensureDefault("prevent_swf_caching", true);

	// Button Settings
	this.ensureDefault("button_image_url", "");
	this.ensureDefault("button_width", 1);
	this.ensureDefault("button_height", 1);
	this.ensureDefault("button_text", "");
	this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
	this.ensureDefault("button_text_top_padding", 0);
	this.ensureDefault("button_text_left_padding", 0);
	this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
	this.ensureDefault("button_disabled", false);
	this.ensureDefault("button_placeholder_id", null);
	this.ensureDefault("button_cursor", SWFUpload.CURSOR.ARROW);
	this.ensureDefault("button_window_mode", SWFUpload.WINDOW_MODE.WINDOW);

	// Debug Settings
	this.ensureDefault("debug", false);
	this.settings.debug_enabled = this.settings.debug; // Here to maintain v2 API

	// Event Handlers
	this.settings.return_upload_start_handler = this.returnUploadStart;
	this.ensureDefault("swfupload_loaded_handler", null);
	this.ensureDefault("file_dialog_start_handler", null);
	this.ensureDefault("file_queued_handler", null);
	this.ensureDefault("file_queue_error_handler", null);
	this.ensureDefault("file_dialog_complete_handler", null);

	this.ensureDefault("upload_start_handler", null);
	this.ensureDefault("upload_progress_handler", null);
	this.ensureDefault("upload_error_handler", null);
	this.ensureDefault("upload_success_handler", null);
	this.ensureDefault("upload_complete_handler", null);

	this.ensureDefault("debug_handler", this.debugMessage);

	this.ensureDefault("custom_settings", {});

	// Other settings
	this.customSettings = this.settings.custom_settings;

	// Update the flash url if needed
	if(this.settings.prevent_swf_caching) {
		this.settings.flash_url = this.settings.flash_url + "?swfuploadrnd=" + Math.floor(Math.random() * 999999999);
	}

	delete this.ensureDefault;
};

SWFUpload.prototype.loadFlash = function() {
	if(this.settings.button_placeholder_id !== "") {
		this.replaceWithFlash();
	} else {
		this.appendFlash();
	}
};

// Private: appendFlash gets the HTML tag for the Flash
// It then appends the flash to the body
SWFUpload.prototype.appendFlash = function() {
	var targetElement, container;

	// Make sure an element with the ID we are going to use doesn't already exist
	if(document.getElementById(this.movieName) !== null) {
		throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
	}

	// Get the body tag where we will be adding the flash movie
	targetElement = document.getElementsByTagName("body")[0];

	if(targetElement == undefined) {
		throw "Could not find the 'body' element.";
	}

	// Append the container and load the flash
	container = document.createElement("div");
	container.style.width = "1px";
	container.style.height = "1px";
	container.style.overflow = "hidden";

	targetElement.appendChild(container);
	container.innerHTML = this.getFlashHTML(); // Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)

	// Fix IE Flash/Form bug
	if(window[this.movieName] == undefined) {
		window[this.movieName] = this.getMovieElement();
	}

};

// Private: replaceWithFlash replaces the button_placeholder element with the flash movie.
SWFUpload.prototype.replaceWithFlash = function() {
	var targetElement, tempParent;

	// Make sure an element with the ID we are going to use doesn't already exist
	if(document.getElementById(this.movieName) !== null) {
		throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
	}

	// Get the element where we will be placing the flash movie
	targetElement = document.getElementById(this.settings.button_placeholder_id);

	if(targetElement == undefined) {
		throw "Could not find the placeholder element.";
	}

	// Append the container and load the flash
	tempParent = document.createElement("div");
	tempParent.innerHTML = this.getFlashHTML(); // Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)
	targetElement.parentNode.replaceChild(tempParent.firstChild, targetElement);

	// Fix IE Flash/Form bug
	if(window[this.movieName] == undefined) {
		window[this.movieName] = this.getMovieElement();
	}

};

// Private: getFlashHTML generates the object tag needed to embed the flash in to the document
SWFUpload.prototype.getFlashHTML = function() {
	var myclass = '';
	if(navigator.userAgent.indexOf("MSIE") > 0) {
		myclass = 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"';
	}
	// Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
	return ['<object ' + myclass + ' id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.settings.flash_url, '" style="width:', this.settings.button_width, 'px;height:', this.settings.button_height, 'px;" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload">',
		'<param name="wmode" value="', this.settings.button_window_mode, '" />',
		'<param name="movie" value="', this.settings.flash_url, '" />',
		'<param name="quality" value="high" />',
		'<param name="menu" value="false" />',
		'<param name="allowScriptAccess" value="always" />',
		'<param name="flashvars" value="' + this.getFlashVars() + '" />',
		'</object>'
	].join("");
};

// Private: getFlashVars builds the parameter string that will be passed
// to flash in the flashvars param.
SWFUpload.prototype.getFlashVars = function() {
	// Build a string from the post param object
	var paramString = this.buildParamString();
	var httpSuccessString = this.settings.http_success.join(",");

	// Build the parameter string
	return ["movieName=", encodeURIComponent(this.movieName),
		"&amp;uploadURL=", encodeURIComponent(this.settings.upload_url),
		"&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string),
		"&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error),
		"&amp;httpSuccess=", encodeURIComponent(httpSuccessString),
		"&amp;params=", encodeURIComponent(paramString),
		"&amp;filePostName=", encodeURIComponent(this.settings.file_post_name),
		"&amp;fileTypes=", encodeURIComponent(this.settings.file_types),
		"&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description),
		"&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit),
		"&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit),
		"&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit),
		"&amp;debugEnabled=", encodeURIComponent(this.settings.debug_enabled),
		"&amp;buttonImageURL=", encodeURIComponent(this.settings.button_image_url),
		"&amp;buttonWidth=", encodeURIComponent(this.settings.button_width),
		"&amp;buttonHeight=", encodeURIComponent(this.settings.button_height),
		"&amp;buttonText=", encodeURIComponent(this.settings.button_text),
		"&amp;buttonTextTopPadding=", encodeURIComponent(this.settings.button_text_top_padding),
		"&amp;buttonTextLeftPadding=", encodeURIComponent(this.settings.button_text_left_padding),
		"&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style),
		"&amp;buttonAction=", encodeURIComponent(this.settings.button_action),
		"&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled),
		"&amp;buttonCursor=", encodeURIComponent(this.settings.button_cursor)
	].join("");
};

// Public: getMovieElement retrieves the DOM reference to the Flash element added by SWFUpload
// The element is cached after the first lookup
SWFUpload.prototype.getMovieElement = function() {
	if(this.movieElement == undefined) {
		this.movieElement = document.getElementById(this.movieName);
	}

	if(this.movieElement === null) {
		throw "Could not find Flash element";
	}

	return this.movieElement;
};

// Private: buildParamString takes the name/value pairs in the post_params setting object
// and joins them up in to a string formatted "name=value&amp;name=value"
SWFUpload.prototype.buildParamString = function() {
	var postParams = this.settings.post_params;
	var paramStringPairs = [];

	if(typeof(postParams) === "object") {
		for(var name in postParams) {
			if(postParams.hasOwnProperty(name)) {
				paramStringPairs.push(encodeURIComponent(name.toString()) + "=" + encodeURIComponent(postParams[name].toString()));
			}
		}
	}

	return paramStringPairs.join("&amp;");
};

// Public: Used to remove a SWFUpload instance from the page. This method strives to remove
// all references to the SWF, and other objects so memory is properly freed.
// Returns true if everything was destroyed. Returns a false if a failure occurs leaving SWFUpload in an inconsistant state.
// Credits: Major improvements provided by steffen
SWFUpload.prototype.destroy = function() {
	try {
		// Make sure Flash is done before we try to remove it
		this.cancelUpload(null, false);

		// Remove the SWFUpload DOM nodes
		var movieElement = null;
		movieElement = this.getMovieElement();

		if(movieElement) {
			// Loop through all the movie's properties and remove all function references (DOM/JS IE 6/7 memory leak workaround)
			for(var i in movieElement) {
				try {
					if(typeof(movieElement[i]) === "function") {
						movieElement[i] = null;
					}
				} catch(ex1) {}
			}

			// Remove the Movie Element from the page
			try {
				movieElement.parentNode.removeChild(movieElement);
			} catch(ex) {}
		}

		// Remove IE form fix reference
		window[this.movieName] = null;

		// Destroy other references
		SWFUpload.instances[this.movieName] = null;
		delete SWFUpload.instances[this.movieName];

		this.movieElement = null;
		this.settings = null;
		this.customSettings = null;
		this.eventQueue = null;
		this.movieName = null;

		return true;
	} catch(ex1) {
		return false;
	}
};

// Public: displayDebugInfo prints out settings and configuration
// information about this SWFUpload instance.
// This function (and any references to it) can be deleted when placing
// SWFUpload in production.
SWFUpload.prototype.displayDebugInfo = function() {
	this.debug(
		[
			"---SWFUpload Instance Info---\n",
			"Version: ", SWFUpload.version, "\n",
			"Movie Name: ", this.movieName, "\n",
			"Settings:\n",
			"\t", "upload_url:               ", this.settings.upload_url, "\n",
			"\t", "flash_url:                ", this.settings.flash_url, "\n",
			"\t", "use_query_string:         ", this.settings.use_query_string.toString(), "\n",
			"\t", "requeue_on_error:         ", this.settings.requeue_on_error.toString(), "\n",
			"\t", "http_success:             ", this.settings.http_success.join(", "), "\n",
			"\t", "file_post_name:           ", this.settings.file_post_name, "\n",
			"\t", "post_params:              ", this.settings.post_params.toString(), "\n",
			"\t", "file_types:               ", this.settings.file_types, "\n",
			"\t", "file_types_description:   ", this.settings.file_types_description, "\n",
			"\t", "file_size_limit:          ", this.settings.file_size_limit, "\n",
			"\t", "file_upload_limit:        ", this.settings.file_upload_limit, "\n",
			"\t", "file_queue_limit:         ", this.settings.file_queue_limit, "\n",
			"\t", "debug:                    ", this.settings.debug.toString(), "\n",

			"\t", "prevent_swf_caching:      ", this.settings.prevent_swf_caching.toString(), "\n",

			"\t", "button_placeholder_id:    ", this.settings.button_placeholder_id.toString(), "\n",
			"\t", "button_image_url:         ", this.settings.button_image_url.toString(), "\n",
			"\t", "button_width:             ", this.settings.button_width.toString(), "\n",
			"\t", "button_height:            ", this.settings.button_height.toString(), "\n",
			"\t", "button_text:              ", this.settings.button_text.toString(), "\n",
			"\t", "button_text_style:        ", this.settings.button_text_style.toString(), "\n",
			"\t", "button_text_top_padding:  ", this.settings.button_text_top_padding.toString(), "\n",
			"\t", "button_text_left_padding: ", this.settings.button_text_left_padding.toString(), "\n",
			"\t", "button_action:            ", this.settings.button_action.toString(), "\n",
			"\t", "button_disabled:          ", this.settings.button_disabled.toString(), "\n",

			"\t", "custom_settings:          ", this.settings.custom_settings.toString(), "\n",
			"Event Handlers:\n",
			"\t", "swfupload_loaded_handler assigned:  ", (typeof this.settings.swfupload_loaded_handler === "function").toString(), "\n",
			"\t", "file_dialog_start_handler assigned: ", (typeof this.settings.file_dialog_start_handler === "function").toString(), "\n",
			"\t", "file_queued_handler assigned:       ", (typeof this.settings.file_queued_handler === "function").toString(), "\n",
			"\t", "file_queue_error_handler assigned:  ", (typeof this.settings.file_queue_error_handler === "function").toString(), "\n",
			"\t", "upload_start_handler assigned:      ", (typeof this.settings.upload_start_handler === "function").toString(), "\n",
			"\t", "upload_progress_handler assigned:   ", (typeof this.settings.upload_progress_handler === "function").toString(), "\n",
			"\t", "upload_error_handler assigned:      ", (typeof this.settings.upload_error_handler === "function").toString(), "\n",
			"\t", "upload_success_handler assigned:    ", (typeof this.settings.upload_success_handler === "function").toString(), "\n",
			"\t", "upload_complete_handler assigned:   ", (typeof this.settings.upload_complete_handler === "function").toString(), "\n",
			"\t", "debug_handler assigned:             ", (typeof this.settings.debug_handler === "function").toString(), "\n"
		].join("")
	);
};

/* Note: addSetting and getSetting are no longer used by SWFUpload but are included
	the maintain v2 API compatibility
*/
// Public: (Deprecated) addSetting adds a setting value. If the value given is undefined or null then the default_value is used.
SWFUpload.prototype.addSetting = function(name, value, default_value) {
	if(value == undefined) {
		return(this.settings[name] = default_value);
	} else {
		return(this.settings[name] = value);
	}
};

// Public: (Deprecated) getSetting gets a setting. Returns an empty string if the setting was not found.
SWFUpload.prototype.getSetting = function(name) {
	if(this.settings[name] != undefined) {
		return this.settings[name];
	}

	return "";
};

// Private: callFlash handles function calls made to the Flash element.
// Calls are made with a setTimeout for some functions to work around
// bugs in the ExternalInterface library.
SWFUpload.prototype.callFlash = function(functionName, argumentArray) {
	argumentArray = argumentArray || [];

	var movieElement = this.getMovieElement();
	var returnValue, returnString;

	// Flash's method if calling ExternalInterface methods (code adapted from MooTools).
	try {
		returnString = movieElement.CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(argumentArray, 0) + '</invoke>');
		returnValue = eval(returnString);
	} catch(ex) {
		throw "Call to " + functionName + " failed";
	}

	// Unescape file post param values
	if(returnValue != undefined && typeof returnValue.post === "object") {
		returnValue = this.unescapeFilePostParams(returnValue);
	}

	return returnValue;
};

/* *****************************
	-- Flash control methods --
	Your UI should use these
	to operate SWFUpload
   ***************************** */

// WARNING: this function does not work in Flash Player 10
// Public: selectFile causes a File Selection Dialog window to appear.  This
// dialog only allows 1 file to be selected.
SWFUpload.prototype.selectFile = function() {
	this.callFlash("SelectFile");
};

// WARNING: this function does not work in Flash Player 10
// Public: selectFiles causes a File Selection Dialog window to appear/ This
// dialog allows the user to select any number of files
// Flash Bug Warning: Flash limits the number of selectable files based on the combined length of the file names.
// If the selection name length is too long the dialog will fail in an unpredictable manner.  There is no work-around
// for this bug.
SWFUpload.prototype.selectFiles = function() {
	this.callFlash("SelectFiles");
};

// Public: startUpload starts uploading the first file in the queue unless
// the optional parameter 'fileID' specifies the ID 

SWFUpload.prototype.startUpload = function(fileID) {
	//console.log("startUpload走——原始");
	if(getBrowserInfo() && typeof this.settings.button_placeholder_id != "object") {
		//console.log("sb1");
		//var _this = SWFUpload.instances[this.movieName];
		var _this = this;
		if(!!_this.newUploader) {
			_this.newUploader.start();
		}
		return false;
	} else {
		//console.log("startUpload 走 flash");
		this.callFlash("StartUpload", [fileID]);
	}

};

// Public: cancelUpload cancels any queued file.  The fileID parameter may be the file ID or index.
// If you do not specify a fileID the current uploading file or first file in the queue is cancelled.
// If you do not want the uploadError event to trigger you can specify false for the triggerErrorEvent parameter.
SWFUpload.prototype.cancelUpload = function(fileID, triggerErrorEvent) {
	if(getBrowserInfo() && typeof this.settings.button_placeholder_id != "object") {
		//var _this = SWFUpload.instances[this.movieName];
		var _this = this;
		if(triggerErrorEvent !== false) {
			triggerErrorEvent = true;
		}
		//this.callFlash("CancelUpload", [fileID, triggerErrorEvent]);
		//console.log("fileID",fileID);
		if(!!fileID) {
			_this.newUploader.removeFile(_this.newUploader.getFile(fileID));
		}
	} else {
		if(triggerErrorEvent !== false) {
			triggerErrorEvent = true;
		}
		this.callFlash("CancelUpload", [fileID, triggerErrorEvent]);
	}

};

// Public: stopUpload stops the current upload and requeues the file at the beginning of the queue.
// If nothing is currently uploading then nothing happens.
SWFUpload.prototype.stopUpload = function() {
	this.callFlash("StopUpload");
};

/* ************************
 * Settings methods
 *   These methods change the SWFUpload settings.
 *   SWFUpload settings should not be changed directly on the settings object
 *   since many of the settings need to be passed to Flash in order to take
 *   effect.
 * *********************** */

// Public: getStats gets the file statistics object.
SWFUpload.prototype.getStats = function() {
	if(getBrowserInfo() && typeof this.settings.button_placeholder_id != "object") {
		//var _this = SWFUpload.instances[this.movieName];
		var _this = this;
		return {
			files_queued: _this.newUploader.files.length - _this.newUploader.total.uploaded,
			in_progress: _this.newUploader.files.length - _this.newUploader.total.uploaded,
			queue_errors: _this.newUploader.total.failed,
			successful_uploads: _this.newUploader.total.uploaded,
			upload_cancelled: 0,
			upload_errors: 0
		}
	} else {
		//alert("getStats 走 flash");
		return this.callFlash("GetStats");
	}

};

// Public: setStats changes the SWFUpload statistics.  You shouldn't need to 
// change the statistics but you can.  Changing the statistics does not
// affect SWFUpload accept for the successful_uploads count which is used
// by the upload_limit setting to determine how many files the user may upload.
SWFUpload.prototype.setStats = function(statsObject) {
	this.callFlash("SetStats", [statsObject]);
};

// Public: getFile retrieves a File object by ID or Index.  If the file is
// not found then 'null' is returned.
SWFUpload.prototype.getFile = function(fileID) {
	if(typeof(fileID) === "number") {
		return this.callFlash("GetFileByIndex", [fileID]);
	} else {
		return this.callFlash("GetFile", [fileID]);
	}
};

// Public: addFileParam sets a name/value pair that will be posted with the
// file specified by the Files ID.  If the name already exists then the
// exiting value will be overwritten.
SWFUpload.prototype.addFileParam = function(fileID, name, value) {
	return this.callFlash("AddFileParam", [fileID, name, value]);
};

// Public: removeFileParam removes a previously set (by addFileParam) name/value
// pair from the specified file.
SWFUpload.prototype.removeFileParam = function(fileID, name) {
	this.callFlash("RemoveFileParam", [fileID, name]);
};

// Public: setUploadUrl changes the upload_url setting.
SWFUpload.prototype.setUploadURL = function(url) {
	this.settings.upload_url = url.toString();
	this.callFlash("SetUploadURL", [url]);
};

// Public: setPostParams changes the post_params setting
SWFUpload.prototype.setPostParams = function(paramsObject) {
	this.settings.post_params = paramsObject;
	this.callFlash("SetPostParams", [paramsObject]);
};

// Public: addPostParam adds post name/value pair.  Each name can have only one value.
SWFUpload.prototype.addPostParam = function(name, value) {
	this.settings.post_params[name] = value;
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: removePostParam deletes post name/value pair.
SWFUpload.prototype.removePostParam = function(name) {
	delete this.settings.post_params[name];
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: setFileTypes changes the file_types setting and the file_types_description setting
SWFUpload.prototype.setFileTypes = function(types, description) {
	this.settings.file_types = types;
	this.settings.file_types_description = description;
	this.callFlash("SetFileTypes", [types, description]);
};

// Public: setFileSizeLimit changes the file_size_limit setting
SWFUpload.prototype.setFileSizeLimit = function(fileSizeLimit) {
	this.settings.file_size_limit = fileSizeLimit;
	this.callFlash("SetFileSizeLimit", [fileSizeLimit]);
};

// Public: setFileUploadLimit changes the file_upload_limit setting
SWFUpload.prototype.setFileUploadLimit = function(fileUploadLimit) {
	this.settings.file_upload_limit = fileUploadLimit;
	this.callFlash("SetFileUploadLimit", [fileUploadLimit]);
};

// Public: setFileQueueLimit changes the file_queue_limit setting
SWFUpload.prototype.setFileQueueLimit = function(fileQueueLimit) {
	this.settings.file_queue_limit = fileQueueLimit;
	this.callFlash("SetFileQueueLimit", [fileQueueLimit]);
};

// Public: setFilePostName changes the file_post_name setting
SWFUpload.prototype.setFilePostName = function(filePostName) {
	this.settings.file_post_name = filePostName;
	this.callFlash("SetFilePostName", [filePostName]);
};

// Public: setUseQueryString changes the use_query_string setting
SWFUpload.prototype.setUseQueryString = function(useQueryString) {
	this.settings.use_query_string = useQueryString;
	this.callFlash("SetUseQueryString", [useQueryString]);
};

// Public: setRequeueOnError changes the requeue_on_error setting
SWFUpload.prototype.setRequeueOnError = function(requeueOnError) {
	this.settings.requeue_on_error = requeueOnError;
	this.callFlash("SetRequeueOnError", [requeueOnError]);
};

// Public: setHTTPSuccess changes the http_success setting
SWFUpload.prototype.setHTTPSuccess = function(http_status_codes) {
	if(typeof http_status_codes === "string") {
		http_status_codes = http_status_codes.replace(" ", "").split(",");
	}

	this.settings.http_success = http_status_codes;
	this.callFlash("SetHTTPSuccess", [http_status_codes]);
};

// Public: setDebugEnabled changes the debug_enabled setting
SWFUpload.prototype.setDebugEnabled = function(debugEnabled) {
	this.settings.debug_enabled = debugEnabled;
	this.callFlash("SetDebugEnabled", [debugEnabled]);
};

// Public: setButtonImageURL loads a button image sprite
SWFUpload.prototype.setButtonImageURL = function(buttonImageURL) {
	if(buttonImageURL == undefined) {
		buttonImageURL = "";
	}

	this.settings.button_image_url = buttonImageURL;
	this.callFlash("SetButtonImageURL", [buttonImageURL]);
};

// Public: setButtonDimensions resizes the Flash Movie and button
SWFUpload.prototype.setButtonDimensions = function(width, height) {
	this.settings.button_width = width;
	this.settings.button_height = height;

	var movie = this.getMovieElement();
	if(movie != undefined) {
		movie.style.width = width + "px";
		movie.style.height = height + "px";
	}

	this.callFlash("SetButtonDimensions", [width, height]);
};
// Public: setButtonText Changes the text overlaid on the button
SWFUpload.prototype.setButtonText = function(html) {
	this.settings.button_text = html;
	this.callFlash("SetButtonText", [html]);
};
// Public: setButtonTextPadding changes the top and left padding of the text overlay
SWFUpload.prototype.setButtonTextPadding = function(left, top) {
	this.settings.button_text_top_padding = top;
	this.settings.button_text_left_padding = left;
	this.callFlash("SetButtonTextPadding", [left, top]);
};

// Public: setButtonTextStyle changes the CSS used to style the HTML/Text overlaid on the button
SWFUpload.prototype.setButtonTextStyle = function(css) {
	this.settings.button_text_style = css;
	this.callFlash("SetButtonTextStyle", [css]);
};
// Public: setButtonDisabled disables/enables the button
SWFUpload.prototype.setButtonDisabled = function(isDisabled) {
	this.settings.button_disabled = isDisabled;
	this.callFlash("SetButtonDisabled", [isDisabled]);
};
// Public: setButtonAction sets the action that occurs when the button is clicked
SWFUpload.prototype.setButtonAction = function(buttonAction) {
	this.settings.button_action = buttonAction;
	this.callFlash("SetButtonAction", [buttonAction]);
};

// Public: setButtonCursor changes the mouse cursor displayed when hovering over the button
SWFUpload.prototype.setButtonCursor = function(cursor) {
	this.settings.button_cursor = cursor;
	this.callFlash("SetButtonCursor", [cursor]);
};

/* *******************************
	Flash Event Interfaces
	These functions are used by Flash to trigger the various
	events.
	
	All these functions a Private.
	
	Because the ExternalInterface library is buggy the event calls
	are added to a queue and the queue then executed by a setTimeout.
	This ensures that events are executed in a determinate order and that
	the ExternalInterface bugs are avoided.
******************************* */

SWFUpload.prototype.queueEvent = function(handlerName, argumentArray) {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop

	if(argumentArray == undefined) {
		argumentArray = [];
	} else if(!(argumentArray instanceof Array)) {
		argumentArray = [argumentArray];
	}

	var self = this;
	if(typeof this.settings[handlerName] === "function") {
		// Queue the event
		this.eventQueue.push(function() {
			this.settings[handlerName].apply(this, argumentArray);
		});

		// Execute the next queued event
		setTimeout(function() {
			self.executeNextEvent();
		}, 0);

	} else if(this.settings[handlerName] !== null) {
		throw "Event handler " + handlerName + " is unknown or is not a function";
	}
};

// Private: Causes the next event in the queue to be executed.  Since events are queued using a setTimeout
// we must queue them in order to garentee that they are executed in order.
SWFUpload.prototype.executeNextEvent = function() {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop

	var f = this.eventQueue ? this.eventQueue.shift() : null;
	if(typeof(f) === "function") {
		f.apply(this);
	}
};

// Private: unescapeFileParams is part of a workaround for a flash bug where objects passed through ExternalInterface cannot have
// properties that contain characters that are not valid for JavaScript identifiers. To work around this
// the Flash Component escapes the parameter names and we must unescape again before passing them along.
SWFUpload.prototype.unescapeFilePostParams = function(file) {
	var reg = /[$]([0-9a-f]{4})/i;
	var unescapedPost = {};
	var uk;

	if(file != undefined) {
		for(var k in file.post) {
			if(file.post.hasOwnProperty(k)) {
				uk = k;
				var match;
				while((match = reg.exec(uk)) !== null) {
					uk = uk.replace(match[0], String.fromCharCode(parseInt("0x" + match[1], 16)));
				}
				unescapedPost[uk] = file.post[k];
			}
		}

		file.post = unescapedPost;
	}

	return file;
};

SWFUpload.prototype.flashReady = function() {
	// Check that the movie element is loaded correctly with its ExternalInterface methods defined
	var movieElement = this.getMovieElement();

	// Pro-actively unhook all the Flash functions
	if(typeof(movieElement.CallFunction) === "unknown") { // We only want to do this in IE
		this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
		for(var key in movieElement) {
			try {
				if(typeof(movieElement[key]) === "function") {
					movieElement[key] = null;
				}
			} catch(ex) {}
		}
	}

	this.queueEvent("swfupload_loaded_handler");
};

/* This is a chance to do something before the browse window opens */
SWFUpload.prototype.fileDialogStart = function() {
	this.queueEvent("file_dialog_start_handler");
};

/* Called when a file is successfully added to the queue. */
SWFUpload.prototype.fileQueued = function(file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queued_handler", file);
};

/* Handle errors that occur when an attempt to queue a file fails. */
SWFUpload.prototype.fileQueueError = function(file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queue_error_handler", [file, errorCode, message]);
};

/* Called after the file dialog has closed and the selected files have been queued.
	You could call startUpload here if you want the queued files to begin uploading immediately. */
SWFUpload.prototype.fileDialogComplete = function(numFilesSelected, numFilesQueued) {
	this.queueEvent("file_dialog_complete_handler", [numFilesSelected, numFilesQueued]);
};

SWFUpload.prototype.uploadStart = function(file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("return_upload_start_handler", file);
};

SWFUpload.prototype.returnUploadStart = function(file) {
	var returnValue;
	if(typeof this.settings.upload_start_handler === "function") {
		file = this.unescapeFilePostParams(file);
		returnValue = this.settings.upload_start_handler.call(this, file);
	} else if(this.settings.upload_start_handler != undefined) {
		throw "upload_start_handler must be a function";
	}

	// Convert undefined to true so if nothing is returned from the upload_start_handler it is
	// interpretted as 'true'.
	if(returnValue === undefined) {
		returnValue = true;
	}

	returnValue = !!returnValue;

	this.callFlash("ReturnUploadStart", [returnValue]);
};

SWFUpload.prototype.uploadProgress = function(file, bytesComplete, bytesTotal) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_progress_handler", [file, bytesComplete, bytesTotal]);
};

SWFUpload.prototype.uploadError = function(file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_error_handler", [file, errorCode, message]);
};

SWFUpload.prototype.uploadSuccess = function(file, serverData) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_success_handler", [file, serverData]);
};

SWFUpload.prototype.uploadComplete = function(file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_complete_handler", file);
};

/* Called by SWFUpload JavaScript and Flash functions when debug is enabled. By default it writes messages to the
   internal debug console.  You can override this event and have messages written where you want. */
SWFUpload.prototype.debug = function(message) {
	this.queueEvent("debug_handler", message);
};

/* **********************************
	Debug Console
	The debug console is a self contained, in page location
	for debug message to be sent.  The Debug Console adds
	itself to the body if necessary.

	The console is automatically scrolled as messages appear.
	
	If you are using your own debug handler or when you deploy to production and
	have debug disabled you can remove these functions to reduce the file size
	and complexity.
********************************** */

// Private: debugMessage is the default debug_handler.  If you want to print debug messages
// call the debug() function.  When overriding the function your own function should
// check to see if the debug setting is true before outputting debug information.
SWFUpload.prototype.debugMessage = function(message) {
	if(this.settings.debug) {
		var exceptionMessage, exceptionValues = [];

		// Check for an exception object and print it nicely
		if(typeof message === "object" && typeof message.name === "string" && typeof message.message === "string") {
			for(var key in message) {
				if(message.hasOwnProperty(key)) {
					exceptionValues.push(key + ": " + message[key]);
				}
			}
			exceptionMessage = exceptionValues.join("\n") || "";
			exceptionValues = exceptionMessage.split("\n");
			exceptionMessage = "EXCEPTION: " + exceptionValues.join("\nEXCEPTION: ");
			SWFUpload.Console.writeLine(exceptionMessage);
		} else {
			SWFUpload.Console.writeLine(message);
		}
	}
};

SWFUpload.Console = {};
SWFUpload.Console.writeLine = function(message) {
	var console, documentForm;

	try {
		console = document.getElementById("SWFUpload_Console");

		if(!console) {
			documentForm = document.createElement("form");
			document.getElementsByTagName("body")[0].appendChild(documentForm);

			console = document.createElement("textarea");
			console.id = "SWFUpload_Console";
			console.style.fontFamily = "monospace";
			console.setAttribute("wrap", "off");
			console.wrap = "off";
			console.style.overflow = "auto";
			console.style.width = "700px";
			console.style.height = "350px";
			console.style.margin = "5px";
			documentForm.appendChild(console);
		}

		console.value += message + "\n";

		console.scrollTop = console.scrollHeight - console.clientHeight;
	} catch(ex) {
		alert("Exception: " + ex.name + " Message: " + ex.message);
	}
};

window.SWFUpload = SWFUpload;