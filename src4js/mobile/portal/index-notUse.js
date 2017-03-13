import React from 'react';
import ReactDOM from 'react-dom';
import {
    Router,
    Route,
    hashHistory
} from 'react-router';

import './css/homepage.css';
import HomepageNotUse from './homepage-notUse.js';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/hp/:hpid-:subCompanyId" component={HomepageNotUse}/>
    </Router>
), document.getElementById("portal-container"));
