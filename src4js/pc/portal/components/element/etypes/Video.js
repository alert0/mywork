//视频元素
class Video extends React.Component {
	render() {
		const { eid, data } = this.props;
		const { height, width, quality, fullScreen, url, autoPlay, isie } = data;
		const isAutoPlay = autoPlay === 'on';
		let html = isie === "true" ? <object id={`videoPlayer_${eid}`} height={height} width="100%" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">
		<param value="/page/element/Video/resource/js/player.swf" name="movie" />
		<param value="#FFFFFF" name="bgcolor" />
		<param value={quality} name="quality" />
		<param value={isAutoPlay} name="allowfullscreen" />
		<param value="always" name="allowscriptaccess" />
		<param name="wmode" value="transparent" />
		<param value={`file=${url}&autostart=${isAutoPlay}`} name="flashvars" />
		<embed src={`/page/element/Video/resource/js/player.swf?file=${url}&autostart=${isAutoPlay}`} mce_src="flash/top.swf"  wmode="transparent" menu="false" quality="high" width="100%" height={height} allowscriptaccess="sameDomain" type="application/x-shockwave-flash"  
		         pluginspage="http://www.macromedia.com/go/getflashplayer" />
		</object> : <video src={url} style={{width:'100%'}} height={height} autoplay={isAutoPlay ? 'autoplay':''} controls="controls"></video>
		return <div id={`video_play_${eid}`} style={{width:'100%',height:height}}>
		{html}
	</div>
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

Video = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(Video);
export default Video;