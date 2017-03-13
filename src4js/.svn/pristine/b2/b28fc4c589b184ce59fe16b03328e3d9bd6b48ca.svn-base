import * as types from '../constants/ActionTypes'
import objectAssign from 'object-assign'
import {WeaTools} from 'weaCom'
const {ls} = WeaTools;

import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	wftypes:[],
    typesShow:[],
	typesCols:[],
	usedBeans:[],
	abcBtns:[],
	value:"",
	tabkey:'1',
	mulitcol: ls.getStr('wf-add-mulitcol') == 'false' ? false : true, //true:four false:one
	isAbc: ls.getStr('wf-add-isAbc') == 'true' ? true : false,
	abcSelected: "",
	loading:false,
	importData:[],
	importDataShow:[],
	importValue:"",
	curOperWfid:0,
	showBeagenters:false,
	showImportWf:false
});

export default function list(state = initialState, action) {
    switch (action.type) {
        case types.SET_ADD_LOADING:
			return state.merge({loading:action.data});
        case types.SET_WFTYPES:
			return state.merge({wftypes:action.data,loading:false});
        case types.SET_SEARCH_VALUE:
			return state.merge({value:action.data});
        case types.SET_TABKEY:
			return state.merge({tabkey:action.data});
        case types.SET_MULITCOL:
			return state.merge({mulitcol:action.data});
        case types.SET_ISABC:
			return state.merge({isAbc:action.data});
        case types.SET_TYPES_SHOW:
			return state.merge(function(){
				const wftypes = state.get("wftypes");
				const value = state.get("value");
				const isAbc = state.get("isAbc");
				const tabkey = state.get("tabkey");
				const abcSelected = state.get("abcSelected");
        		let typesShow = [];
        		let abcBtns = [];
        		wftypes.map(w=>{
        			let wNew = objectAssign({},w.toJS());
        			if(value !== "") {
						wNew.wfbeans = wNew.wfbeans.filter(b=>{return (b.name.indexOf(value)>=0 || b.id.indexOf(value)>=0 || b.spell.indexOf(value.toUpperCase())>=0) });
					}
        			if(tabkey == '2') {
						wNew.wfbeans = wNew.wfbeans.filter(b=>{return b.wfColl == "1"});
					}
        			typesShow.push(wNew);
        		})
        		if(isAbc){
	        		let typesABC = [];
	        		const colorarray = ["#55D2D4","#B37BFA","#FFC62E","#8DCE36","#37B2FF","#FF9537","#FF5E56"];
        			for(let i=0; i<27; i++){
		        		let wfBeansAbc = [];
		        		typesABC.push({
		        			"letter": i == 26 ? "···" : String.fromCharCode(65+i),
		        			"wfbeans":function(){
			        			typesShow.map(t=>{
	        						t.wfbeans.map(b=>{
										b.letter.charCodeAt(0) - 65 == i && wfBeansAbc.push(b);
										i == 26 && (b.letter.charCodeAt(0) >= 91 || b.letter.charCodeAt(0) < 65) && wfBeansAbc.push(b);
		        					});
		        				});
		        				return wfBeansAbc;
		        			}(),
		        			"color": colorarray[i%7],
		        			"disabled": wfBeansAbc.length <= 0,
		        			"selected": abcSelected == (i == 26 ? "···" : String.fromCharCode(65+i))
		        		});
        			}
        			abcBtns = typesABC;
        			typesShow = typesABC;
        		}
				typesShow = typesShow.filter(s=>{return s.wfbeans.length > 0});
        		return {typesShow: typesShow,abcBtns:abcBtns}
        	}());
   		case types.SET_TYPES_COLS:
			return state.merge(function(){
				const typesShow = state.get("typesShow");
        		const docWidth = document.documentElement.clientWidth;
	   			let typesCols = docWidth > 1400 ? [[],[],[],[]] : (docWidth > 1100 ? [[],[],[]] : (docWidth > 600 ? [[],[]] : [[]]));
	   			let colHeight = docWidth > 1400 ? [0,0,0,0] : (docWidth > 1100 ? [0,0,0] : (docWidth > 600 ? [0,0] : [0])); 
	   			!!typesShow && typesShow.size !== 0 && typesShow.map(t=>{
					const wfsize = t.get("wfbeans").size;
	   				if(wfsize >= 0){
	   					let minH = Math.min.apply(Math, colHeight);
			   			for(let i = 0 ;i < colHeight.length;i++){
			   				if(colHeight[i] == minH){
			   					typesCols[i].push(t);
			   					colHeight[i] += wfsize;
			   					break;
			   				}
			   			}
	   				}
	   			});
        		return {typesCols: typesCols}
        	}());
       	case types.SET_USED_BEANS:
		    return state.merge(function(){
				const typesShow = state.get("typesShow");
       			let usedBeans = [];
				!!typesShow && typesShow.size !== 0 && typesShow.map(t=>{
					t.get("wfbeans").map(b=>{
						!!b.get("usedtodo") && b.get("usedtodo") == '1' && usedBeans.length < 10 && usedBeans.push(b)
   					});
        		})
   				usedBeans.sort((a,b)=>{
					return a.get("usedtodoorder") - b.get("usedtodoorder");
   				})
       			return {usedBeans: usedBeans}
       		}());
       	case types.SET_IMPORT_DATA:
       		return state.merge({importData:action.data});
       	case types.SET_IMPORT_SEARCH_VALUE:
            return state.merge({importValue:action.data});
        case types.SET_IMPORT_DATA_SHOW:
			return state.merge(function(){
				const importData = state.get("importData");
				const importValue = state.get("importValue");
				let importDataShow = importData;
				if(importValue)
					importDataShow = importDataShow.filter(i=>{return i.get("value").indexOf(importValue) >= 0});
       			return {importDataShow: importDataShow}
        	}());
        case types.SET_ABC_SELECTED:
        	return state.merge({abcSelected:action.data});
		case types.SET_SHOW_BEAGENTERS:
			return state.merge({curOperWfid:action.wfid, showBeagenters:action.status});
		case types.SET_SHOW_IMPORTWF:
			return state.merge({curOperWfid:action.wfid, showImportWf:action.status});
        default:
            return state;
    }
}