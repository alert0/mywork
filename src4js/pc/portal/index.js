import ECLocalStorage from './util/ecLocalStorage';
window.ecLocalStorage = ECLocalStorage;

import objectAssign from 'object-assign';
// 门户样式
import './css/homepage.css';
//门户设置样式
import './css/esetting.css';
//图片元素弹窗插件样式
import './css/fancyboc.css';
//图片元素弹窗插件样式
import './css/hpsetting.css';
//门户依赖相关js
import './util/';

//协同区组件
import Synergy from './components/Synergy';

//门户相关
import Portal from './components/Portal';
import PortalSetting from './components/PortalSetting';
import preducer from './reducers/';
import paction from './actions/';

//元素相关
import * as Elements from './elements/'
const ereducer = Elements.reducer;
const eaction = Elements.action;

//合并aciton和reducer
const reducer = objectAssign({},preducer,ereducer); 
const action = objectAssign({},paction,eaction);

module.exports = {
	reducer,
	Homepage: Portal,
	PortalSetting,
	Synergy,
	action
};




