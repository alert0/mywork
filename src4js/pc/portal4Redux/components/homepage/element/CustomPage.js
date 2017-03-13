import {
	Component
} from 'react';
import {
	bindActionCreators
} from 'redux';
import {
	connect
} from 'react-redux';
import {
	Spin
} from 'antd';
import * as CustomPageAction from '../../../actions/homepage/custompage';
//自定义页面元素
class CustomPage extends Component {
	componentDidMount() {
		const {
			actions
		} = this.props;
		actions.setFrameData(this.props);
	}
	componentWillUnmount() {
		var ifrms = jQuery(".custompageIframe");
		if (ifrms) {
			ifrms.each(function(i, ifrm) {
				var $this = jQuery(this);
				$this.attr({
					src: "about:blank"
				});
				/*			$this[0].contentWindow.document.write('');
							$this[0].contentWindow.document.close();
							$this.remove();*/
			});
		}
	}
	componentWillMount() {
		// const {
		// 	actions
		// } = this.props;
		// actions.setLoadingVisible(true);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.data.url != nextProps.data.url || window.ifCustomPageRefresh) {
			const {
				actions
			} = nextProps;
			actions.setFrameData(nextProps);
			window.ifCustomPageRefresh = false;
		}
	}
	render() {
		const {
			eid,
			data,
			actions
		} = this.props;
		let loaded = this.props.loaded;
		let html = <iframe frameBorder="no" className="custompageIframe" height={data.height} id={`ifrm_${eid}`} src="about:blank" style={{borderCollapse: 'collapse'}} name={`ifrm_${eid}`} width="100%"></iframe>
		if (!loaded) {
			html = <Spin>{html}</Spin>
		}
		return <div>
			{html}
		</div>
	}
}

const mapStateToProps = state => {
	const {
		custompage
	} = state;
	return ({
		loaded: custompage.get("loaded")
	})
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators(CustomPageAction, dispatch)
	}
}

function mergeProps(stateProps, dispatchProps, ownProps) {
	return {
		loaded: stateProps.loaded.get("frm_" + ownProps.eid),
		eid: ownProps.eid,
		data: ownProps.data,
		actions: dispatchProps.actions,
	};
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CustomPage);