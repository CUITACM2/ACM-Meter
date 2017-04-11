import request, { requestWithToken } from 'utils/request';
import { API_ROOT } from 'src/config';
import { withParams } from 'utils/qs';

export function fetchArticles(page, per, params = {}) {
  const query = { page, per, ...params };
  return request(withParams(`${API_ROOT}/articles`, query));
}

export function fetchSolutions(page, per, params = {}) {
  const query = { page, per, ...params };
  return requestWithToken(withParams(`${API_ROOT}/solutions`, query));
}

export function fetchArticle(id) {
  return requestWithToken(`${API_ROOT}/articles/${id}`);
}

export function createArticle(params) {
  return requestWithToken(`${API_ROOT}/articles`, {
    method: 'POST', body: JSON.stringify(params),
  }, true);
}

export function updateArticle(id, params) {
  return requestWithToken(`${API_ROOT}/articles/${id}`, {
    method: 'PUT', body: JSON.stringify(params),
  }, true);
}

export function deleteArticle(id) {
  return requestWithToken(`${API_ROOT}/articles/${id}`, {
    method: 'DELETE'
  });
}

export function fetchArticleComments(articleId, page, per, params = {}) {
  const query = { page, per, ...params };
  return requestWithToken(withParams(`${API_ROOT}/articles/${articleId}/comments`, query));
}

export function createArticleComment(articleId, params) {
  return requestWithToken(`${API_ROOT}/articles/${articleId}/comments`, {
    method: 'POST', body: JSON.stringify(params),
  }, true);
}

export function likeArticle(articleId) {
  return requestWithToken(`${API_ROOT}/articles/${articleId}/like`, {
    method: 'PUT'
  });
}
