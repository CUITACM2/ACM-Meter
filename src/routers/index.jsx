import React from 'react';
import { Router, Route, IndexRedirect } from 'dva/router';
import AppLayout from './main/AppLayout';
import Home from './main/Home';

/* eslint react/prop-types:0 */
export default ({ history }) => (
  <Router history={history}>
    <Route path="/meter" component={AppLayout}>
      <IndexRedirect to="/meter/main" />
      <Route path="main" component={Home} />
    </Route>
  </Router>
);
