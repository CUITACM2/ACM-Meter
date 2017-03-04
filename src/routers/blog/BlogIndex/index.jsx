import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Pagination, Tag, Radio } from 'antd';
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

  render() {
    const { list, pagination } = this.props;
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
                <h4><Link>{blog.title}</Link></h4>
                <p>{blog.user ? blog.user.name : ''}</p>
              </li>
            )}
          </ul>
          <Pagination {...pagination} />
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
