import React from 'react';
import { Router, Route, IndexRedirect } from 'dva/router';
import { validateLogin } from 'services/auth';

import AppLayout from './main/AppLayout';
import Home from './main/Home';

import RankList from './train/RankList';
import SpiderSubmit from './train/SpiderSubmit';

import BlogIndex from './blog/BlogIndex';
import BlogDetail from './blog/BlogDetail';

import AchievementIndex from './achievement/AchievementIndex';

import ProfileApp from './principal/ProfileApp';
import BlogEdit from './principal/BlogEdit';


/* eslint react/prop-types:0 */
export default ({ history }) => (
  <Router history={history}>
    <Route path="/meter" component={AppLayout} onEnter={validateLogin}>
      <IndexRedirect to="/meter/main" />
      <Route path="main" component={Home} />
      <Route path="train">
        <IndexRedirect to="rank" />
        <Route path="rank" component={RankList} />
        <Route path="submits" component={SpiderSubmit} />
      </Route>
      <Route path="blog">
        <IndexRedirect to="index" />
        <Route path="index" component={BlogIndex} />
        <Route path="detail/:id" component={BlogDetail} />
      </Route>
      <Route path="achievement">
        <IndexRedirect to="index" />
        <Route path="index" component={AchievementIndex} />
      </Route>
      <Route path="principal">
        <IndexRedirect to="profile" />
        <Route path="profile" component={ProfileApp} />
        <Route path="blog/create" component={BlogEdit} />
        <Route path="blog/edit/:id" component={BlogEdit} />
      </Route>
    </Route>
  </Router>
);
