import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'dva';
import { Tag, Spin } from 'antd';
import marked from 'marked';
import Highlight from 'react-highlight';
import BlogComment from '../BlogComment';
import './style.less';

class BlogDetail extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    blog: PropTypes.object,
  }

  renderBlogHeader(blog) {
    const blogRankClass = classNames('blog-item-rank', blog.like_times > 0 ? 'green' : '');
    return (
      <div className="blog-header">
        <h1>{blog.title}</h1>
        {blog.tags && blog.tags.length > 0 ? (
          <div className="blog-header-tags">
            {blog.tags.map(tag =>
              <Tag key={tag} color="blue">{tag}</Tag>
            )}
          </div>
        ) : null}
        <span className="blog-header-user">
          {blog.user ? blog.user.name : ''}
        </span>
        <span className="blog-header-time">
          发布于 {blog.created_at}
        </span>
        <div className={blogRankClass}>
          <span className="blog-like-times">{blog.like_times}</span>
          <i>推荐</i>
        </div>
      </div>
    );
  }

  render() {
    const { blog, loading } = this.props;
    return (
      <Spin spinning={loading} delay={500} tip="加载中...">
        <div className="blog">
          {this.renderBlogHeader(blog)}
          <Highlight className="blog-content markdown-content" innerHTML>
            {blog.content ? marked(blog.content) : null}
          </Highlight>
          <BlogComment blog={blog} />
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = ({ loading, article }) => ({
  loading: loading.models.article || false,
  blog: article.currentItem,
});

export default connect(mapStateToProps)(BlogDetail);
