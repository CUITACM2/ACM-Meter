import { fetchRankList } from 'services/spider';

function extractParams(query) {
  const { page = 1 } = query;
  return { page: parseInt(page, 10) };
}

export default {
  namespace: 'rankList',
  state: {
    list: [],
    page: 1,
    per: 15,
    totalCount: 0,
    totalPages: 0
  },
  subscriptions: {
    listSubscription({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/meter/train/rank') {
          dispatch({ type: 'saveParams', payload: query });
          dispatch({ type: 'fetchRankList', payload: query });
        }
      });
    },
  },
  effects: {
    *fetchRankList({ payload }, { put, call, select }) {
      const params = extractParams(payload);
      const per = yield select(state => state.submit.per);
      const response = yield call(fetchRankList, params.page, per);
      yield put({ type: 'saveList', payload: response });
    },
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
  }
};
