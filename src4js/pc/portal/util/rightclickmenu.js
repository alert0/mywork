/**
 * Created by Administrator on 2017/5/10.
 */
import {connect} from 'react-redux';
import {WeaErrorPage, WeaTools} from 'ecCom';

const rightClickMenu = (type) => {
    switch (type) {
  /*      case 'syncHome':
            const params = {
                hpid: global_hpid,
                subCompanyId: global_subCompanyId,
                method: 'completesynihp',
            }
            window.store_e9_element.dispatch(window.action_e9_element.RightClickMenuAction.confirmSynchome(true));

            onRightClickMenuClose();
            break;*/
/*        //同步首页
        case 'synihp':
        case 'synihpnormal':
            console.log("111111111111111111111111111111:同步首页");
            window.global_RightClickType=type;
            $("#synize_confirm").click();
            onRightClickMenuClose();
            break;*/
        //全部收缩
        case 'shrinkAll':
            if(window.global_isSetting){
                $("#e9PortalSetting .content").toggle();
                if ("全部收缩" == $("#hpsetting_shrinkAll").text()) {
                    $("#hpsetting_shrinkAll").text("全部展开");
                } else {
                    $("#hpsetting_shrinkAll").text("全部收缩");
                } 
            }else{
                $("#e9routeMain .content").toggle();
            }
            onRightClickMenuClose("shrinkAll");
            break;
        //隐藏元素库
        case 'hiddenElementLib':
            $(".portal-setting-left").toggle();
            if("隐藏元素库"==$("#hpsetting_hiddenElementLib").text()){
                $("#hpsetting_hiddenElementLib").text("显示元素库");
                $(".portal-setting-right").css("width","100%");
            }else{
                $("#hpsetting_hiddenElementLib").text("隐藏元素库");
                $(".portal-setting-right").css("width","89%");
            }
            onRightClickMenuClose("hiddenElementLib");
            break;
        //更多
        case 'more':
            const position = {left: $("#hpsetting_more").offset().left + 77 - $(".homepage").offset().left - 125, top: $("#hpsetting_more").offset().top - $(".homepage").offset().top - 10};
            const pos = {
                height:1,
                position: position
            }
            var show = window.store_e9_element.getState().rightclickmenu.get("show").toJSON()[global_hpid+"-"+global_isSetting];
            if(!show) onRightClickMenuShow(pos);
            else onRightClickMenuClose();
            break;
        //显示页面地址
        case 'showPageAddress':
            window.store_e9_element.dispatch(window.action_e9_element.RightClickMenuAction.showLocationURL(true));
            onRightClickMenuClose();
            break;
        //收藏
        case 'store':
            openFavouriteBrowser();
            onRightClickMenuClose();
            break;
        //帮助
        case 'help':
            showHelp();
            onRightClickMenuClose();
            break;
        //设置元素
        case 'settingElement':
            //设置元素
            customPortalSetting(global_hpid,global_subCompanyId,getHpName())
            onRightClickMenuClose();
            break;
    }

}

function openFavouriteBrowser(){
    var BacoTitle = jQuery("#BacoTitle");
    var pagename = "";
    var navName = "";
    var fav_uri = "%2Fhomepage%2FHomepage.jsp";
    var fav_querystring = "isfromportal%3D1%5Ee71494489609747%3D%5Ehpid%3D26%5EsubCompanyId%3D34%5Eisfromhp%3D0";
    try{
        var e8tabcontainer = jQuery("div[_e8tabcontainer='true']",parent.document);
        if(e8tabcontainer.length > 0) {
            fav_uri = escape(parent.window.location.pathname);
            fav_querystring = escape(parent.window.location.search);
            navName = e8tabcontainer.find("#objName").text();
        }else{
            navName = jQuery("#objName").text();
        }
    } catch(e) {

    }
    if(BacoTitle) {
        pagename = BacoTitle.text();
    }
    if(!pagename){
        pagename = navName;
    }
    pagename = escape(pagename);
    //window.showModalDialog('/systeminfo/BrowserMain.jsp?url=/favourite/FavouriteBrowser.jsp&fav_pagename='+pagename+'&fav_uri='+fav_uri+'&fav_querystring='+fav_querystring+'&mouldID=doc');
    var e8tabcontainer2 = jQuery("div[_e8tabcontainer='true']",parent.document);
    var dialogurl = "";
    if(e8tabcontainer2.length > 0){
        dialogurl = '/systeminfo/BrowserMain.jsp?url=/favourite/FavouriteBrowser.jsp&fav_pagename='+pagename+'&fav_uri='+fav_uri+'&fav_querystring='+fav_querystring+'&mouldID=doc';
    }else{
        dialogurl = '/systeminfo/BrowserMain.jsp?url=/favourite/FavouriteBrowser.jsp&fav_uri='+fav_uri+'&mouldID=doc';  //fav_pagename和fav_querystring不通过url传值，而通过session获取，避免url过长时，导致问题
    }
    var dialog = new window.top.Dialog();
    dialog.currentWindow = window;
    dialog.URL = dialogurl;
    dialog.Title = "收藏夹";
    dialog.Width = 550 ;
    dialog.Height = 600;
    dialog.Drag = true;
    dialog.show();
}

function showHelp(){
    var pathKey = "%2Fhomepage%2FHomepage.jsp%3Fhpid%3D1%26subCompanyId%3D1%26isfromportal%3D1%26isfromhp%3D0%26e71494487903719%3D";
    var operationPage = "http://help.e-cology.com.cn/help/RemoteHelp.jsp";
    var screenWidth = window.screen.width*1;
    var screenHeight = window.screen.height*1;
    var isEnableExtranetHelp = 1;
    if(isEnableExtranetHelp==1){
        //operationPage = "http://e-cology.com.cn/formmode/apps/ktree/ktreeHelp.jsp";
        operationPage = 'http://www.e-cology.com.cn/formmode/apps/ktree/ktreeHelp.jsp';
    }
    window.open(operationPage+"?pathKey="+pathKey,"_blank","top=0,left="+(screenWidth-800)/2+",height="+(screenHeight-90)+",width=1000,status=no,scrollbars=yes,toolbar=yes,menubar=no,location=no");
}

module.exports = {
    rightClickMenu,
}