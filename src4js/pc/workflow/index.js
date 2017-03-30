import Route from 'react-router/lib/Route'
import Home from './components/Home.js'
import ListDoing from './components/ListDoing.js'
import ListDone from './components/ListDone.js'
import ListMine from './components/ListMine.js'
import Req from './components/Req.js'
import ReqReload from './components/ReqReload.js'
import Add from './components/Add.js'
import QueryFlow from './components/QueryFlow.js'

import './css/list.css'
import './css/formlayout.css'
import './css/formfield.css'
import './css/icon.css'
import './css/add.css'
import './css/req.css'
import './css/tab.css'
import './css/form_wev9.css'
import './css/signInput_wev9.css'
import './css/worflowmessage_wev8.css'
import './css/forward.css'

import reducer from './reducers/'
import * as WorkflowListAction from './actions/list'
import * as WorkflowReqAction from './actions/req'
import * as WorkflowQueryAction from './actions/queryFlow'

require("./util/doing");
require("./util/formbtn");
require("./util/form_wev9");
require("./util/appwfat_wev8");
require("./util/appwfPhraseBtn_wev9");
require("./util/appwf_wf_wev8");
require("./util/appwf_doc_wev8");
require("./util/appwf_fileupload_wev8");
require("./util/sign");
require("./util/weaver_lang_label_7_wev8");
require('./util/error_msg');
require('./util/weaverautocomplete_wev8');
require('./util/img_zoom')
require('./util/applocation_wev8')

import {WeaTools} from 'ecCom';

//onEnter={(nextState,replace,callback)=>WeaTools.checkSession(nextState,replace,callback)}

const WorkflowRoute = (
    <Route path="workflow" breadcrumbName="流程" component={Home}>
        <Route name="listDoing" path="listDoing" component={ListDoing} />
        <Route name="listDone" path="listDone" component={ListDone} />
        <Route name="listMine" path="listMine" component={ListMine} />
        <Route name="add" path="add" component={Add} />
        <Route name="req" path="req" component={Req} />
        <Route name="reqReload" path="reqReload" component={ReqReload} />
        <Route name="queryFlow" path="queryFlow" component={QueryFlow} />
    </Route>
)

module.exports = {
    Route:WorkflowRoute,
    reducer,
    action: {
	    WorkflowListAction,
	    WorkflowReqAction,
	    WorkflowQueryAction
    }
}