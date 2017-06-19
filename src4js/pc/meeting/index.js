import Route from "react-router/lib/Route"

import Home from "./components/Home.js"
import CalView from "./components/CalView.js"
import RoomPlan from "./components/RoomPlan.js"
import Search from "./components/Search.js"
import Decision from "./components/Decision.js"
import Repeat from "./components/Repeat.js"

import "./css/icon.css"

import reducer from "./reducers/"
import * as CalViewAction from "./actions/calView"
import * as RoomPlanAction from "./actions/roomPlan"
import * as SearchAction from "./actions/search"
import * as DecisionAction from "./actions/decision"
import * as RepeatAction from "./actions/repeat"

const meetingRoute = (
  <Route path="meeting" component={ Home }>
    <Route name="calView" path="calView" component={ CalView }/>
    <Route name="roomPlan" path="roomPlan" component={ RoomPlan }/>
    <Route name="search" path="search" component={ Search }/>
    <Route name="decision" path="decision" component={ Decision }/>
    <Route name="repeat" path="repeat" component={ Repeat }/>
  </Route>
)

module.exports = {
  Route: meetingRoute,
  reducer,
  action: {
    CalViewAction,
    RoomPlanAction,
    SearchAction,
    DecisionAction,
    RepeatAction
  }
}