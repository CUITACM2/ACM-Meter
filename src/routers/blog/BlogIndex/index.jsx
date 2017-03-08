import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Pagination, Tag, Radio, Icon } from 'antd';
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
    this.pageChangeHandler = this.pageChangeHandler.bind(this);
  }

  pageChangeHandler (page) {
    this.props.dispatch(routerRedux.push({
      pathname: '/meter/blog/index',
      query: { page },
    }));
  }

  render() {
    const { list, pagination } = this.props;
    console.log(list)
    return (
      <div className="blog-index">
        <div className="blog-tabs">
          <Radio.Group value="large" size="large">
            <Radio.Button value="large">最新</Radio.Button>
            <Radio.Button value="default">热门</Radio.Button>
          </Radio.Group>`
        </div>
        <div className="blog-card">
          <ul className="blog-list">
            {list.map(blog =>
              <li key={blog.id}>
                <div className="blog-list-left">
                  <Icon type="star" />
                  <span>{blog.like_times}</span>
                </div>
                <div className="blog-list-right">
                  <h4><Link to={"/meter/blog/detail/"+blog.id}>{blog.title}</Link></h4>
                  <p>{blog.summary}</p>
                  <p>{blog.user ? blog.user.name : ''}</p>
                </div>
              </li>
            )}
          </ul>
          <Pagination 
            {...pagination}
            onChange={this.pageChangeHandler} 
          />
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
