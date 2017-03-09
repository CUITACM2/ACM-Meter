import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Popconfirm, Button, Menu, Modal, Tag, Dropdown, Icon } from 'antd';
import marked from 'marked';
import Highlight from 'react-highlight';
import StatusPoint from 'components/StatusPoint';
import SearchInput from 'components/SearchInput';
import { ArticleStatus, ArticleType } from 'models/article';
import './style.less';

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
    width: '15%',
    render: status => {
      switch (status) {
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
    title: '创建/更新时间',
    dataIndex: 'created_at',
    width: '30%',
    render: (createdAt, record) => (
      <div>
        创建: {createdAt}<br />
        更新: {record.updated_at}
      </div>
    )
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => {
      const editOp = <Link to={`/meter/principal/blog/edit/${record.id}`}>修改</Link>;
      return (
        <span>
          {editOp}
          <span className="ant-divider" />
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

  static defaultFilters = (user) => ({
    user_id: user.id,
    article_type: ArticleType.SOLUTION,
    status: [ArticleStatus.DRAFT, ArticleStatus.PUBLISH, ArticleStatus.PINNED]
  })

  static updateData(user, dispatch) {
    if (user && user.id) {
      const filters = JSON.stringify(ProfileBlog.defaultFilters(user));
      dispatch({ type: 'article/saveParams', payload: { filters } });
      dispatch({ type: 'article/fetchSolutionList', payload: { filters } });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      showPreviewModal: false,
      activeRecord: null,
    };
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onPreview = this.onPreview.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
  }

  componentDidMount() {
    ProfileBlog.updateData(this.props.user, this.props.dispatch);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      ProfileBlog.updateData(nextProps.user, this.props.dispatch);
    }
  }

  onDelete(record) {
    this.props.dispatch({ type: 'article/delete', payload: record.id });
  }

  onSearch(value) {
    console.log(value);
    console.log(this.props.filters);
  }

  onChangeStatus(record, status) {
    this.props.dispatch({
      type: 'article/changeStatus',
      payload: { id: record.id, params: { status } }
    });
  }

  onPreview(e, record) {
    e.preventDefault();
    this.setState({ showPreviewModal: true, activeRecord: record });
  }

  handleTableChange(pagination, filters, sorter) {
    const params = {
      page: pagination.current,
      filters: JSON.stringify({
        ...filters,
        ...ProfileBlog.defaultFilters(this.props.user)
      })
    };
    if (sorter && sorter.field) {
      params.sortField = sorter.field;
      params.sortOrder = sorter.order;
    }
    console.log(params);
    this.props.dispatch({ type: 'article/saveParams', payload: params });
    this.props.dispatch({ type: 'article/fetchList', payload: params });
  }

  renderPreviewModal() {
    const { showPreviewModal, activeRecord = {} } = this.state;
    return (
      <Modal
        closable maskClosable
        title={`预览 - ${activeRecord ? activeRecord.title : ''}`}
        visible={showPreviewModal} footer={null}
        style={{ top: 20 }} width={640}
        onCancel={() => this.setState({ showPreviewModal: false })}
      >
        {activeRecord ? (
          <div>
            <div className="tags-line">
              <b>标签:</b>
              {activeRecord.tags.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
            </div>
            <hr />
            <h5>正文</h5>
            <Highlight className="article-preview" innerHTML>
              {marked(activeRecord.content)}
            </Highlight>
          </div>
        ) : null}
      </Modal>
    );
  }

  render() {
    const columns = getColumns(this.props.filters, {
      onDelete: this.onDelete,
      onPreview: this.onPreview,
      onChangeStatus: this.onChangeStatus
    });
    console.log(this.props.list);
    return (
      <div>
        <div className="table-operations clear-fix">
          <Button type="primary" >
            <Link to="/meter/principal/blog/create">新建解题报告</Link>
          </Button>
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
        {this.renderPreviewModal()}
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
