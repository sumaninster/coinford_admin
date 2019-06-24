import React from 'react';
import { Form, Tabs, Icon, Layout } from 'antd';
import { KYCMenu, ProfileMenu } from './menu';
import DataForm from './DataForm';
import ApiCoinfordAdmin from '../class/ApiCoinfordAdmin';
const TabPane = Tabs.TabPane;
const { Header, Content, Footer, Sider } = Layout;
var SubMenu = KYCMenu;
class ProfileDetail extends React.Component {
  constructor(props) {
    super(props)
    this.updateUi = this.updateUi.bind(this);
    this.changeMenu = this.changeMenu.bind(this);
    this.ApiCoinfordAdmin = new ApiCoinfordAdmin();
  }
  state = {
    FieldType: "ADDRESS",
  }
  changeMenu() {
    console.log(this.props.subMenu);
  }
  updateUi(subUiName) {
    if(this.props.subMenu == "KYC") {
      SubMenu = KYCMenu;
      var FieldType;
      switch (subUiName) {
        case "Address":
            FieldType = "ADDRESS";
          break;
        case "Documents":
            FieldType = "FILE";
          break;
        case "Bank":
            FieldType = "BANK";
          break;
        default:
      }
    } else if(this.props.subMenu == "Profile"){
      SubMenu = ProfileMenu;
      var FieldType;
      switch (subUiName) {
        case "Address":
            FieldType = "ADDRESS";
          break;
        case "Documents":
            FieldType = "KYC";
          break;
        case "Bank":
            FieldType = "BANK";
          break;
        default:
      }
    }
    this.setState({
      FieldType
    });
  }
  render() {
    const Data = Form.create()(DataForm);
    return (
      <Layout>
  		  <Sider
          style={{ background: '#fff' }}
  		    breakpoint="lg"
  		    collapsedWidth="0"
  		    onCollapse={(collapsed, type) => { console.log(collapsed, type); }} >
  		    <div className="logo" />
          <SubMenu callback={this.updateUi} />
  		  </Sider>
  		  <Layout>
  		    <Content style={{ margin: '24px 16px 0' }}>
  		      <div style={{ padding:24, background: '#fff', minHeight: 300 }}>
              <Data FieldType={this.state.FieldType}
              Eligible={this.props.Eligible}
              CountryId={this.props.CountryId}
              callback={this.props.callback}
              ref={(instance) => { this.Data = instance; }} />
  		      </div>
  		    </Content>
  		  </Layout>
  		</Layout>
    )
  }
}
module.exports = ProfileDetail;
