import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Input, Pagination, Card, Icon } from 'antd';
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
    super(props);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  renderAchieItem(item) {
    return (
      <Card key={item.id} title={item.name} className="achievement-card" >
        <p className="achievement-card-desc">{item.description}</p>
        <div className="achievement-card-tip">
          <span><Icon type="tags" /> {HumanAchievementType[item.achievement_type]}</span>
          <span><Icon type="star" /> {item.score}</span>
        </div>
      </Card>
    )
  }

  handlePageChange (page) {
    this.props.dispatch(routerRedux.push({
      pathname: '/meter/achievement/all',
      query: { ...this.props.location.query, page }
    }));
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
        <div>
          {
            list.map(item => this.renderAchieItem(item))
          }
        </div>
        <div className="pagination-center">
            <Pagination {...pagination} onChange={this.handlePageChange} />
        </div>
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

