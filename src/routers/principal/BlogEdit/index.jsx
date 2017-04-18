import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Breadcrumb, Icon } from 'antd';
import ArticleForm from 'components/form/ArticleForm';

class BlogEdit extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    article: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onSubmit = (id, params) => {
      console.log(id, params);
      if (id == null) {
        this.props.dispatch({
          type: 'article/create',
          payload: { params, goback: true }
        });
      } else {
        this.props.dispatch({
          type: 'article/update',
          payload: { id, params, goback: true }
        });
      }
    };
  }

  render() {
    const { loading, article } = this.props;
    console.log(article);
    return (
      <div className="edit-page">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/main"><Icon type="home" /></Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/meter/principal/profile">
              <Icon type="list" /> 解题报告列表
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {article.id ? '修改解题报告' : '发布解题报告'}
          </Breadcrumb.Item>
        </Breadcrumb>
        <ArticleForm loading={loading} onSubmit={this.onSubmit} article={article} />
      </div>
    );
  }
}

const mapStateToProps = ({ loading, article }) => ({
  loading: loading.global,
  article: article.currentItem,
});

export default connect(mapStateToProps)(BlogEdit);
