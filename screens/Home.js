import React from 'react';
import { Layout, Menu, Icon, Tag } from 'antd';
import TopBar from './TopBar';
import { LeftMenuBeforeLogin, LeftMenuAfterLogin } from './menu';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import User from './User';
import Profile from './Profile';
import Setting from './Setting';
import ApiCoinfordAdmin from '../class/ApiCoinfordAdmin';

const { Header, Content, Footer, Sider } = Layout;
var LeftMenu = LeftMenuBeforeLogin;
var HomeForm = Login;

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.updateUi = this.updateUi.bind(this);
    this.ApiCoinfordAdmin = new ApiCoinfordAdmin();
    //this.ApiCoinfordAdmin.GetToken();
    this.ApiCoinfordAdmin.loginDefault({Adminname: 'a1', Password: '123'}, this.updateUi);
  }
  state = {
    view: "Login",
  }
  componentDidMount() {
  }
  updateUi() {
    if(this.ApiCoinfordAdmin.isAdminLogin()) {
      LeftMenu = LeftMenuAfterLogin;
      switch (this.ApiCoinfordAdmin.getUiName()) {
        case "Dashboard":
            HomeForm = Dashboard;
          break;
        case "Register":
            if(this.ApiCoinfordAdmin.isAdminOrSuperAdmin()) {
              HomeForm = Register;
            } else {
              HomeForm = Dashboard;
            }
          break;
        case "Profile":
            HomeForm = Profile;
          break;
        case "User":
            HomeForm = User;
          break;
        case "Setting":
            HomeForm = Setting;
          break;
        default:
      }
    } else {
      LeftMenu = LeftMenuBeforeLogin;
      switch (this.ApiCoinfordAdmin.getUiName()) {
        case "Login":
            HomeForm = Login;
          break;
        case "ForgotPassword":
            HomeForm = ForgotPassword;
          break;
        default:

      }
    }
    this.setState({
      view: this.ApiCoinfordAdmin.getUiName(),
    });
  }
  render() {
    return (
		<Layout>
		  <Sider
		    breakpoint="lg"
		    collapsedWidth="0"
		    onCollapse={(collapsed, type) => { console.log(collapsed, type); }} >
		    <div className="logo" />
        <LeftMenu callback={this.updateUi} />
		  </Sider>
		  <Layout>
		    <Header style={{ background: '#fff', padding: 0 }} >
          <TopBar callback={this.updateUi} />
        </Header>
		    <Content style={{ margin: '24px 16px 0' }}>
		      <div style={{ padding: 24, background: '#fff', minHeight: 500 }}>
		        <HomeForm callback={this.updateUi}  ref={(homeForm) => { this.homeForm = homeForm; }} />
		      </div>
		    </Content>
		    <Footer style={{ textAlign: 'center' }}>
		      COINFORD ©2017
		    </Footer>
		  </Layout>
		</Layout>
    );
  }
}
module.exports = Home;
