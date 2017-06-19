import React from 'react'
import { render } from 'react-dom'
import {combineReducers,applyMiddleware,compose } from 'redux';
import { Provider } from 'react-redux'
import { createHistory, useBasename, createHashHistory } from 'history'
import thunkMiddleware from 'redux-thunk/lib/index'
import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import Link from 'react-router/lib/Link'
import useRouterHistory from 'react-router/lib/useRouterHistory'
import Redirect from 'react-router/lib/Redirect'
import configureStore from './store/configureStore'

import {routerReducer} from 'react-router-redux/lib/reducer'

import Portal from 'weaPortal';
const Homepage = Portal.Homepage;
const PortalAction = Portal.action;
const portalReducer = Portal.reducer;

import Workflow from 'weaWorkflow'//'../workflow/'
const WorkflowRoute = Workflow.Route;
const workflowReducer = Workflow.reducer;
const WorkflowAction = Workflow.action;
//import workflowReducer from '../workflow/reducers/'

import Blog from 'weaBlog'
const BlogRoute = Blog.Route;
const blogReducer = Blog.reducer;
const BlogAction = Blog.action;

import Meeting from 'weaMeeting'
const MeetingRoute = Meeting.Route;
const meetingReducer = Meeting.reducer;
const MeetingAction = Meeting.action;

import Fna from 'weaFna'
const FnaRoute = Fna.Route;
const fnaReducer = Fna.reducer;
const FnaAction = Fna.action;

import theme from '../theme/'
const Login = theme.Login;
const Theme = theme.Theme;
const portalThemeReducer = theme.reducer;


import { comsReducer } from '../coms/index'

import objectAssign from 'object-assign'

let reducers = objectAssign({}, 
	comsReducer,
	portalReducer, 
	portalThemeReducer, 
	workflowReducer, 
	blogReducer, 
	meetingReducer, 
	fnaReducer, 
	{routing: routerReducer}
);

const rootReducer = combineReducers(reducers);

const debug = true;

let store = configureStore(
	rootReducer,
	applyMiddleware(
		thunkMiddleware
	)
);

if(debug && !(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1) && window.__REDUX_DEVTOOLS_EXTENSION__) { //非IE才有debug
	store = configureStore(
		rootReducer,
		compose(
		applyMiddleware(
			thunkMiddleware
		),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
	)
}

//推向全局调用
window.store_e9_element = store;
window.action_e9_element = PortalAction;
window.store_e9_workflow = store;
window.action_e9_workflow = WorkflowAction;

store.subscribe(() =>{
    //console.log(store.getState())
});

import syncHistoryWithStore from 'react-router-redux/lib/sync'

const browserHistory  = useRouterHistory(createHashHistory)({
    queryKey: '_key',
	basename: '/'
});

const history = syncHistoryWithStore(browserHistory, store);

window.weaHistory = history;

const loginClear = () => {
    $("#IMbg", parent.document).remove();
    $("#immsgdiv", parent.document).remove();
    $("#addressdiv", parent.document).remove();
};

import { WeaLocaleProvider } from 'ecCom'
const Set = WeaLocaleProvider.Set;

class Wrap extends React.Component {
    render() {
        return (
            <div style={{height:"100%"}}>
            	{this.props.children}
            </div>
        )
    }
}

class Root extends React.Component {
    render() {
		return (
            <Provider store={store}>
				<Router history={history}>
                    <Route path="/" component={Login} onEnter={loginClear} />
                    <Route path="locale" component={Set} />
                    <Route path="main" component={Theme}>
                        <Route path="portal/portal-:hpid-:subCompanyId" component={Homepage} />
                        <Route name="report" path="report" component={Wrap}>
					    	{FnaRoute}
					    </Route>
                        {WorkflowRoute}
                        {BlogRoute}
                        {MeetingRoute}
                        {FnaRoute}
                    </Route>
				</Router>
			</Provider>
        )
    }
}


try{
	//console.time("time");
	ReactDOM.render(<Root />, document.getElementById('container'),()=>{
		//console.timeEnd("time");
	});
}
catch(e){
	window.console ? console.log('出错了： ',e) : alert('出错了： '+e);
}
