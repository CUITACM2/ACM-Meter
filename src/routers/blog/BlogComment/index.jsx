import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Input, Button } from 'antd';
import { getAvatar } from 'models/user';
import { joinCDN } from 'src/config';
import './style.less';

class BlogComment extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    blog: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    comments: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      commentValue: '',
      replyTarget: -1,
      replyValue: '',
    };
    this.onTypingComment = this.onTypingComment.bind(this);
    this.onPostComment = this.onPostComment.bind(this);
  }

  componentDidMount() {
    // todo
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.blog !== this.props.blog && nextProps.blog.id != null) {
      const { blog } = nextProps;
      this.props.dispatch({
        type: 'comment/fetchListByArticle',
        payload: { article_id: blog.id }
      });
    }
  }

  onTypingComment(e, key) {
    e.preventDefault();
    this.setState({ [key]: e.target.value });
  }

  onPostComment(e, valueKey, parentId = null) {
    e.preventDefault();
    const { blog } = this.props;
    this.props.dispatch({
      type: 'comment/createByArticle',
      payload: {
        article_id: blog.id,
        params: { description: this.state[valueKey], parent_id: parentId }
      }
    });
    this.setState({ replyTarget: -1, replyValue: '', commentValue: '' });
  }

  renderReplyBox(comment) {
    const { replyTarget, replyValue } = this.state;
    if (replyTarget !== comment.id) return null;
    return (
      <div className="comment-reply-box">
        <Input
          type="textarea" rows={2} value={replyValue}
          ref={node => { this.commentInput = node; }}
          onChange={e => this.onTypingComment(e, 'replyValue')}
        />
        <Button
          onClick={e => this.onPostComment(e, 'replyValue', comment.id)}
          disabled={replyValue == null || replyValue.length < 3}
        >
          提交回复
        </Button>
        <span className="tip">评论不能少于3个字</span>
      </div>
    );
  }

  renderCommentList() {
    const { comments } = this.props;
    const onClickReply = (e, comment) => {
      e.preventDefault();
      if (this.state.replyTarget === comment.id) {
        this.setState({ replyTarget: -1 });
      } else {
        this.setState({ replyTarget: comment.id });
      }
    };
    return (
      <ul className="comment-list">
        {comments.map(comment =>
          <li key={comment.id}>
            <img alt="avatar" className="comment-user-avatar" src={joinCDN(comment.user_avatar)} />
            <section className="comment-body">
              <span className="comment-user-name">
                <b>{comment.user_name}</b> · {comment.created_at}
              </span>
              {comment.parent_comment ? (
                <div className="parent-comment">
                  <span className="comment-user-name">
                    回复 <b>{comment.parent_comment.user_name}</b>
                  </span>
                  {comment.parent_comment.description}
                </div>
              ) : null}
              {comment.description}
              <div className="comment-operation">
                <a onClick={e => onClickReply(e, comment)}>回复</a>
                {this.renderReplyBox(comment)}
              </div>
            </section>
          </li>
        )}
      </ul>
    );
  }

  renderCommentInput() {
    const { currentUser } = this.props;
    const { commentValue } = this.state;
    return (
      <div className="comment-input-box">
        <img alt="avatar" className="avatar" src={getAvatar(currentUser)} />
        <div className="comment-input">
          <Input
            type="textarea" rows={4} value={commentValue}
            ref={node => { this.commentInput = node; }}
            onChange={e => this.onTypingComment(e, 'commentValue')}
          />
        </div>
        <div className="comment-input-submit pull-right" >
          <span className="tip">评论不能少于3个字</span>
          <Button
            onClick={e => this.onPostComment(e, 'commentValue')}
            disabled={commentValue == null || commentValue.length < 3}
          >
            提交
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { comments } = this.props;
    return (
      <div className="blog-comment">
        {comments.length > 0 ? <h3>{comments.length} 条评论</h3> : <h3>评论</h3>}
        {this.renderCommentList()}
        {this.renderCommentInput()}
      </div>
    );
  }
}

const mapStateToProps = ({ loading, user, article, comment }) => ({
  loading: loading.models.article || false,
  currentUser: user.currentUser,
  article: article.currentItem,
  comments: comment.list,
});

export default connect(mapStateToProps)(BlogComment);
