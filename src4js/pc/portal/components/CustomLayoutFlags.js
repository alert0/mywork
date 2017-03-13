import ReactDOM from 'react-dom';
//引入元素组件
import Element from './element/';
import { Provider } from 'react-redux';

class CustomLayoutFlags extends React.Component {
	//加载自定义布局门户
	renderCustomLayout() {
		const { layoutFlags, layoutHtml } = this.props.layoutObj;
   		if (layoutHtml) {
	        layoutFlags.map((layoutFlag, i) => {
	       		let lhtml = layoutFlag.areaElements.map(ele => <Element key = { _uuid() }ele = { ele } />);
	            ReactDOM.render( <Provider store = { window.store_e9_element }><div>{ lhtml }</div></Provider>,$(".group[areaflag='" + layoutFlag.areaflag + "']")[0]);
	        });
        }

    }
    componentDidMount() {
        this.renderCustomLayout();
    }
    componentDidUpdate(prevProps) {
        const prebLayoutid = prevProps.layoutObj.bLayoutid;
        const bLayoutid = this.props.layoutObj.bLayoutid;
        if (prevProps.hpid !== this.props.hpid || prebLayoutid !== bLayoutid || window.ifCustomLayoutRender) {
            window.ifCustomLayoutRender = false;
            this.renderCustomLayout();
        }
    }
    render() {
        let eHtml = <div></div>;
        const layoutHtml = this.props.layoutObj.layoutHtml;
        if (layoutHtml) {
            eHtml = <div dangerouslySetInnerHTML = {{ __html: layoutHtml }}></div>;
        }
        return <div id = "CustomLayoutFlags">{eHtml}</div>
    }
}

import { WeaErrorPage, WeaTools } from 'weaCom';
class MyErrorHandler extends React.Component {
    render() {
        const hasErrorMsg = this.props.error && this.props.error !== "";
        return ( <WeaErrorPage msg = { hasErrorMsg ? this.props.error : "对不起，该页面异常，请联系管理员！" }/>
        );
    }
}
CustomLayoutFlags = WeaTools.tryCatch(React, MyErrorHandler, { error: "" })(CustomLayoutFlags);
export default CustomLayoutFlags;
