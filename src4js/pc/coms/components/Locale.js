import Immutable from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const is = Immutable.is;

import * as WeaLocaleActions from '../actions/locale'
import { WeaLocaleProvider } from 'ecCom'

class WeaLocale extends React.Component {
	static contextTypes = {
		router: React.PropTypes.routerShape
	}
	constructor(props) {
		super(props);
		this.pathname = '';
	}
	listenRouter(){
		const { actions, path } = this.props;
		this.context.router.listen(nextState => {
			let { pathname } = nextState;
			if(this.pathname !== pathname){
				path.indexOf(pathname) < 0 && actions.localeUpdate(pathname);
				this.pathname = pathname
			} 
		})
	}
	componentDidMount(){
		this.listenRouter();
	}
	componentWillReceiveProps(nextProps) {
		this.listenRouter();
	}
	render() {
		const { children, locale } = this.props;
		return(
			<WeaLocaleProvider locale={locale.toJS()}>
				{children}
			</WeaLocaleProvider>
		)
	}
}

const mapStateToProps = state => {
	const { comsLocale } = state;
	return {
		path: comsLocale.get('path'),
		locale: comsLocale.get('locale')
	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators(WeaLocaleActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WeaLocale);