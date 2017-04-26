import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Progress, Tabs, Pagination } from 'antd';
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
    super(props)
    console.log(props.list)
    this.handleChange = this.handleChange.bind(this)
  }

  renderMyComplete (item) {
    const isCompleted = !!item.completed
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

  handleChange () {
    console.log('change')
  }

  render() {
    const { list, pagination } = this.props

    return (
      <div className="achievement-index">
        <Tabs defaultActiveKey="1" onChange={this.handleChange}>
          <TabPane tab="广播" key="1">
            {
              list.map(item => this.renderMyComplete(item))
            }
            <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={this.handleChange} />
          </TabPane>
          <TabPane tab="进行中" key="2">进行中</TabPane>
          <TabPane tab="已完成" key="3">已完成</TabPane>
        </Tabs>
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

export default connect(mapStateToProps)(AchievementIndex)
