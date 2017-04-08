import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table } from 'antd';
import { OJ_MAP } from 'models/account';


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
    width: '13%',
    render: (accounts, record) => {
      const account = record.accounts[ojKey] || {};
      const isRating = ['cf', 'bc'].indexOf(account.oj_name) >= 0;
      return (
        <div>
          {account.solved ? (
            <span>{isRating ? 'Rating' : 'Accepted'}: <b>{ account.solved }</b><br /></span>
          ) : null}
          {account.solved ? (
            <span>{isRating ? 'MaxRating' : 'Submitted'}: <b>{ account.submitted }</b></span>
          ) : null}
        </div>
      );
    }
  }));
  const lastColumns = [{
    title: 'Rank',
    dataIndex: 'train_rank',
    width: '6%',
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
      <div>
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
    showTotal: total => <span>共有 {total} 条提交</span>,
  }
});

export default connect(mapStateToProps)(RankList);
