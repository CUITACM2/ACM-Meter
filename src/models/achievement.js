import pathToRegexp from 'path-to-regexp';
import { extractParams } from 'utils/qs';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export const AchievementType = {
  AMOUNT: 'amount',
  SUBJECT: 'subject',
  CONTINUOUS: 'continuous'
};

export const HumanAchievementType = {
  amount: '数量级成就',
  subject: '专题成就',
  // continuous: '坚持成就'
};

export const HumanAmountType = {
  accepted: 'Accepted数量',
  blog: '发表解题报告',
  comment: '评论数',
  like: '点赞数',
  cf_rating: 'Codeforces的Rating'
};

export default {
  namespace: 'achievement',
  state: {
    currentItem: {},
    list: [],
    page: 1,
    per: 10,
    totalCount: 0,
    totalPages: 0,
    search: '',
    sortOrder: 'ascend',
    sortField: 'id',
    filters: {}
  },
  subscriptions: {},
  effects: {},
  reducers: {
  }
};
