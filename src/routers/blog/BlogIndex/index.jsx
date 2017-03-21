import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Pagination, Tag, Radio, Icon } from 'antd';
import { getAvatar } from 'models/user';
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
  }

  onPageChange(page) {
    this.props.dispatch(routerRedux.push({
      pathname: '/meter/blog/index',
      query: { ...this.props.location.query, page },
    }));
  }

  renderBlog(blog) {
    return (
      <li key={blog.id}>
        <div className="blog-item-rank">
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
    return (
      <div className="blog-index">
        <div className="blog-tabs">
          <Radio.Group value="large" size="large">
            <Radio.Button value="large">最新</Radio.Button>
            <Radio.Button value="default">热门</Radio.Button>
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
