import React from 'react';
import { Menu, Icon } from 'antd';
import ApiCoinfordAdmin from '../class/ApiCoinfordAdmin';

class LeftMenuBeforeLogin extends React.Component {
  constructor(props) {
    super(props)
    this.ApiCoinfordAdmin = new ApiCoinfordAdmin();
  }
  state = {
    current: 'Login',
  }
  handleClick = (e) => {
    this.ApiCoinfordAdmin.setUiName(e.key)
    this.setState({
      current: e.key,
    });
    this.props.callback();
  }
  render() {
    return (
      <Menu theme="dark" onClick={this.handleClick} mode="inline" defaultSelectedKeys={['Login']}>
        <Menu.Item key="Login">
          <Icon type="login" />
          <span className="nav-text">Login</span>
        </Menu.Item>
      </Menu>
    );
  }
}

class LeftMenuAfterLogin extends React.Component {
  constructor(props) {
    super(props)
    this.ApiCoinfordAdmin = new ApiCoinfordAdmin();
    var isAdminOrSuperAdmin = this.ApiCoinfordAdmin.isAdminOrSuperAdmin();
    this.state = {
      current: 'Dashboard',
      isAdminOrSuperAdmin: isAdminOrSuperAdmin,
    }
  }

  handleClick = (e) => {
    this.ApiCoinfordAdmin.setUiName(e.key)
    this.setState({
      current: e.key,
    });
    this.props.callback()
  }
  render() {
    return (
      <Menu theme="dark" onClick={this.handleClick} mode="inline" defaultSelectedKeys={['Dashboard']}>
        <Menu.Item key="Dashboard">
          <Icon type="home" />
          <span className="nav-text">Dashboard</span>
        </Menu.Item>
        {this.state.isAdminOrSuperAdmin ? (
        <Menu.Item key="Register">
          <Icon type="user" />
          <span className="nav-text">Register</span>
        </Menu.Item>
        ) : null}
        <Menu.Item key="User">
          <Icon type="user" />
          <span className="nav-text">User</span>
        </Menu.Item>
        <Menu.Item key="Profile">
          <Icon type="user" />
          <span className="nav-text">Profile</span>
        </Menu.Item>
        <Menu.Item key="Setting">
          <Icon type="setting" />
          <span className="nav-text">Setting</span>
        </Menu.Item>
      </Menu>
    );
  }
}

class ProfileMenu extends React.Component {
  constructor(props) {
    super(props)
    this.ApiCoinfordAdmin = new ApiCoinfordAdmin();
  }
  state = {
    current: 'Basic',
  }
  handleClick = (e) => {
    this.ApiCoinfordAdmin.setUiName(e.key)
    this.setState({
      current: e.key,
    });
    this.props.callback(e.key)
  }
  render() {
    return (
      <Menu theme="light" onClick={this.handleClick} mode="inline" defaultSelectedKeys={['Basic']}>
        <Menu.Item key="Basic">
          <Icon type="bars" />
          <span className="nav-text">Basic Details</span>
        </Menu.Item>
        <Menu.Item key="Password">
          <Icon type="lock" />
          <span className="nav-text">Password</span>
        </Menu.Item>
      </Menu>
    );
  }
}

module.exports = {
    LeftMenuBeforeLogin: LeftMenuBeforeLogin,
    LeftMenuAfterLogin: LeftMenuAfterLogin,
    ProfileMenu: ProfileMenu,
}
