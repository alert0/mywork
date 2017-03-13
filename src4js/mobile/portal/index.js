import React from 'react';
import ReactDOM from 'react-dom';
import {
    Router,
    Route,
    hashHistory
} from 'react-router';

import './css/homepage.css';
import Portal from './portal.js';
import Homepage from './homepage.js';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={Portal}>
            <Route path="/hp/:hpid-:subCompanyId" component={Homepage}/>
        </Route>
    </Router>
), document.getElementById("portal-container"));