import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  fetchArticles, fetchArticle, updateArticle, deleteArticle
} from 'services/article';

export const ArticleType = {
  NEWS: 'News',
  SOLUTION: 'Solution'
};

export const ArticleStatus = {
  RECYCLE: 0,
  DRAFT: 1,
  PUBLISH: 2,
  PINNED: 3
};

const extractParams = query => {
  const { page = 1, search = '', sortField = 'id', sortOrder = 'descend' } = query;
  const filters = JSON.parse(query.filters || '{}');
  return { page: parseInt(page, 10), search, sortField, sortOrder, filters };
};

export default {
  namespace: 'article',
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
    listSubscriber({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/meter/blog/index') {
          dispatch({ type: 'saveParams', payload: query });
          dispatch({ type: 'fetchList', payload: query });
        }
      });
    },
    detailSubscriber({ dispatch, history }) {
      return history.listen(({ pathname, query}) => {
        const match = pathToRegexp('/meter/blog/detail/:id').exec(pathname);
        if (match) {
          const id = match[1];
          dispatch({ type: 'fetchItem', payload: id })
        }
      });
    },
    itemSubscriber({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/meter/principal/blog/edit/:id').exec(pathname);
        if (match) {
          const id = match[1];
          dispatch({ type: 'fetchItem', payload: id });
        }
      });
    },
  },
  effects: {
    *fetchList({ payload }, { put, call, select }) {
      const params = extractParams(payload);
      const per = yield select(state => state.article.per);
      const response = yield call(fetchArticles, params.page, per, {
        search: params.search,
        sort_field: params.sortField,
        sort_order: params.sortOrder,
        filters: params.filters,
      });
      yield put({ type: 'saveList', payload: response });
    },
    *fetchItem({ payload: id }, { put, call }) {
      const response = yield call(fetchArticle, id);
      yield put({ type: 'saveItem', payload: response.article });
    },
    *update({ payload }, { put, call }) {
      const response = yield call(updateArticle, payload.id, payload.params);
      if (response.article != null) {
        message.success('更新成功');
        if (payload.goback) {
          yield put(routerRedux.goBack());
        }
      } else {
        message.error('更新失败');
      }
    },
    *delete({ payload }, { put, call }) {
      const response = yield call(deleteArticle, payload);
      console.log(response);
      if (response.error_code === 0) {
        message.success('删除成功');
        yield put({ type: 'deleteSuccess', payload });
      } else {
        message.success('删除失败');
      }
    },
    *changeStatus({ payload }, { put, call }) {
      const response = yield call(updateArticle, payload.id, payload.params);
      if (response.error_code !== 1 && response.article != null) {
        message.success('修改成功');
        yield put({ type: 'updateSuccess', payload: response.article });
      } else {
        message.error('修改失败');
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
    saveItem(state, { payload }) {
      return { ...state, currentItem: payload };
    },
    deleteSuccess(state, { payload }) {
      return { ...state, list: state.list.filter(article => article.id !== payload) };
    },
    updateSuccess(state, { payload }) {
      return {
        ...state,
        list: state.list.map(article => (article.id !== payload.id ? article : payload))
      };
    }
  }
};
