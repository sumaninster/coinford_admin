import React from 'react';
import { Button, Row, Col, Icon } from 'antd';
import ApiCoinfordAdmin from '../class/ApiCoinfordAdmin';

class TopBar extends React.Component {
  constructor(props) {
    super(props)
    this.updateUi = this.updateUi.bind(this);
    this.logout = this.logout.bind(this);
    this.ApiCoinfordAdmin = new ApiCoinfordAdmin();
  }
  updateUi() {
  }
  logout() {
    this.ApiCoinfordAdmin.logout(this.props.callback);
  }
  render() {
    return (
      <Row>
        <Col xs={{ span: 10, offset: 1 }} sm={{ span: 10, offset: 1 }} md={{ span: 10, offset: 1 }} lg={{ span: 14, offset: 1 }} xl={{ span: 14, offset: 1 }}>
          <img src="image/clogo.png" /> &nbsp;&nbsp; {this.ApiCoinfordAdmin.AdminGroup.Name}
        </Col>
        <Col xs={{ span: 6, offset: 0 }} sm={{ span: 6, offset: 0 }} md={{ span: 6, offset: 0 }} lg={{ span: 6, offset: 0 }} xl={{ span: 6, offset: 0 }}>
          {this.ApiCoinfordAdmin.isAdminLogin() ? (
            <Button onClick={this.logout} style={{align: 'right'}}><Icon type="logout" />Logout</Button>
          ) : null}
          &nbsp;&nbsp;
          {this.ApiCoinfordAdmin.isAdminLogin() ? (
            this.ApiCoinfordAdmin.AdminName
          ) : null}
        </Col>
      </Row>
    )
  }
}
module.exports = TopBar;
