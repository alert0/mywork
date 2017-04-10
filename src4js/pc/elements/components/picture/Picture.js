//图片元素
class PictureCom extends React.Component {
	componentDidMount() {
		const { eid, esetting } = this.props;
		const { width, speed, open } = esetting;
		initPictureJs(eid, width, speed, open);
	}
	render() {
		let aStyle = {
			cursor: 'default'
		}
		let tdStyle = {
			verticalAlign: 'middle',
			width: '35px'
		}
		const { eid, data, esetting } = this.props;
		const { showType, button, width, height, open } = esetting;
		let cursor = 'default';
		let imgStyle = {
			width: width + 'px',
			height: height + 'px'
		}
		let liStyle = {
			overflow: 'hidden',
			float: 'left',
			width: width + 'px',
			height: (parseInt(height) + 3) + 'px'
		}
		let html = null;
		if (showType === '1') {
			const item = data[0];
			let link = item.link;
			if ('' === link) {
				link = '#';
			} else {
				cursor = 'pointer';
			}
			let img = <img title={item.name} src={item.url} border="0" style={imgStyle}/>;
			html = '1' === open ? <div className="jCarouselLite">
                    {'' !== item.url ? <a className="highslide" style={{cursor:cursor}} title={item.name} data-ref={link} href={item.url} target='_blank'> {img}</a> :
                    <a className="highslide" style={{cursor:cursor}} title={item.name} data-ref={link} >
                    {img}
                    </a>}
                  </div> : <div>{'#' !== link ? <a className="highslide" style={{cursor:cursor}} title={item.name} data-ref={link} href={link} target='_blank'> 
                    {img}</a> : <a className="highslide" style={{cursor:cursor}} title={item.name} data-ref={link} > 
                   {img}</a>}</div>
		} else {
			let btnBack = null;
			let btnNext = null;
			if ('1' === button) {
				btnBack = <td style={tdStyle}>
                  <div id={`pictureback_${eid}`} className="pictureback" style={{cursor:'hand'}} ></div>
              </td>
				btnNext = <td style={tdStyle}>
                  <div id={`picturenext_${eid}`} className="picturenext" style={{cursor:'hand'}} ></div>
               </td>
			}

			let liHtml = data.map((item,i) => {
				const link = '' === item.link ? '#' : item.link;
				let img = <img title={item.name} src={item.url} border="0" style={imgStyle}/>;
				return <li style={liStyle}>{'1' === open ? <div className="jCarouselLite" >
                        {'' !== item.url ? <a className="highslide" style={{cursor:cursor}} title={item.name} data-ref={link} href={item.url} target='_blank'>{img}</a> :
                        <a className="highslide" style={{cursor:cursor}} title={item.name} data-ref={link} >
                        {img}
                        </a>}
                      </div> : <div>{'#' !== link ? <a className="highslide" style={{cursor:cursor}} title={item.name} data-ref={link} href={link} target='_blank'> 
                        {img}</a> : <a className="highslide" style={{cursor:cursor}} title={item.name} data-ref={link} > 
                       {img}</a>}</div>}</li>
			});
			html = <table width="100%" style={{borderSpacing:'0'}} border="0">
              <tbody>
                <tr>
                  {btnBack}
                   <td id={`picturetd_${eid}`} nowrap="nowrap" style={{overflow:'hidden',textAlign:'center'}} >
                    <div className="jCarouselLite" id={`jCarouselLite_${eid}`}>
                      <ul>
                      {liHtml}
                      </ul>
                    </div>
                  </td>
                  {btnNext}
                </tr>
              </tbody>
            </table>
		}
		return (<div id={`pictureTable_${eid}`} style={{backgroundColor: '#FFFFFF',height: height, width: '100%',margin:'0px',textAlign:'center'}}>
      {html}
    </div>)
	}
}

function initPictureJs(eid, picturewidth, autoShowSpeed, highopen) {
	var width = $("#jCarouselLite_" + eid).parent().width();
	var count = parseInt(width / picturewidth);
	if ($('#jCarouselLite_' + eid).find("ul").length > 0) {
		var auto = autoShowSpeed * 50;
		if ($('#jCarouselLite_' + eid).find("li").length < count) {
			auto = 0;
			count = $('#jCarouselLite_' + eid).find("li").length;
			$('#jCarouselLite_' + eid).jCarouselLite({
				btnPrev: '#pictureback_' + eid,
				btnNext: '#picturenext_' + eid,
				auto: auto,
				speed: 1000,
				visible: count,
				scroll: 1,
				circular: false
			});
			$("#pictureback_" + eid).hide();
			$("#picturenext_" + eid).hide();
			$("#picturetd_" + eid).attr("align", "center");
			var settingWidth = parseInt(count * picturewidth);
			$("#jCarouselLite_" + eid).width(settingWidth);
		} else {
			$('#jCarouselLite_' + eid).jCarouselLite({
				btnPrev: '#pictureback_' + eid,
				btnNext: '#picturenext_' + eid,
				auto: auto,
				speed: 1000,
				visible: count,
				scroll: 1,
				circular: true
			});
			$("#jCarouselLite_" + eid).width(width);
		}
	}
	if ("1" === highopen) {
		$('#jCarouselLite_' + eid).find("a").each(function() {
			var $img = $(this);
			$($img).fancybox({
				wrapCSS: 'fancybox-custom',
				closeClick: true,
				closeBtn: false,
				openEffect: 'none',
				helpers: {
					title: {
						type: 'inside'
					},
					overlay: {
						css: {
							'background': 'rgba(238,238,238,0.85)'
						}
					}
				},
				afterLoad: function() {
					var refstr = $($img).attr("data-ref");
					if ($.trim(refstr) != "#") {
						this.title = '<a href="' + refstr + '" style="color:#000000!important;text-decoration:none!important;" target="_blank">' + this.title + '</a> ';
					}
				}
			});
		})
	}
}


import { WeaErrorPage, WeaTools } from 'ecCom';
class MyErrorHandler extends React.Component {
	render() {
		const hasErrorMsg = this.props.error && this.props.error !== "";
		return (
			<WeaErrorPage msg={hasErrorMsg?this.props.error:"对不起，该页面异常，请联系管理员！"} />
		);
	}
}
PictureCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(PictureCom);

export default PictureCom;