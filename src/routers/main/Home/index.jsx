import React from 'react';
import PropTypes from 'prop-types';
import { Carousel, Row, Col } from 'antd';
import './style.less';

export default class Home extends React.PureComponent {
  render() {
    return (
      <Row>
        <Col span={15}>
          left
        </Col>
        <Col span={9}>
          right
        </Col>
      </Row>
    );
  }
}

Home.propTypes = {
  children: PropTypes.element
};
