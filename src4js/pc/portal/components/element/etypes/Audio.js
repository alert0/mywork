//音频元素
class Audio extends React.Component {
	render() {
	const { eid, data, esetting } = this.props;
	const { autoPlay, ePath, height, width, isie } = esetting;
	let html = null;
	const style = {
		width: '100%',
		height: height
	}
	if (isie === "true") {
		html = <object id = {`audioplayer_${eid}`} classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
			codebase = "http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" style={{height:height,textAlign:'middle',width:'100%'}}>
			<param name="quality" value="best"/>
			<param name="SAlign" value="LT"/>
		    <param name="allowScriptAccess" value="never"/>
		    <param name="wmode" value="transparent"/>
		    <param name="movie" value={`"${ePath}resource/js/audio-player.swf?audioUrl=${data.url}&${autoPlay === 'on'?'autoPlay=true':''}`}/>
		    <embed src={`"${ePath}resource/js/audio-player.swf?audioUrl=${data.url}&${autoPlay  === 'on'?'autoPlay=true':''}`} mce_src="flash/top.swf"  wmode="transparent" menu="false" quality="high"
		          width="100%" height={height} allowscriptaccess="sameDomain" type="application/x-shockwave-flash"
		         pluginspage="http://www.macromedia.com/go/getflashplayer" />
		</object>
	} else {
		html = <audio  src={data.url} style={{width: '100%'}} height={height} autoplay={autoPlay === 'on' ? 'autoplay':''} controls='controls'></audio>
	}
	return (<div id = {`audio_play_${eid}`} style ={style}>
			{html}
		</div>)
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

Audio = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Audio);
export default Audio;
