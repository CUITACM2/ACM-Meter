import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Progress, Tabs, Pagination } from 'antd';
import { routerRedux } from 'dva/router';
import { formatTime } from 'utils/index';
import './style.less';

const TabPane = Tabs.TabPane

class AchievementIndex extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    list: PropTypes.array,
    type: PropTypes.string,
    filters: PropTypes.object,
    pagination: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  renderMyComplete (item) {
    const isCompleted = !!item.completed;
    if (!item.achievement) {
      return;
    }
    return (
      <div key={item.id} className={isCompleted ? 'achievement-item complete' : 'achievement-item'}>
        <div className="achievement-item-top">
          <span className="achievement-item-header">{item.achievement.name}</span>
          <span className="achievement-item-score">
            {item.achievement.score}
          </span>
        </div>
        {
          !isCompleted && 
          <Progress
            className="achievement-item-process"
            strokeWidth={16}
            percent={item.current / item.total * 100} 
            format={() => `${item.current}/${item.total}`}/>
        }
        <div className="achievement-item-bottom">
          <span className="achievement-item-desc">{item.achievement.description}</span>
          <span className="achievement-item-time">{
            isCompleted ? `达成日期 ${formatTime(item.completed_at)}` : `开始日期 ${formatTime(item.created_at)}`
            }</span>
        </div>
      </div>
    )
  }

  handlePageChange (page) {
    this.props.dispatch(routerRedux.push({
      pathname: '/meter/achievement/index',
      query: { ...this.props.location.query, page }
    }));
  }

  handleTabChange (flag) {
    let query = {
      ...this.props.location.query,
    }
    // 根据 flag 设置 query
    // -1 为全部
    if (flag !== '-1') {
      query.filters = JSON.stringify({
        completed: flag
      });
    } else {
      query.filters = '{}';
    }
    this.props.dispatch(routerRedux.push({
      pathname: '/meter/achievement/index',
      query 
    }));
  }

  

  render() {
    const { list, pagination } = this.props;
    let filters = JSON.parse(this.props.location.query.filters).completed;
    const activeKey = typeof filters === 'undefined' ? '-1' : filters;

    return (
      <div className="achievement-index">
        <Tabs defaultActiveKey={activeKey} onChange={this.handleTabChange}>
          <TabPane tab="广播" key="-1"></TabPane>
          <TabPane tab="进行中" key="0"></TabPane>
          <TabPane tab="已完成" key="1"></TabPane>
        </Tabs>
         {
           list.map(item => this.renderMyComplete(item))
         }
        <div className="pagination-center">
            <Pagination {...pagination} onChange={this.handlePageChange} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ loading, achievement }) => ({
  loading: loading.models.achievement,
  list: achievement.list,
  filters: achievement.filters,
  pagination: {
    current: achievement.page,
    pageSize: achievement.per,
    total: achievement.totalCount
  }
})

export default connect(mapStateToProps)(AchievementIndex);
