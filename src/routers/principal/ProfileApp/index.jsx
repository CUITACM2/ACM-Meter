import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import ProfileCard from 'components/ProfileCard';
import ProfileAccount from '../ProfileAccount';
import ProfileBlog from '../ProfileBlog';
import './style.less';

const TabPane = Tabs.TabPane;

class ProfileApp extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  render() {
    return (
      <div className="profile-container">
        <ProfileCard width={240} user={this.props.user} />
        <div className="profile-tab">
          <Tabs defaultActiveKey="1">
            <TabPane tab="解题报告" key="1">
              <ProfileBlog user={this.props.user} />
            </TabPane>
            <TabPane tab="OJ账号" key="2">
              <ProfileAccount user={this.props.user} />
            </TabPane>
            <TabPane tab="提交" key="3">提交</TabPane>
            <TabPane tab="成就" key="4">成就</TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user: user.currentUser || {},
});

export default connect(mapStateToProps)(ProfileApp);

