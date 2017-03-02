import React from 'react';
import { Router, Route, IndexRedirect } from 'dva/router';
import { validateLogin } from 'services/auth';

import AppLayout from './main/AppLayout';
import Home from './main/Home';

import RankList from './train/RankList';
import SpiderSubmit from './train/SpiderSubmit';

import AchievementApp from './achievement/AchievementApp';

import ProfileApp from './principal/ProfileApp';

/* eslint react/prop-types:0 */
export default ({ history }) => (
  <Router history={history}>
    <Route path="/meter" component={AppLayout} onEnter={validateLogin}>
      <IndexRedirect to="/meter/main" />
      <Route path="main" component={Home} />
      <Route path="train">
        <IndexRedirect to="submits" />
        <Route path="rank" component={RankList} />
        <Route path="submits" component={SpiderSubmit} />
      </Route>
      <Route path="achievement">
        <IndexRedirect to="index" />
        <Route path="index" component={AchievementApp} />
      </Route>
      <Route path="principal">
        <IndexRedirect to="profile" />
        <Route path="profile" component={ProfileApp} />
      </Route>
    </Route>
  </Router>
);
