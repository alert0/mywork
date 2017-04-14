/** --------- 元素工具栏功能js函数 -----------**/
//删除元素
function onDel(eid){  
  if(!confirm("此元素被删除后将不能被恢复，是否继续?")) return;
  var group=$($("#item_"+eid).parents(".group")[0]);
  var flag=group.attr(_handleAttrName("areaflag"));
  var eids="";
  group.find(".item").each(function(){
      if($(this).attr("data-eid")!=eid)   eids+=$(this).attr("data-eid")+",";
  });
  //alert(eids);
  $.get("/homepage/element/EsettingOperate.jsp",{method: "delElement", hpid: global_hpid,eid:eid,delFlag:flag,delAreaElement:eids,subCompanyId:global_subCompanyId},
      function(data){         
        if($.trim(data)=="")  {
          $("#item_"+eid).remove();
        } else {
          alert($.trim(data))
        }
      }
  );
}

//锁定/解锁函数
function onLockOrUn(eid,e){
  var obj = e.currentTarget;
  if(confirm("此操作可能花较长的时间,是否继续?")){
      //divInfo.style.display='inline';
      var url;
      if(jQuery(obj).attr("data-status")=="unlocked"){
          url="/homepage/element/EsettingOperate.jsp?method=locked&eid="+eid+"&hpid="+global_hpid+"&subCompanyId="+global_subCompanyId;
      } else {
          url="/homepage/element/EsettingOperate.jsp?method=unlocked&eid="+eid+"&hpid="+global_hpid+"&subCompanyId="+global_subCompanyId;
      }
      $.get(url,{},function(data){
        //divInfo.style.display='none';
        if(jQuery(obj).attr("data-status")=="unlocked"){
              jQuery(obj).attr("data-status","locked");   
          } else {
              jQuery(obj).attr("data-status","unlocked");
          }           
        jQuery(obj).children(":first").attr("src",$.trim(data));
       });
  }
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

window.onDel = onDel;
window.onLockOrUn = onLockOrUn;
window.onSetting = onSetting;
window.openMoreWin = openMoreWin;