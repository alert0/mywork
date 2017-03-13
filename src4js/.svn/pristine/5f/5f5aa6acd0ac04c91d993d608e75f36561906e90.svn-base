import React from 'react';
import ReactDOM from 'react-dom';
import {
    Router,
    Route,
    hashHistory
} from 'react-router';

import './css/homepage.css';
import './css/homepage-setting.css';
import HomepageSetting from './homepage-setting.js';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/hp/:hpid-:subCompanyId" component={HomepageSetting}/>
    </Router>
), document.getElementById("portal-container"));
