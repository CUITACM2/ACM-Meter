import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { fetchArticleComments, createArticleComment } from 'services/article';

const extractParams = query => {
  const { page = 1, search = '', sortField = 'created_at', sortOrder = 'descend' } = query;
  const filters = JSON.parse(query.filters || '{}');
  return { page: parseInt(page, 10), search, sortField, sortOrder, filters };
};

export default {
  namespace: 'comment',
  state: {
    currentItem: {},
    list: [],
    page: 1,
    per: 10,
    totalCount: 0,
    totalPages: 0,
    search: '',
    sortOrder: 'descend',
    sortField: 'id',
    filters: {}
  },
  subscriptions: {
    detailSubscriber({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/meter/blog/detail/:id').exec(pathname);
        if (match) {
          const emptyList = {
            items: [],
            meta: { current_page: 1 }
          };
          dispatch({ type: 'saveList', payload: emptyList });
        }
      });
    },
  },
  effects: {
    *fetchListByArticle({ payload }, { put, call, select }) {
      const params = extractParams(payload);
      const per = yield select(state => state.comment.per);
      const response = yield call(
        fetchArticleComments,
        payload.article_id, params.page, per,
        { sort_field: params.sortField, sort_order: params.sortOrder }
      );
      yield put({ type: 'saveList', payload: response });
    },
    *createByArticle({ payload }, { call, put }) {
      const response = yield call(createArticleComment, payload.article_id, payload.params);
      if (response.comment) {
        message.success('创建成功');
        yield put({ type: 'createSuccess', payload: response.comment });
      } else {
        message.error('创建失败');
      }
    }
  },
  reducers: {
    saveParams(state, { payload }) {
      return { ...state, ...extractParams(payload) };
    },
    saveList(state, { payload }) {
      return {
        ...state,
        list: payload.items,
        page: payload.meta.current_page,
        totalCount: payload.meta.total_count,
        totalPages: payload.meta.total_pages,
      };
    },
    createSuccess(state, { payload }) {
      return { ...state, list: [payload, ...state.list] };
    }
  }
};
