import comsReducer from './reducers/'
import * as WeaTableAction from './actions/table'
import * as WeaLocaleAction from './actions/locale'
import WeaTable from './components/Table'
import WeaLocale from './components/Locale'

WeaTable.action = WeaTableAction;
WeaLocale.action = WeaLocaleAction;

module.exports = {
	comsReducer,
	WeaTable,
	WeaLocale
}