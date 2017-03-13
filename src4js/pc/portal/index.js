import Route from 'react-router/lib/Route';
// 门户样式
import './css/homepage.css';

//门户设置样式
import './css/fancyboc.css';

//门户设置样式
import './css/esetting.css';

//门户相关js
import './util/home.js';

import Portal from './components/Portal';
import Synergy from './components/Synergy';
import reducer from './reducers/';

module.exports = {
	reducer,
	Homepage: Portal,
	Synergy
};