import E9Login from './components/login/E9Login';
import E9Theme from './components/theme/ecology9/E9Theme';

import reducer from './reducers/';

// 字体图标样式
import './css/font.css'; // 实心图标
//import './css/font-o.css'; // 空心图标
import './css/head.css';
import './css/menu.css';
import './css/menu-custom.css';

// 主题样式
import './css/e9login.css';
import './css/e9theme.css';
import './css/e9header.css';
import './css/e9menu.css';
import './css/hrmcard.css';


//工具方法
import './apis/promisfetch.js';
import './util/globalVaribale.js';
import './util/common.js';

module.exports = {
    Login: E9Login,
    Theme: E9Theme,
    reducer: reducer
};