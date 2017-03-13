//幻灯片元素
class Slide extends React.Component {
	componentDidMount() {
		const { eid, esetting } = this.props;
		const { iconImgList, iconImg_overList, values } = esetting;
		if (!_isEmpty(values)) {
			loadSlideCss(eid, iconImgList, iconImg_overList, values);
		}
	}
	render() {
		const { eid, data, esetting } = this.props;
		const { values } = esetting;
		
		const sposition = _isEmpty(values) ? '0' : values['slide_t_position'];
		var sdStyle = {
			background: 'url(\"\") no-repeat',
			cursor: 'pointer'
		}
		var scStyle = {
			cursor: 'pointer'
		};
		let imgHtml = data.map((item, i) => <div className="slideDiv" data-index={i} alt={`${item.title}...`} style={sdStyle}>
	           		 <img width="100%" height="100%" onClick={openLinkUrl.bind(this,item.linkUrl,'3')} src={item.url}/>
	            <div className="slideDiv" onClick={openLinkUrl.bind(this,item.linkUrl,'3')} style={scStyle}></div>
	          </div>);
		let html = null;
		switch (sposition) {
			case '1':
				html = <tbody>
							<colgroup><col width="150px"/><col width="100%"/></colgroup>
							<tr>
								<td style={{width:'150px'}}>
									<div className="slideTitle">
										<div className="slideTitleFloat"></div>
										<div className="slideTitleNavContainer"></div>				
									</div>
								</td>
								<td  width="*">
									<div  className="slideContinar" style={scStyle}>
										{imgHtml}
									</div>
								</td>
							</tr>
						</tbody>
				break;
			case '2':
				html = <tbody>
						<colgroup>
							<col width="100%"/>
							<col width="150px"/>
						</colgroup>
						<tr>
							<td width="*">
								<div  className="slideContinar" style={scStyle}>
									{imgHtml}
								</div>
							</td>
							<td style={{width:'150px'}}>
								<div className="slideTitle">
									<div className="slideTitleFloat"></div>
									<div className="slideTitleNavContainer"></div>				
								</div>
							</td>
						</tr>
					</tbody>
				break;
			default:
				html = <tbody>
				    <tr>
				      <td>
				        <div className="slideContinar" style={scStyle}>
				        	{imgHtml}
				        </div>
				      </td>
				    </tr>
				    <tr>
				      <td>
				        <div className="slideTitle">
				          <div className="slideTitleFloat"></div>
				          <div className="slideTitleNavContainer"></div>
				        </div>
				      </td>
				    </tr>
				  </tbody>
				break;
		}
		return <table style={{width:'100%',height:'165px',tableLayout: 'fixed',borderSpacing:0}} id={`slideArea_${eid}`} border="0" >
	  			{html}
			</table>
	}
}

//幻灯片播放图片效果
const loadSlideCss = (eid, iconImgList, iconImg_overList, values) => {
	$('#slideArea_' + eid + ' .slideContinar').cycle({ //turnUp   //fade  //uncover
		fx: values['slide_t_changeStyle'], //blindX     * blindY    * blindZ    * cover    * curtainX    * curtainY    * fade    * fadeZoom    * growX    * growY    * none   * scrollUp    * scrollDown    * scrollLeft    * scrollRight    * scrollHorz    * scrollVert    * shuffle    * slideX    * lideY   * toss    * turnUp    * turnDown    * turnLeft    * turnRight    * uncover    * wipe    * zoom*/
		timeout: _s2Int(values['slide_t_AutoChangeTime']),
		pager: '#slideArea_' + eid + ' .slideTitleNavContainer',
		pagerAnchorBuilder: pagerFactory,
		before: function(currSlideElement, nextSlideElement, options, forwardFlag) {
			var nextIndex = $(nextSlideElement).attr("data-index");
			var slidnavtitleArray = $("#slideArea_" + eid + " .slidnavtitle");
			var newTop = 0;
			var newLeft = 0;
			if (slidnavtitleArray.length != 0) {
				var nextSlidnavtitle = $($("#slideArea_" + eid + " .slidnavtitle")[nextIndex]);
				newTop = nextSlidnavtitle.position().top;
				if (values['slide_t_position'] === '2') {
					newLeft = nextSlidnavtitle.position().right;
				} else {
					newLeft = nextSlidnavtitle.position().left;
				}
			}
			var topvalue = values['slide_t_position'] === '3' ? newTop - 10 : newTop;
			if (values['slide_t_position'] === '2') {
				$("#slideArea_" + eid + " .slideTitleFloat").css({
					"display": "block",
					"top": topvalue,
					"right": newLeft,
					"background": "url(" + iconImg_overList[nextIndex] + ") no-repeat"
				});
			} else {
				$("#slideArea_" + eid + " .slideTitleFloat").css({
					"display": "block",
					"top": topvalue,
					"left": newLeft,
					"background": "url(" + iconImg_overList[nextIndex] + ") no-repeat"
				});
			}
		},
		fit: 1,
		width: '100%',
		height: '100%'
	});

	$('#slideArea_' + eid + '  .slideContinar').addClass("slideritem");
	$('#slideArea_' + eid + '  .slideContinar').css("width", "100%");
	$('#slideArea_' + eid + '  .slideContinar').css("overflow", "hidden");

	$('#content_view_id_' + eid).css("overflow", "hidden");

	function pagerFactory(idx, slide) {

		if (values['slide_t_position'] === '3') {
			var s = idx > 3 ? ' style="display:true"' : '';
		} else {}
		return '<div ' + s + ' class="slidnavtitle"  style="background:url(' + iconImgList[idx] + ') no-repeat;">&nbsp;</div>';
	};

	if (values['slide_t_position'] === '3') {
		$("#slideArea_" + eid).find(".slideTitleNavContainer").css({
			"margin": "0 auto"
		});
		$("#slideArea_" + eid + "   .slideTitleFloat").css({
			"margin": "0 auto",
			"top": 10 + Math.round($(".slideTitleFloat").offset().top) + "px"
		});
	}

	$('#slideArea_' + eid + '  .slideTitle').css("z-index", "1001");
	$('#slideArea_' + eid + '  .slideTitle').css("position", "relative");
	if (values['slide_t_position'] === '1') {
		$('#slideArea_' + eid + '  .slideTitle').css("width", "150px");
		$('#slideArea_' + eid + '  .slideTitle').css("float", "left");
	}
	if (values['slide_t_position'] === '2') {
		$('#slideArea_' + eid + '  .slideTitle').css("width", "150px");
		$('#slideArea_' + eid + '  .slideTitle').css("float", "right");
	}

	if (values['slide_t_position'] === '3') {
		$('#slideArea_' + eid + '  .slideTitle').css("height", "40px");
		$('#slideArea_' + eid + '  .slideTitle').css("padding-top", "10px");
		$('#slideArea_' + eid + '  .slideTitle').css("text-align", "center");
	}

	var slidnavtitle = $('#slideArea_' + eid + '  .slideTitle  .slidnavtitle');
	slidnavtitle.css("cursor", "pointer");
	if (values['slide_t_position'] === '3') {
		slidnavtitle.css("margin-right", "5px");
		slidnavtitle.css("height", "40px");
		slidnavtitle.css("width", "75px");
		slidnavtitle.css("float", "left");
	} else {
		slidnavtitle.css("height", "40px");
	}

	var slidnavtitle = $('#slideArea_' + eid + '  .slideTitleFloat');
	slidnavtitle.css("position", "absolute");
	slidnavtitle.css("display", "none");

	if (values['slide_t_position'] === '3') {
		slidnavtitle.css("height", "40px");
		slidnavtitle.css("width", "79px");
	} else {
		slidnavtitle.css("height", "40px");
		slidnavtitle.css("width", "165px");
	}
	var slideContinar = $('#slideArea_' + eid + '  .slideContinar');
	slideContinar.css("padding", "0");
	slideContinar.css("overflow", "hidden");
	slideContinar.css("table-layout", "fixed");
	slideContinar.css("width", "auto");
	slideContinar.css("margin", "0");

	if (values['slide_t_position'] === '3') {
		slideContinar.css("height", "220px");
	} else {
		slideContinar.css("height", "160px");
	}
	var slideTitleNavContainer = $("#slideArea_" + eid).find(".slideTitleNavContainer");
	if (values['slide_t_position'] === '3') {
		slideTitleNavContainer.css("display", "inline-block");
		slideTitleNavContainer.css("_display", "block");
	}
}


import { WeaErrorPage, WeaTools } from 'weaCom';
class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return (
			<WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
		);
	}
}
Slide = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Slide);
export default Slide;