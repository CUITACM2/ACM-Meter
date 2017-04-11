import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Pagination, Radio } from 'antd';
import './style.less';


class BlogIndex extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    user: PropTypes.object,
    list: PropTypes.array,
    filters: PropTypes.object,
    pagination: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.onPageChange = this.onPageChange.bind(this);
    this.onClickBlogTabs = this.onClickBlogTabs.bind(this);
    this.onClickLikeBlog = this.onClickLikeBlog.bind(this);
  }

  onPageChange(page) {
    this.props.dispatch(routerRedux.push({
      pathname: '/meter/blog/index',
      query: { ...this.props.location.query, page }
    }));
  }

  onClickBlogTabs(e) {
    const order = e.target.value;
    this.props.dispatch(routerRedux.push({
      pathname: '/meter/blog/index',
      query: { ...this.props.location.query, order }
    }));
  }

  onClickLikeBlog(id) {
    this.props.dispatch({
      type: 'article/like',
      payload: { id }
    });
  }

  renderBlog(blog) {
    const blogRankClass = classNames('blog-item-rank', blog.like_times > 0 ? 'green' : '');
    return (
      <li key={blog.id}>
        <div className={blogRankClass} onClick={() => this.onClickLikeBlog(blog.id)}>
          <span className="blog-like-times">{blog.like_times}</span>
          <i>推荐</i>
        </div>
        <div className="blog-item-info">
          <h4><Link to={`/meter/blog/detail/${blog.id}`}>{blog.title}</Link></h4>
          <p className="blog-item-summary">{blog.summary}</p>
          <p className="blog-item-user">
            <b>{blog.user ? blog.user.name : ''}</b> 发布于 {blog.created_at}
          </p>
        </div>
      </li>
    );
  }

  render() {
    const { list, pagination } = this.props;
    const { order = 'latest' } = this.props.location.query;
    return (
      <div className="blog-index">
        <div className="blog-tabs">
          <Radio.Group value={order} size="large" onChange={this.onClickBlogTabs}>
            <Radio.Button value="latest">最新</Radio.Button>
            <Radio.Button value="hottest">热门</Radio.Button>
          </Radio.Group>
        </div>
        <div className="blog-card">
          <ul className="blog-list">
            {list.map(blog => this.renderBlog(blog))}
          </ul>
          <div className="pagination-center">
            <Pagination {...pagination} onChange={this.onPageChange} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ loading, article }) => ({
  loading: loading.models.article,
  list: article.list,
  filters: article.filters,
  pagination: {
    current: article.page,
    pageSize: article.per,
    total: article.totalCount
  }
});

export default connect(mapStateToProps)(BlogIndex);
