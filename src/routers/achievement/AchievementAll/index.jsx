import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Tag, Icon } from 'antd';
import { HumanAchievementType } from 'models/achievement';
import './style.less';

class MyTag extends React.PureComponent {
  state = { checked: false };
  handleChange = (checked) => {
    this.setState({ checked });
  }
  render() {
    return <Tag.CheckableTag className="type" {...this.props} checked={this.state.checked} onChange={this.handleChange} />;
  }
}



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
      <div>
        <div className="achie-type">
          <MyTag>全部</MyTag>
          {
            Object.keys(HumanAchievementType).map(key => {
              return <MyTag key={key}>{HumanAchievementType[key]}</MyTag>
            })
          }
        </div>
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
});

export default connect(mapStateToProps)(AchievementIndex);

