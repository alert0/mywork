class ImgZoom extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div className="round_shade_box" id="zoom" > 
					<div className="round_shade_top"> 
						<span className="round_shade_topleft"></span> 
						<span className="round_shade_topright"></span> 
					</div> 
					<div className="round_shade_centerleft"> 
						<div className="round_shade_centerright"> 
    						<div className="round_shade_both" id="zoom_both"></div>
							<div className="round_shade_center" id="zoom_content">  
								<div className="round_shade_center1" id="zoom_content1"></div> 
							</div>
						</div> 
					</div> 
					<div className="round_shade_bottom"> 
						<span className="round_shade_bottomleft"></span> 
						<span className="round_shade_bottomright"></span> 
					</div> 
						<a className="round_box_close" id="zoom_close" title="关闭"></a> 
						<a className="round_box_right"  id="zoom_right" title="向右转"></a> 
						<a className="round_box_left"  id="zoom_left" title="向左转"></a> 
				    	<a className="round_box_add"  id="zoom_add" title="放大"></a> 
				    	<a className="round_box_minus"  id="zoom_minus" title="缩小"></a> 
	    				<a className="round_box_1"  id="zoom_1" title="1:1"></a> 
				    	<a className="zoom_save"  id="zoom_save" title="保存"></a> 
				</div>
		)
	}
}
export default ImgZoom