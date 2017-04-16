import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Alert } from 'antd';
import { OJ_MAP } from 'models/account';
import './style.less';

const getColumns = () => {
  const columns = [{
    title: '#',
    dataIndex: 'order',
    width: '5%',
  }, {
    title: '用户名',
    dataIndex: 'user_name',
    width: '8%',
    className: 'text-center',
    render: name => <b>{name}</b>
  }];
  const accountsColumns = Object.keys(OJ_MAP).map(ojKey => ({
    title: OJ_MAP[ojKey],
    dataIndex: `accounts.${ojKey}`,
    width: '12%',
    render: (accounts, record) => {
      const account = record.accounts[ojKey] || {};
      return (
        <div>
          {account.solved ? (<b>{ account.solved }&nbsp;/&nbsp;</b>) : null}
          {account.solved ? (<b>{ account.submitted }</b>) : null}
        </div>
      );
    }
  }));
  const lastColumns = [{
    title: 'Rank',
    dataIndex: 'train_rank',
    width: '10%',
    render: rank => <b className="red">{rank}</b>
  }];
  return [...columns, ...accountsColumns, ...lastColumns];
};

class RankList extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    list: PropTypes.array,
    pagination: PropTypes.object,
  }

  render() {
    const columns = getColumns();
    return (
      <div className="rank-list">
        <Alert
          type="info" showIcon closable
          message="帮助信息"
          description={<p>
            HDU, BNU, POJ, Hust Vjudge ==> <b>Accepted / Submitted</b><br />
            Codeforces, Bestcoder ==> <b>Rating / MaxRating</b><br />
          </p>}
        />
        <Table
          bordered size="small"
          onChange={this.handleTableChange}
          rowKey={record => record.user_id}
          columns={columns} dataSource={this.props.list}
          pagination={this.props.pagination} loading={this.props.loading}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ loading, rankList }) => ({
  loading: loading.models.rankList || false,
  list: rankList.list,
  pagination: {
    current: rankList.page,
    pageSize: rankList.per,
    total: rankList.totalCount,
    showQuickJumper: true,
    showTotal: total => <span>共有 {total} 条</span>,
  }
});

export default connect(mapStateToProps)(RankList);
