import { ELEMENT_TYPES } from '../constants/ActionTypes';
const _isRe = (ebaseid) => {
    for(var key in ELEMENT_TYPES){
        if(ebaseid === ELEMENT_TYPES[key]) return true;
    }
    return false;
}

//无权访问的元素的组件
class NoRightCom extends React.Component{
	render(){
		const style = { width: '100%', height: '160px', textAlign: 'center', paddingTop: '63px' };  
		return <div style = {style}>
    			<img src="/synergy/js/waring_wev8.png" />{"对不起，您暂时没有权限！"}
   		 	</div>
	}
}

const handleHeight = (style) => {
    if(!_isEmpty(style)){
    	if(style.height){
	        const height = style.height.replace("px","");
	        let nherght = parseInt((parseInt(height) -32 +1 )/25) * 31 + 32;
	       	style['height'] = nherght+'px';
	    }
    }
    return style;
}

const backMarqueeDiv8 = (eid) => {
    $("#tabContainer_"+eid).scrollTo( {top:'0px',left:($("#tabContainer_"+eid).get(0).scrollLeft - 77 + 'px')}, 500 );
}

const nextMarqueeDiv8 = (eid) => {
    $("#tabContainer_"+eid).scrollTo( {top:'0px',left:($("#tabContainer_"+eid).get(0).scrollLeft + 77 + 'px')}, 500 );
}
const handleETitleWidth = (eid,length,canHeadbar) => {
    var divWidth = length*77+36;
    var hpWidth = $("#content_"+eid).width();
    var max = window.store_e9_element.getState().hpsetting.get("max");
    if(!max) hpWidth = hpWidth - (window.innerWidth*0.1);
    if(parseInt(window.global_hpid) < 0){
        var hpdom = $("#item_"+eid).parents("div[class='homepage']")[0];
        hpWidth = $(hpdom).parent().width();
        hpWidth = hpWidth - 20;
        divWidth = divWidth - 36;
    }       
    var titleWidth = hpWidth-10;
    if(canHeadbar === 'false'){
         hpWidth = hpWidth - $("#content_"+eid).find(".optoolbar").width();
    }
    if(parseFloat(divWidth) > parseFloat(hpWidth)) {
        $("#tabnavprev_"+eid).css("display","block");
        $("#tabnavnext_"+eid).css("display","block");
        if(length>1){
            if(canHeadbar === 'false'){
                $("#tabContainer_"+eid).css("width", hpWidth - 55);
                $("#tabnavnext_"+eid).css("right","110px");
            }else{
                $("#tabContainer_"+eid).css("width", hpWidth - 55);
                $("#titleContainer_"+eid).css("width", hpWidth);
            }
            $("#tabContainer_"+eid).css("display", ""); 
            $("#tabContainer_"+eid).css("margin-left", "0px");
            $("#tabContainer_"+eid).css("margin-right", "0px"); 
          }else{
            $("#tabnavprev_"+eid).css("display","none");
            $("#tabnavnext_"+eid).css("display","none");
            $("#tabContainer_"+eid).css("display", "none"); 
          }
        
    }else{
        $("#tabnavprev_"+eid).css("display","none");
        $("#tabnavnext_"+eid).css("display","none");
        if(length>1){
            if(canHeadbar === 'false'){
                $("#tabContainer_"+eid).css("width", hpWidth-50);
            }else{
                $("#tabContainer_"+eid).css("width", hpWidth);
            }
            $("#tabContainer_"+eid).css("display", ""); 
            $("#tabContainer_"+eid).css("margin-left", "0");
            $("#tabContainer_"+eid).css("margin-right", "0"); 
        }else{
         $("#tabContainer_"+eid).css("display", "none"); 
        }
    }
    $("#tabContainer_"+eid+" table").css("width", length*77);
}
window.handleETitleWidth = handleETitleWidth;

module.exports = {
    NoRightCom,
    handleHeight,
    backMarqueeDiv8,
    nextMarqueeDiv8,
    _isRe
}
