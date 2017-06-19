import Route from "react-router/lib/Route"

import Home from "./components/Home.js"
import TotalBudget from "./components/TotalBudget.js"

import "./css/icon.css"

import reducer from "./reducers/"
import * as TotalBudgetAction from "./actions/totalBudget.js"

const fnaRoute = (
	<Route path="fna" component={ Home }>
	    <Route name="totalBudget" path="totalBudget" component={ TotalBudget } />
  	</Route>
)

module.exports = {
	Route: fnaRoute,
	reducer,
	action: {
		TotalBudgetAction,
	}
}