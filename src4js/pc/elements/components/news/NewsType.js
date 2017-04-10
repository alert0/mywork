import { Table, Row, Col, Carousel } from 'antd';
import { formatData, loadRemind } from '../../util/formatdata';
//文档中心元素
class NewsType extends React.Component {
	render() {
		const { eid, data, esetting } = this.props;
		const { tabsetting } = data;
		const list = data.data;
		if (list.length === 0) return <div></div>;
		//tab设置信息
		const { height, width, showModeId, imgs } = tabsetting;
		let columns = new Array;
		let imgStyle = {
			width: width,
			height: height === '0' ? parseInt(width) * 0.8 : height
		}
		const style = {
			verticalAlign: 'top'
		};
		switch (parseInt(showModeId)) {
			case 2: //上图式
				imgStyle['margin'] = '0 auto';
				let lHtml = list.map((item, i) => {
					let imghtml = null;
					if (!_isEmpty(imgs)) {
						let img = imgs[i];
						if (img && img.indexOf("|") !== -1) {
							const imgArr = img.split("|");
							imghtml = <Carousel autoplay >
		             	  { imgArr.map(o=> <div><img style={imgStyle} src={o}/></div>) }
		            	</Carousel>
						} else {
							imghtml = <img style={imgStyle} src={img}/>
						}
					}
					return <div id={`news_${eid}`}>
		             <div style={imgStyle}>{imghtml}</div>
		             <div style={{textAlign:'center',margin:'10px'}}>{loadRemind(item.docdocsubject.name, item.docdocsubject.link, esetting.linkmode, item.docdocsubject.img, esetting.isremind)}</div>
		             <div style={{textAlign:'center',marginBottom:'10px'}}>{item.doclastmoddate} {item.doclastmodtime}</div>
		           </div>
				});
				return <div>{lHtml}</div>
				break;
			case 3: //左图式
				let html = list.map((item, i) => {
					let imghtml = null;
					if (!_isEmpty(imgs)) {
						let img = imgs[i];
						if (img && img.indexOf("|") !== -1) {
							const imgArr = img.split("|");
							imghtml = <Carousel autoplay >
				               { imgArr.map(o=> <div><img style={imgStyle} src={o}/></div>) }
				             </Carousel>
						} else {
							imghtml = <img style={imgStyle} src={img}/>
						}
					}
					return <div style={{overflow:'auto',width:'100%',marginBottom:'10px'}}>
		               <div style={{float:'left',width:parseInt(width)+3}}> {imghtml}</div>
		               <div style={{float:'left'}}>
		                   <div style={{margin:'20px 0 0 20px'}}>{loadRemind(item.docdocsubject.name, item.docdocsubject.link, esetting.linkmode, item.docdocsubject.img, esetting.isremind)}</div>
		                   <div style={{margin:'20px 0 0 20px'}}>{item.doclastmoddate} {item.doclastmodtime}</div>
		               </div>
		           </div>
				});
				return <div>{html}</div>
				break;
			case 4: //列表式2
				let html4 = null;
				let imghtml = null;
				if (imgs.length > 1) {
					let ihtml = imgs.map((item, i) => {
						let img = imgs[i];
						if (img && img.indexOf("|") !== -1) img = img.split("|")[0];
						return <div><img style={imgStyle} src={img}/></div>
					});
					imghtml = <div id={`news_silde_${eid}`} className="news-silde" style={imgStyle}>
			             <Carousel autoplay>
			               {ihtml}
			             </Carousel>
		             </div>
				}else{
					imghtml = <div id={`news_silde_${eid}`} className="news-silde" style={imgStyle}>
			             <Carousel>
			              	<div><img style={imgStyle} src={imgs[0]}/></div>
			             </Carousel>
		             </div>
				}
				columns = formatData(list[0], esetting);
				style['paddingTop'] = '6px';
				html4 = <table><tr>
		           <td style={style}>
		          {imghtml}
		           </td>
		           <td width="100%" className="valign"><Table columns={columns} showHeader={false} pagination={false} dataSource={list} size="small"/></td>
		           </tr></table>;

				return <div>{html4}</div>
				break;
			case 5: //双列式
				columns = formatData(list[0], esetting);
				const evenData = new Array;
				const oddData = new Array;
				list.map((item, i) => {
					if (i % 2 === 0) {
						evenData.push(item);
					} else {
						oddData.push(item);
					}
				});
				return <div><Row>
		                     <Col span={12} order={1}>
		                       <Table columns={columns} showHeader={false} pagination={false} dataSource={evenData} size="small"/>
		                     </Col>
		                     <Col span={12} order={2}> 
		                       <Table columns={columns} showHeader={false} pagination={false} dataSource={oddData} size="small"/>
		                     </Col>
	                 </Row>
	                </div>
				break;
			case 1: //列表式
			default:
				columns = formatData(list[0], esetting);
				return <Table columns={columns} showHeader={false} pagination={false} dataSource={list} size="small"/>
				break;
		}
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
NewsType = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(NewsType);
export default NewsType;