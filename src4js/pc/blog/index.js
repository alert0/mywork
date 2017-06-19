import Route from "react-router/lib/Route"

import Home from "./components/Home.js"
import MyBlog from "./components/MyBlog/"
import MyAttention from "./components/MyAttention.js"
import Report from "./components/Report.js"
import Setting from "./components/Setting.js"
//anruo : import test
import Test from "./components/Test/"

import "./css/icon.css"

import reducer from "./reducers/"
import * as MyBlogAction from "./actions/myBlog"
import * as MyAttentionAction from "./actions/myAttention"
import * as ReportAction from "./actions/Report"
import * as SettingAction from "./actions/Setting"

const blogRoute = (
  <Route path="blog" component={ Home }>
    <Route name="myBlog" path="myBlog" component={ MyBlog }/>
    <Route name="myAttention" path="myAttention" component={ MyAttention }/>
    <Route name="Report" path="Report" component={ Report }/>
    <Route name="Setting" path="Setting" component={ Setting }/>
    //anruo : test Route
    <Route path="test" component={Test}/>
  </Route>
)

module.exports = {
  Route: blogRoute,
  reducer,
  action: {
    MyBlogAction,
    MyAttentionAction,
    ReportAction,
    SettingAction,
  }
}