import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Icon, Modal } from 'antd';
import UserForm from 'components/form/UserForm';
import AvatarUpload from 'components/AvatarUpload';
import './style.less';

class ProfileCard extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    width: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired
  }

  static defaultProps = {
    width: 200
  }

  constructor(props) {
    super(props);
    this.state = {
      visibleEditUserModal: false
    };
    this.onUpdateUser = (id, params) => {
      console.log('ProfileCard', params)
      this.props.dispatch({type:'user/update',payload:{id, params}});
    };
    this.afterAvatarUpload = (newUser) => {
      this.props.dispatch({
        type: 'user/loadCurrentUserSuccess',
        payload: { user: newUser }
      });
    };
    this.controlEditUserModal = (visible) => {
      this.setState({ visibleEditUserModal: visible });
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.controlEditUserModal(false);
    }
  }

  renderUserInfo(user) {
    const notWrite = '未填';
    const userInfo = user.user_info || {};
    return (
      <ul className="user-info">
        <li>
          <span className="icon"><Icon type="smile" /></span>
          <span className="content">{user.gender ? '男' : '女'}</span>
        </li>
        <li>
          <span className="icon"><Icon type="team" /></span>
          <span className="content">{userInfo.stu_id || notWrite}</span>
        </li>
        <li>
          <span className="icon"><Icon type="mail" /></span>
          <span className="content">{userInfo.email || notWrite}</span>
        </li>
        <li>
          <span className="icon"><Icon type="environment" /></span>
          <span className="content">
            {userInfo.school} {userInfo.college} {userInfo.major} {userInfo.grade}
          </span>
        </li>
      </ul>
    );
  }


  render() {
    const { width, user } = this.props;
    const avatarBottom = (width / 4) + 10;
    const cardStyle = { width, minWidth: 200 };
    return (
      <div>
        <Card style={cardStyle} bodyStyle={{ padding: 0 }}>
          <div className="custom-card-avatar" style={{ marginBottom: avatarBottom }}>
            <AvatarUpload user={user} afterUpload={this.afterAvatarUpload} />
          </div>
          <div className="custom-card-body">
            <h3>{ user.display_name }</h3>
            <p className="description">
              { user.description ? user.description : '这个人很懒，什么都没有留下' }
            </p>
          </div>
        </Card>
        <Card
          title="信息" style={{ ...cardStyle, marginTop: 10 }} bodyStyle={{ padding: 10 }}
          extra={<a onClick={() => this.controlEditUserModal(true)}>修改</a>}
        >
          {this.renderUserInfo(user)}
        </Card>
        <Modal
          title="修改用户信息" visible={this.state.visibleEditUserModal} footer={null}
          onCancel={() => this.controlEditUserModal(false)} style={{ top: 20 }}
        >
          <UserForm onSubmit={this.onUpdateUser} user={user} />
        </Modal>
      </div>
    );
  }
}


export default connect()(ProfileCard);
