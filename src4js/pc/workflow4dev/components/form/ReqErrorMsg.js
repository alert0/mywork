
class ReqErrorMsg extends React.Component{
	constructor(props) {
		super(props);
    }
	
	shouldComponentUpdate(nextProps,nextState) {
		return true;
    }
	
	componentDidUpdate(){
		jQuery('.message-detail .condition').each(function(){
			var _a = jQuery(this).attr('index');
			if(!jQuery.isEmptyObject(_a)){
				jQuery(this).hover(
					function(){
						jQuery('#condit'+_a).css('display','block');
						jQuery('#condit'+_a).css('left',window.event.clientX);
					},
					function(){
						jQuery('#condit'+_a).css('display','none');
					}
				);
			}
		});
	}
	
	render(){
		const {reqsubmiterrormsghtml} = this.props;
		return (
			<div id="reqsubmiterrormsghtml" dangerouslySetInnerHTML={{__html:reqsubmiterrormsghtml}}></div>
		)
	}
	
}

export default ReqErrorMsg
