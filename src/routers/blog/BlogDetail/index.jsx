import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Tag } from 'antd';
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
    return (
      <div className="blog">
        <div className="blog-header">
          <h1>{article.title}</h1>
          {
            article && article.tags && article.tags.map((tag, index) =>
              <Tag color="#2db7f5" key={index}>{tag}</Tag>
            )
          }
          <span className="">{article.user ? article.user.name : ''}</span>
          <span className="">{article.created_at}</span>
        </div>
        <div className="blog-content">
          <p>{article.content}</p>
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
