import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Table, Popconfirm, Button, Menu,
  Dropdown, Icon
} from 'antd';
import StatusPoint from 'components/StatusPoint';
import { ArticleStatus, ArticleType } from 'models/article';

const MenuItem = Menu.Item;

const renderOperationsByArticle = (record, operations) => {
  const publishItem = (
    <MenuItem key="publish">
      <Link onClick={() => operations.onChangeStatus(record, ArticleStatus.PUBLISH)}>发布</Link>
    </MenuItem>
  );
  const draftItem = (
    <MenuItem key="draft">
      <Link onClick={() => operations.onChangeStatus(record, ArticleStatus.DRAFT)}>移到草稿箱</Link>
    </MenuItem>
  );
  let items = [];
  switch (record.status) {
    case ArticleStatus.RECYCLE:
      items = [draftItem, publishItem];
      break;
    case ArticleStatus.DRAFT:
      items = [publishItem];
      break;
    case ArticleStatus.PUBLISH:
    case ArticleStatus.PINNED:
      items = [draftItem];
      break;
    default:
      break;
  }
  return <Menu>{items}</Menu>;
};

const getColumns = (filters, operations) => (
  [{
    title: '标题',
    dataIndex: 'title',
    sorter: true,
    width: '20%',
    render: title => <b>{title}</b>
  }, {
    title: '状态',
    dataIndex: 'status',
    width: '10%',
    filters: [
      { text: '回收站', value: ArticleStatus.RECYCLE },
      { text: '草稿', value: ArticleStatus.DRAFT },
      { text: '发布', value: ArticleStatus.PUBLISH },
      { text: '置顶', value: ArticleStatus.PINNED }
    ],
    filteredValue: filters.status || [],
    render: status => {
      switch (status) {
        case ArticleStatus.RECYCLE:
          return <StatusPoint color="gray">回收站</StatusPoint>;
        case ArticleStatus.DRAFT:
          return <StatusPoint color="light-blue">草稿</StatusPoint>;
        case ArticleStatus.PUBLISH:
          return <StatusPoint color="green">发布</StatusPoint>;
        case ArticleStatus.PINNED:
          return <StatusPoint color="red">置顶</StatusPoint>;
        default:
          return null;
      }
    }
  }, {
    title: '作者',
    dataIndex: 'user.name',
    width: '8%',
  }, {
    title: '更新时间',
    dataIndex: 'updated_at',
    sorter: true,
    width: '18%'
  }, {
    title: '创建时间',
    dataIndex: 'created_at',
    sorter: true,
    width: '18%'
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => {
      const editOp = <Link to={`/admin/articles/edit/${record.id}`}>修改</Link>;
      return (
        <span>
          {record.article_type === ArticleType.NEWS ? (
            <span>{editOp}<span className="ant-divider" /></span>
          ) : null}
          <Popconfirm
            title="确定要删除吗？" placement="left"
            onConfirm={() => operations.onDelete(record)}
          >
            <a>删除</a>
          </Popconfirm>
          <span className="ant-divider" />
          <a onClick={e => operations.onPreview(e, record)}>预览</a>
          <span className="ant-divider" />
          <Dropdown
            overlay={renderOperationsByArticle(record, operations)}
            trigger={['click']}
          >
            <a className="ant-dropdown-link">
              其它操作 <Icon type="down" />
            </a>
          </Dropdown>
        </span>
      );
    }
  }]
);

class ProfileBlog extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    user: PropTypes.object,
    list: PropTypes.array,
    filters: PropTypes.object,
    pagination: PropTypes.object,
  }

  static updateData(user, dispatch) {
    if (user && user.id) {
      const filters = JSON.stringify({
        article_type: ArticleType.SOLUTION,
        user_id: user.id
      });
      dispatch({ type: 'article/saveParams', payload: { filters } });
      dispatch({ type: 'article/fetchList', payload: { filters } });
    }
  }

  componentDidMount() {
    ProfileBlog.updateData(this.props.user, this.props.dispatch);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      ProfileBlog.updateData(nextProps.user, this.props.dispatch);
    }
  }

  render() {
    const columns = getColumns(this.props.filters, {});
    return (
      <div>
        <div className="table-operations clear-fix">
          <Button type="primary" >
            新建解题报告
          </Button>
        </div>
        <Table
          bordered size="small"
          onChange={this.handleTableChange}
          rowKey={record => record.id}
          columns={columns} dataSource={this.props.list}
          pagination={this.props.pagination} loading={this.props.loading}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ loading, article }) => ({
  loading: loading.models.article,
  list: article.list,
  filters: article.filters,
  pagination: {
    current: article.page,
    pageSize: article.per,
    total: article.totalCount,
    showTotal: total => <span>共有 {total} 篇解题报告</span>,
  }
});

export default connect(mapStateToProps)(ProfileBlog);
