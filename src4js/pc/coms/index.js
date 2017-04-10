import comsReducer from './reducers/'
import * as WeaTableAction from './actions/table'
import WeaTable from './components/Table'

WeaTable.action = WeaTableAction;

module.exports = {
	comsReducer,
	WeaTable
}