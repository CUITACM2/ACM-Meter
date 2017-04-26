import React from 'react';
import PropTypes from 'prop-types';
import { Upload, message } from 'antd';
import { API_ROOT, joinCDN } from 'src/config';
import { getToken } from 'services/auth';
import './style.less';

export default class AvatarUpload extends React.PureComponent {

  static propTypes = {
    user: PropTypes.object,
    afterUpload: PropTypes.func
  }

  static defaultProps = {
    afterUpload: (newUser) => console.log('after upload', newUser)
  }

  render() {
    const { user } = this.props;
    const avatar = user.avatar;
    const avatarUrl = joinCDN(avatar && avatar.origin);
    const uploadProps = {
      name: 'avatar',
      action: `${API_ROOT}/users/${user.id}`,
      headers: { Authorization: `Bearer ${getToken()}` },
      showUploadList: false,
      onChange: (info) => {
        if (info.file.status === 'done') {
          const newUser = info.file.response.user;
          if (newUser) {
            message.success('头像上传成功');
            this.props.afterUpload(newUser);
          }
        } else if (info.file.status === 'error') {
          message.error('头像上传失败');
        }
      },
    };
    return (
      <div className="clearfix avatar-upload">
        <Upload {...uploadProps}>
          <div className="upload-img">
            <img alt="avatar" src={avatarUrl} />
            <div className="upload-mask"><span>更改头像</span></div>
          </div>
        </Upload>
      </div>
    );
  }
}
