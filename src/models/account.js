import { message } from 'antd';
import { extractParams } from 'utils/qs';
import { fetchAccounts, createAccount, updateAccount } from 'services/spider';


export const AccountStatus = {
  NOT_INIT: 0,
  NORMAL: 1,
  QUEUE: 2,
  UPDATING: 3,
  UPDATE_ERROR: 4,
  ACCOUNT_ERROR: 5,
  STOP: 100
};

export const OJ_MAP = {
  hdu: 'HDU',
  bnu: 'BNU',
  poj: 'POJ',
  vj: 'Hust Vjudge',
  cf: 'Codeforces',
  bc: 'Bestcoder'
};

export default {
  namespace: 'account',
  state: {
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
  effects: {
    *fetchList({ payload }, { put, call, select }) {
      const params = extractParams(payload);
      const per = yield select(state => state.account.per);
      const response = yield call(fetchAccounts, params.page, per, {
        search: params.search,
        sort_field: params.sortField,
        sort_order: params.sortOrder,
        filters: params.filters,
      });
      yield put({ type: 'saveList', payload: response });
    },
    *create({ payload, callback }, { put, call }) {
      const response = yield call(createAccount, payload.params);
      if (response.error_code !== 1 && response.account != null) {
        message.success('添加成功');
        if (callback) callback();
        yield put({ type: 'createSuccess', payload: response.account });
      } else {
        const err = response.message ? `: ${response.message}` : '';
        message.error(`添加失败${err}`);
      }
    },
    *update({ payload, callback }, { put, call }) {
      const response = yield call(updateAccount, payload.id, payload.params);
      if (response.error_code !== 1 && response.account != null) {
        message.success('修改成功');
        if (callback) callback();
        yield put({ type: 'updateSuccess', payload: response.account });
      } else {
        message.error('修改失败');
      }
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
    createSuccess(state, { payload }) {
      return { ...state, list: [payload, ...state.list] };
    },
    updateSuccess(state, { payload }) {
      return {
        ...state,
        list: state.list.map(account => (account.id !== payload.id ? account : payload)),
      };
    },
  }
};
