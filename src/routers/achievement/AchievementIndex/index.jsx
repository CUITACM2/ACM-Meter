import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Progress } from 'antd';
import './style.less';
import mock from './mock'

export default class AchievementIndex extends React.PureComponent {

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

  render() {
    return (
      <div className="achievement-index">
        <h3>进展概况</h3>
        <Progress percent={30} status="active"/>
        <h3>最近获得</h3>
        {
          mock.list.map(item => this.renderMyComplete(item))
        }
        
      </div>
    );
  }
}
