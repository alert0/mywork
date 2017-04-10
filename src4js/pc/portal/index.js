import objectAssign from 'object-assign';
// 门户样式
import './css/homepage.css';
//门户设置样式
import './css/fancyboc.css';
//门户设置样式
import './css/esetting.css';

import './css/esetting.css';

//门户依赖相关js
import './util/portal';
//元素设置相关js
import './util/esetting';

//协同区组件
import Synergy from './components/Synergy';

//门户相关
import Portal from './components/Portal';
import preducer from './reducers/';
const paction = {}


//元素相关
import * as Elements from '../elements/'
const ereducer = Elements.reducer;
const eaction = Elements.action;

//合并aciton和reducer
const reducer = objectAssign({},preducer,ereducer); 
const action = objectAssign({},paction,eaction);

module.exports = {
	reducer,
	Homepage: Portal,
	Synergy,
	action
};




