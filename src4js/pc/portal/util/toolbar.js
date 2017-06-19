/** --------- 元素工具栏功能js函数 -----------**/
//刷新元素
function onRefresh(eid,ebaseid){
    if(typeof elementsRefresh === 'object' && typeof elementsRefresh[eid] === 'function') elementsRefresh[eid]();
}

function onSetting(eid, ebaseid) {
  // 获取设置页面内容
  var settingUrl = "/page/element/setting.jsp"
    + "?eid="+ eid
    + "&ebaseid="+ ebaseid
    + "&hpid=" + global_hpid
    + "&subcompanyid=" + global_subCompanyId;
  $.post(settingUrl, null, function(data) {
    if ($.trim(data) != "") {
      $("#setting_" + eid).hide();
      $("#setting_" + eid).remove();
      $("#content_" + eid).prepend($.trim(data));
      
      $(".tabs").PortalTabs({
        getLine : 1,
        topHeight : 40
      });
      $(".tab_box").height(0);
      
      $("#setting_" + eid).show();
      $("#weavertabs-content-" + eid).show();
      var urlContent = $.trim($("#weavertabs-content-" + eid).attr("url")).replace(/&amp;/g, "&");
      var urlStyle = $.trim($("#weavertabs-style-" + eid).attr("url")).replace(/&amp;/g, "&");
      var urlShare = $.trim($("#weavertabs-share-" + eid).attr("url")).replace(/&amp;/g, "&");
      if (urlContent != "") {
        var randomValue = new Date().getTime();
        
        if (ebaseid == 7 || ebaseid == 8 || ebaseid == 1 || ebaseid == 'news' || ebaseid == 29 || ebaseid == 'reportForm') {
          $("#setting_" + eid).attr("randomValue", randomValue);
        }
        
        urlContent = urlContent + "&random=" + randomValue;

        $("#weavertabs-content-" + eid).html("")
        $("#weavertabs-content-" + eid).html("<img src=/images/loading2_wev8.gif> loading...");
        $("#weavertabs-content-" + eid).load(urlContent, {}, function() {
          //$("#sync_datacenter_"+eid).tzCheckbox({labels:['','']});
          $(".filetree").filetree();
            //$(".vtip").simpletooltip();
          //fixedPosition(eid);
          jscolor.init();
          // 初始化layout组件
          initLayout();
        });
      }
      if (urlStyle != "") {
        $("#weavertabs-style-" + eid).load(urlStyle, {}, function() {
          // 初始化layout组件
          initLayout();
          $("#weavertabs-style-" + eid).hide();
        });
      }
      if (urlShare != "") {
        $("#weavertabs-share-" + eid).load(urlShare, {}, function() {
          $("#weavertabs-share-" + eid).hide();
        });
      }
    }
  });
}

var openMoreWin = function(eid, event){
  var dom = event.currentTarget;
    var moreurl = $("#more_" + eid).attr("data-morehref");
    if (!moreurl) return;
    if (moreurl.indexOf('/main/workflow/queryFlow') === -1) {
        var tabid = $("#titleContainer_" + eid).find("td[class='tab2selected']").attr("data-tabid");
        if (tabid)
            moreurl += '&tabid=' + tabid
    }
    openLinkUrl(moreurl, '2');
}
window.onRefresh = onRefresh;
window.onSetting = onSetting;
window.openMoreWin = openMoreWin;