import React, { PropTypes } from 'react';
import { Tabs } from 'antd';
import ProfileCard from 'components/ProfileCard';
import './style.less';

const TabPane = Tabs.TabPane;

class ProfileApp extends React.PureComponent {

  render() {
    return (
      <div className="profile-container">
        <ProfileCard width={240} />
        <div className="profile-tab">
          <Tabs defaultActiveKey="1">
            <TabPane tab="解题报告" key="1">解题报告</TabPane>
            <TabPane tab="OJ账号" key="2">OJ账号</TabPane>
            <TabPane tab="提交" key="3">提交</TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default ProfileApp;

