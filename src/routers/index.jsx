import React from 'react';
import { Router, Route, IndexRedirect } from 'dva/router';
import AppLayout from './main/AppLayout';
import Home from './main/Home';
import SpiderSubmit from './spider/SpiderSubmit';

/* eslint react/prop-types:0 */
export default ({ history }) => (
  <Router history={history}>
    <Route path="/meter" component={AppLayout}>
      <IndexRedirect to="/meter/main" />
      <Route path="main" component={Home} />
      <Route path="submits">
        <IndexRedirect to="list" />
        <Route path="list" component={SpiderSubmit} />
      </Route>
    </Route>
  </Router>
);
