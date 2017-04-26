import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Input, Pagination } from 'antd';
import { HumanAchievementType } from 'models/achievement';
import './style.less';

const Search = Input.Search;

class AchievementAll extends React.PureComponent {
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
  }

  renderAchieItem(item) {
    return (
      <div key={item.id} className="achie-item complete">
        <h3 className="achie-item-header">{item.name}</h3>
        <p className="achie-item-desc">{item.description}</p>
        <span className="achie-item-score">
          {item.score}
        </span>
      </div>
    )
  }

  render() {
    const { list, pagination } = this.props;
    return (
      <div className="achievement-all">
        <Search
          placeholder="input search text"
          style={{ width: 200 }}
          onSearch={value => console.log(value)}
        />
        {
          list.map(item => this.renderAchieItem(item))
        }
      </div>
    );
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

export default connect(mapStateToProps)(AchievementAll)

