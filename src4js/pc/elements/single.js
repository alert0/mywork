import { render } from 'react-dom'
import { combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { createHistory, useBasename, createHashHistory } from 'history'
import thunkMiddleware from 'redux-thunk/lib/index'
import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import Link from 'react-router/lib/Link'
import useRouterHistory from 'react-router/lib/useRouterHistory'
import Redirect from 'react-router/lib/Redirect'
import configureStore from './store/configureStore'
import { routerReducer } from 'react-router-redux/lib/reducer'
import objectAssign from 'object-assign'
import { WeaErrorPage } from 'ecCom'
//门户元素模块
import Elements from './index';
const Element = Elements.Element;
const eReducer = Elements.reducer;
const eAction = Elements.action;

let reducers = objectAssign({}, eReducer, { routing: routerReducer });
const rootReducer = combineReducers(reducers);
const debug = true;

let store = configureStore(
	rootReducer,
	applyMiddleware(
		thunkMiddleware
	)
);
if (debug && !(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1) && window.__REDUX_DEVTOOLS_EXTENSION__) { //非IE才有debug
	store = configureStore(
		rootReducer,
		compose(
			applyMiddleware(
				thunkMiddleware
			), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
	)
}

//推向全局调用
window.store_e9_element = store;
window.action_e9_element = eAction;

store.subscribe(() => {
	//    console.log(store.getState())
});

import syncHistoryWithStore from 'react-router-redux/lib/sync'

const browserHistory = useRouterHistory(createHashHistory)({
	queryKey: '_key',
	basename: '/'
});

const history = syncHistoryWithStore(browserHistory, store);

class Error extends React.Component {
	render() {
		return (
			<WeaErrorPage msg="对不起，无法找到该页面！" />
		)
	}
}

class Root extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<Element key={_uuid()} config={{}}/>
			</Provider>
		)
	}
}

ReactDOM.render(<Root />, document.getElementById('container'));