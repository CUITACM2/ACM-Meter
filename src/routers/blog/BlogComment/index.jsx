import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Input, Button } from 'antd';
import { getAvatar } from 'models/user';
import './style.less';

class BlogComment extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    currentUser: PropTypes.object,
  }

  renderCommentInput() {
    const { currentUser } = this.props;
    return (
      <div className="comment-input-box">
        <img alt="avatar" className="avatar" src={getAvatar(currentUser)} />
        <div className="comment-input">
          <Input type="textarea" rows={4} />
        </div>
        <Button className="pull-right">提交</Button>
      </div>
    );
  }

  render() {
    return (
      <div className="blog-comment">
        <h3>评论</h3>
        {this.renderCommentInput()}
      </div>
    );
  }
}

const mapStateToProps = ({ loading, user, article }) => ({
  loading: loading.models.article || false,
  currentUser: user.currentUser,
  article: article.currentItem,
});

export default connect(mapStateToProps)(BlogComment);
