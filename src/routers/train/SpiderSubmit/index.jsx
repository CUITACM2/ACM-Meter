import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Table, Modal } from 'antd';
import Highlight from 'react-highlight';
import SearchInput from 'components/SearchInput';
import { OJ_MAP } from 'models/account';
import './style.less';

const originPath = '/meter/train/submits';

const getColumns = (filters, sorter, operations) => {
  const columns = [{
    title: '用户名',
    dataIndex: 'user_name',
    width: '10%',
    className: 'text-center',
    sorter: true,
    sortOrder: sorter.field === 'user_name' && sorter.order,
  }, {
    title: 'Run ID',
    dataIndex: 'run_id',
    width: '12%',
  }, {
    title: 'OJ',
    dataIndex: 'oj_name',
    width: '10%',
    filters: Object.keys(OJ_MAP).map(oj => (
      { text: OJ_MAP[oj], value: oj }
    )),
    filteredValue: filters.oj_name || [],
    render: oj => <span>{OJ_MAP[oj]}</span>,
  }, {
    title: '题目',
    dataIndex: 'pro_id',
    width: '10%'
  }, {
    title: '语言',
    dataIndex: 'lang',
    width: '10%',
  }, {
    title: '运行时间',
    dataIndex: 'run_time',
    width: '10%',
    sorter: true,
    sortOrder: sorter.field === 'run_time' && sorter.order,
    render: time => (time < 0 ? null : <span>{time} MS</span>),
  }, {
    title: '内存',
    dataIndex: 'memory',
    width: '10%',
    sorter: true,
    sortOrder: sorter.field === 'memory' && sorter.order,
    render: memory => (memory < 0 ? null : <span>{memory} KB</span>),
  }, {
    title: '提交时间',
    dataIndex: 'submitted_at',
    width: '20%',
    sorter: true,
    sortOrder: sorter.field === 'submitted_at' && sorter.order,
  }];
  if (operations != null) {
    columns.push({
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span>
          <Link onClick={() => operations.onShowCode(record)}>代码</Link>
        </span>
      ),
    });
  }
  return columns;
};

class SpiderSubmit extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    list: PropTypes.array,
    sorter: PropTypes.object,
    filters: PropTypes.object,
    pagination: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showCode: false,
      activeRecord: null,
    };
    this.onSearch = this.onSearch.bind(this);
    this.onShowCode = this.onShowCode.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  onSearch(value) {
    this.props.dispatch(routerRedux.push({
      pathname: originPath,
      query: { ...this.props.location.query, search: value }
    }));
  }

  onShowCode(record) {
    this.setState({
      activeRecord: record,
      showCode: true
    });
  }

  handleTableChange(pagination, filters, sorter) {
    const params = {
      page: pagination.current,
      filters: JSON.stringify(filters)
    };
    if (sorter && sorter.field) {
      params.sortField = sorter.field;
      params.sortOrder = sorter.order;
    }
    this.props.dispatch(routerRedux.push({
      pathname: originPath,
      query: { ...this.props.location.query, ...params }
    }));
  }

  render() {
    const columns = getColumns(this.props.filters, this.props.sorter, {
      onShowCode: this.onShowCode
    });
    const { showCode, activeRecord } = this.state;
    return (
      <div className="submit-table">
        <div className="table-operations clear-fix">
          <div className="pull-right">
            <SearchInput onSearch={this.onSearch} style={{ width: 200 }} />
          </div>
        </div>
        <Table
          bordered size="small"
          onChange={this.handleTableChange}
          rowKey={record => record.id}
          columns={columns} dataSource={this.props.list}
          pagination={this.props.pagination} loading={this.props.loading}
        />
        <Modal
          closable maskClosable
          title="查看代码" visible={showCode} footer={null}
          style={{ top: 20 }} width={720}
          onCancel={() => this.setState({ showCode: false })}
        >
          {activeRecord ? (
            <div>
              <div>
                <span>用户名: {activeRecord.user_name}</span>
                <span className="divider" />
                <span>Run ID: {activeRecord.run_id}</span>
                <span className="divider" />
                <span>OJ: {OJ_MAP[activeRecord.oj_name]}</span>
              </div>
              <Highlight className="code-block">
                {activeRecord.code}
              </Highlight>
            </div>
          ) : null}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ loading, submit }) => ({
  loading: loading.models.submit,
  list: submit.list,
  filters: submit.filters,
  sorter: {
    order: submit.sortOrder,
    field: submit.sortField,
  },
  pagination: {
    current: submit.page,
    pageSize: submit.per,
    total: submit.totalCount,
    showQuickJumper: true,
    showTotal: total => <span>共有 {total} 条提交</span>,
  }
});

export default connect(mapStateToProps)(SpiderSubmit);
