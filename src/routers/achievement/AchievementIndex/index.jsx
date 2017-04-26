import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Progress, Tabs } from 'antd';
import './style.less';
import mock from './mock'

const TabPane = Tabs.TabPane

export default class AchievementIndex extends React.PureComponent {
  constructor(props) {
    super(props)
    console.log(props.list)
    this.handleChange = this.handleChange.bind(this)
  }

  renderMyComplete (item) {
    return (
      <div key={item.id} className="achie-item complete">
        <h3 className="achie-item-header">{item.id}</h3>
        <p className="achie-item-desc">{item.situation}</p>
        <span className="achie-item-score">
          {item.score}
        </span>
      </div>
    )
  }

  handleChange () {
    console.log('change')
  }

  render() {
    return (
      <div className="achievement-index">
        <Tabs defaultActiveKey="1" onChange={this.handleChange}>
          <TabPane tab="成就概览" key="1">
            <Progress percent={30} status="active"/>
            <h3 className="achievement-index-title">最近获得</h3>
            {
              mock.list.map(item => this.renderMyComplete(item))
            }
          </TabPane>
          <TabPane tab="进行中" key="2">进行中</TabPane>
          <TabPane tab="已完成" key="3">已完成</TabPane>
        </Tabs>
      </div>
    );
  }
}
