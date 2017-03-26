import React, { PropTypes } from 'react';
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
        {/* <div className="blog-header-like">
          <Icon type="heart-o" />
          <span>{blog.like_times}</span>
        </div> */}
      </div>
    );
  }

  render() {
    const { blog, loading } = this.props;
    return (
      <Spin spinning={loading} delay={500} tip="加载中...">
        <div className="blog">
          {this.renderBlogHeader(blog)}
          <Highlight className="blog-content" innerHTML>
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
