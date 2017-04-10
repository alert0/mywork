import Login from './components/login/Login';
import Theme from './components/theme/Theme';
import reducer from './reducers/';
import './css/index';

import ECLocalStorage from './util/ecLocalStorage';
window.ecLocalStorage = ECLocalStorage;

module.exports = {
    Login: Login,
    Theme: Theme,
    reducer: reducer
};