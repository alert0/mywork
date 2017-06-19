import { Row, Col } from 'antd';
//个人数据元素
class DataCenterCom extends React.Component {
	componentDidMount() {
		const openlink = this.props.esetting.linkmode;
		$(".module").hover(function(dom) {
			$(this).css("background-image", "none");
			$(this).find(".mtitle").show().css("padding-top", "52px");
			$(this).css("opacity", '0.8')
		}, function() {
			$(this).css("background-image", "url(/images/homepage/portalcenter/" + $(this).attr("data-type") + "_wev8.png)");
			$(this).find(".mtitle").hide();
			$(this).css("opacity", '1')
		})
		$(".module").click(function() {
			const dataUrl = $(this).attr("data-url");
			if ("2" == openlink) window.open(dataUrl);
			else parent.window.open(dataUrl, "_self");
		})
	}
	render() {
		const list = this.props.data;
		let html = null;
		switch (list.length) {
			case 1:
			case 2:
			case 3:
				html = list.map(item => <Col span={24/list.length}><Module item={item} height='240'/></Col>);
				break;
			case 4:
				html = list.map(item => <Col span={12}><Module item={item} height='120'/></Col>);
				break;
			case 5:
				html = list.map((item, i) => {
					switch (i) {
						case 0:
							return <Col span={8}><Module item={item} height='120'/><Module item={list[i+3]} height='120'/></Col>
						case 1:
							return <Col span={8}><Module item={item} height='240'/></Col>
						case 2:
							return <Col span={8}><Module item={item} height='120'/><Module item={list[i+2]} height='120'/></Col>
						default:
							return <div></div>;
					}
				});
				break;
			case 6:
				html = list.map((item, i) => <Col span={8}><Module item={item} height='120'/></Col>);
				break;
			case 7:
				html = list.map((item, i) => {
					switch (i) {
						case 1:
							return <Col span={8}><Row><Col span={12}><Module item={item} height='120'/></Col><Col span={12}><Module item={list[i+1]} height='120'/></Col></Row></Col>
						case 2:
							return <div></div>;
						default:
							return <Col span={8}><Module item={item} height='120'/></Col>
					}
				});
				break;
			case 8:
				html = list.map((item, i) => {
					switch (i) {
						case 1:
						case 4:
							return <Col span={8}><Row><Col span={12}><Module item={item} height='120'/></Col><Col span={12}><Module item={list[i+1]} height='120'/></Col></Row></Col>
						case 2:
						case 5:
							return <div></div>;
						default:
							return <Col span={8}><Module item={item} height='120'/></Col>
					}
				});
				break;
			case 9:
				html = list.map((item, i) => {
					switch (i) {
						case 1:
						case 4:
						case 7:
							return <Col span={8}><Row><Col span={12}><Module item={item} height='120'/></Col><Col span={12}><Module item={list[i+1]} height='120'/></Col></Row></Col>
						case 2:
						case 5:
						case 8:
							return <div></div>;
						default:
							return <Col span={8}><Module item={item} height='120'/></Col>
					}
				});
				break;
		}
		return <Row>{html}</Row>
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
DataCenterCom = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(DataCenterCom);

export default DataCenterCom;

const Module = ({ item, height }) => <div className={`module ${item.model}`} data-type={item.model} data-url={item.url} style={{backgroundColor:item.color,height:height}}>
        <div className="num">{item.value}</div>
        <div className="mtitle">{item.label}</div>
      </div>