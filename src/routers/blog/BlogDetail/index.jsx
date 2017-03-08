import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Tag, Icon } from 'antd';
import marked from 'marked';
import './style.less';

class BlogDetail extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    article: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const article = this.props.article;

    function createMarkup(content) {
      return {__html: marked(content)};
    }

    return (
      <div className="blog">
        <div className="blog-header">
          <h1>{article.title}</h1>
          {
            article && article.tags && article.tags.map((tag, index) =>
              <Tag color="#2db7f5" key={index}>{tag}</Tag>
            )
          }
          <span className="blog-header-user">{article.user ? article.user.name : ''}</span>
          <span className="blog-header-time">发布于: {article.created_at}</span>
          <div className="blog-header-like">
            <Icon type="heart-o" />
            <span>{article.like_times}</span>
          </div>
        </div>
        <div className="blog-content" dangerouslySetInnerHTML={article.content && createMarkup(article.content)}>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ loading, article }) => ({
  loading: loading.models.article,
  article: article.currentItem,
});

export default connect(mapStateToProps)(BlogDetail);
