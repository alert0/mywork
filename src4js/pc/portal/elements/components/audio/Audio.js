//音频元素
class AudioCom extends React.Component {
	componentDidMount(){
		const { eid, esetting } = this.props;
		const { autoPlay, isie } = esetting;
		if(isie==="false"){
			let attrs = {controls:'controls'};
			if(autoPlay === 'on'){
				attrs['autoplay'] = 'autoplay';
			}
			$("#audio_play_"+eid+ " audio").attr(attrs);
		}else{
			let oAttrs = {
				classid:'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
				codebase : 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0'
			};
			$("#audioplayer_"+eid).attr(oAttrs);
			let eAttrs = {
				 mce_src:'flash/top.swf', 
				 menu:'false', 
				 quality:'high',
				 allowscriptaccess:'sameDomain', 
				 pluginspage:'http://www.macromedia.com/go/getflashplayer' 
			}
			$("#audioplayer_"+eid+ " embed").attr(eAttrs);
		}
	}
	render() {
		const { eid, data, esetting } = this.props;
		const { autoPlay, ePath, height, width, isie } = esetting;
		let html = null;
		const style = {
			width: '100%',
			height: height
		}
		if (isie === "true") {
			html = <object id = {`audioplayer_${eid}`} style={{height:height,textAlign:'middle',width:'100%'}}>
				<param name="quality" value="best"/>
				<param name="SAlign" value="LT"/>
			    <param name="allowScriptAccess" value="never"/>
			    <param name="wmode" value="transparent"/>
			    <param name="movie" value={`${ePath}resource/js/audio-player.swf?audioUrl=${data.url}&${autoPlay === 'on'?'autoPlay=true':''}`}/>
			    <embed src={`"${ePath}resource/js/audio-player.swf?audioUrl=${data.url}&${autoPlay  === 'on'?'autoPlay=true':''}`} wmode="transparent" 
			          width="100%" height={height} type="application/x-shockwave-flash" />
			</object>
		} else {
			html = <audio src={data.url} style={{width: '100%'}} height={height}></audio>
		}
		return (<div id = {`audio_play_${eid}`} style ={style}>
				{html}
			</div>)
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

AudioCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(AudioCom);
export default AudioCom;
