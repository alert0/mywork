import { SIGN_VIEW, SIGN_VIEW_IS_MORE } from '../../constants/ActionTypes';
import { reqSignViewDatas } from '../../apis/workflow';
import Immutable from 'immutable';

const getImmutableData = (eid, old, im) => {
    var ndata = {};
    ndata[eid] = old;
    var nresult = im.merge(Immutable.fromJS(ndata));
    return nresult;
}

const handleImmutableData = (eid, isMore, data) => {
    return (dispatch, getState) => {
        const idata = getState().signview.get("data");
        const iisMore = getState().signview.get("isMore");
        dispatch({
            type: SIGN_VIEW,
            data: getImmutableData(eid, data, idata),
            isMore: getImmutableData(eid, isMore, iisMore)
        });
    }
}

const signviewPoistion = (eid) => {
	return (dispatch, getState) => {
		var _contentDiv = jQuery("#signPreview_" + eid).find(".signContent");
		jQuery("#tabcontant_" + eid).find(".reqdetail").parent().hover(function() {
		    $(this).find(".imgdetail").show();
		},
		function() {
		    $(this).find(".imgdetail").hide();
		});
		jQuery("#tabcontant_" + eid).find(".imgdetail").bind("click",function() {
		    var signPreview = jQuery("#signPreview_" + eid);
		    signPreview.find(".signMore").hide();
		    signPreview.height(372);
		    var $this = jQuery(this).parents("tr:first").find(".reqdetail");
		    var adom = jQuery(this).parents("tr:first").find("a");
		    _contentDiv.css("height", "332px");
		    $(".signPreview").hide();
		    var requestid = $(adom).attr("data-requestid");
		    var link = $(adom).attr("data-link");
	        var title = $(adom).attr("title");
		    signPreview.find(".signTitle").html("<a style='color:#000' title='"+title+"' href='javascript:openLinkUrl(\""+link+"\",\"2\")'>"+title+"</a>");
		    let pagesize = 3;
		    let curPage = 1;
		    let totalCount = 0;
	        var params = {
	             requestid:requestid,
	             actiontype:'requestLog',
	             maxrequestlogid:'',
	             loadmethod:'portal',
	             firstload:true,
	             requestLogParams:'{}'
	        }
	        const { maxrequestlogid } = params;
		    const pStr = "?requestid="+requestid+"&maxrequestlogid="+maxrequestlogid+"&loadmethod=portal&firstload=true&requestLogParams=&wfsignlddtcnt="+pagesize+"&pgnumber="+curPage;
		   	reqSignViewDatas(pStr).then((data) => {
		    	dispatch(handleImmutableData(eid,false,data.log_loglist));
	            totalCount = parseInt(data.totalCount);
		        var etop = $this.parents(".item:first").offset().top;
		        var eleft = $this.parents(".item:first").offset().left;
		        //alert(eleft)
		        if ($this.parents(".item:first").css("position") == "static") {
		            etop = 0;
		            eleft = 0;
		        }
		        var left = $this.offset().left;
		        left = left - eleft;
		        var top = $this.offset().top;
		        var rtop = top - etop;
		        if (top < signPreview.height() || top - $(document).scrollTop() + 350 < $(window).height()) {
		            $(".arrowsblockup").hide();
		            $(".arrowsblock").show();
		            $(".signContainer").removeClass("signContainerup");
		            $(".signMore").removeClass("signMoreup");
		        } else {
		            $(".arrowsblockup").show();
		            $(".arrowsblock").hide();
		            $(".signContainer").addClass("signContainerup");
		            $(".signMore").addClass("signMoreup");
		            rtop = rtop - 332 - 20;
		            if ((curPage*3) < totalCount) {
		                rtop = rtop - 60;
		            } else {
		                rtop = rtop - 20;
		            }
		            rtop = rtop + 8 - 40;
		        }
		        //alert(top+rtop-$(document).scrollTop())
		        if (top + rtop - $(document).scrollTop() < 0) {
		            rtop = top - etop;
		            $(".arrowsblockup").hide();
		            $(".arrowsblock").show();
		            $(".signContainer").removeClass("signContainerup");
		            $(".signMore").removeClass("signMoreup");
		        }
		        rtop = rtop + 31;
		        signPreview.css("top", rtop);
		        signPreview.css("left", left);
		        signPreview.attr("top", rtop);
		        var ulheight = _contentDiv.find(".content").height();
		        if (ulheight > 332) {
		            ulheight = 332;
		            _contentDiv.height(ulheight);
		        }
		        _contentDiv.perfectScrollbar();
		        if ((curPage*3) >= totalCount) {
		            signPreview.find(".signMore").hide();
		            signPreview.find(".signMore").prev().css("border-bottom-width", "1px");
		        } else {
		            signPreview.find(".signMore").show();
		            const signHeight = signPreview.height();
		            signPreview.height(412);
		            var paramsDom = signPreview.find(".params");
		            $(paramsDom).find("input[name='pageno']").val("1");
		            $(paramsDom).find("input[name='requestid']").val(requestid);
		            $(paramsDom).find("input[name='maxrequestlogid']").val(data.maxrequestlogid);
		            $(paramsDom).find("input[name='requestLogParams']").val(JSON.stringify(data.requestLogParams));
		            signPreview.find(".signMore").prev().css("border-bottom-width", "0px");
		        }
		        signPreview.show();
		    });
		})
		jQuery("#signPreview_" + eid).find(".close").bind("click",function() {
		    jQuery("#signPreview_" + eid).hide();
		})
	}
}

const getMoreSignData = (eid) =>{
	var signPreview = jQuery("#signPreview_" + eid);
	return (dispatch, getState) => {
		const iisMore = getState().signview.get("isMore");
		dispatch({
            type: SIGN_VIEW_IS_MORE,
            isMore: getImmutableData(eid, true, iisMore)
		});
		var paramsDom = signPreview.find(".params");
      	var curPage = $(paramsDom).find("input[name='pageno']").val();
      	var requestid = $(paramsDom).find("input[name='requestid']").val();
        var maxrequestlogid = $(paramsDom).find("input[name='maxrequestlogid']").val();
       	var requestLogParams = $(paramsDom).find("input[name='requestLogParams']").val();	
		var nextPage = parseInt(curPage)+1;
		var pagesize = 3;
		var pStr = "?requestid="+requestid+"&maxrequestlogid="+maxrequestlogid+
		"&loadmethod=portal&firstload=false&requestLogParams="+requestLogParams
		+"&wfsignlddtcnt="+pagesize+"&pgnumber="+nextPage;
	   	reqSignViewDatas(pStr).then((data) => {
	   		if(!data.api_status){
	   			var iodata = getState().signview.get("data").toJSON();
				var odata = iodata[eid];
		   		var nlist = data.log_loglist;
		   		var newList = odata.concat(nlist);
		       	dispatch(handleImmutableData(eid,false,newList));
	            $(paramsDom).find("input[name='pageno']").val(nextPage);
	            $(paramsDom).find("input[name='requestid']").val(requestid);
	            $(paramsDom).find("input[name='maxrequestlogid']").val(data.maxrequestlogid);
	            $(paramsDom).find("input[name='requestLogParams']").val(requestLogParams);
		   		if(nextPage*3>parseInt(data.totalCount)){
		   			 signPreview.height(370);
		   			 signPreview.find(".signMore").hide();
		   		}
	   		}else{
	   			console.error(" errormsg : ",data.api_errormsg);
	   		}
	   	});
	}
}
module.exports = {
    signviewPoistion,
    getMoreSignData
};
