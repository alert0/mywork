// import { combineReducers } from 'redux'
// import {routerReducer} from 'react-router-redux/lib/reducer'
import homepage from './homepage'
import element from './element';
import econtent from './econtent'
import specialelement from './specialelement'
import titlecontainer from './titlecontainer';
import contacts from './contacts'
import scratchpad from './scratchpad'
import custompage from './custompage'
import mycalendar from './mycalendar'

// const rootReducer = combineReducers({
// 	req,
// 	list,
// 	add,
// 	routing:routerReducer
// })

export default {
	homepage,
	element,
	econtent,
	specialelement,
	titlecontainer,
	contacts,
	scratchpad,
	custompage,
	mycalendar
}