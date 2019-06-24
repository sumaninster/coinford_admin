import React from 'react';
import { Table } from 'antd';
import ApiCoinfordAdmin from '../class/ApiCoinfordAdmin';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.updateUi = this.updateUi.bind(this);
    this.ApiCoinfordAdmin = new ApiCoinfordAdmin();
    this.state = {
        UserList: [],
        loading: false,
        ShowUserList: false,
    };
  }
  handleDelete() {
    console.log('delete');
  }
  handleEdit() {
    console.log('edit');
  }
  updateUi(UserDetail) {
    if(UserDetail == null) {
      this.setState({
        loading: false,
        UserList: UserList,
        ShowUserList: false,
      });
    } else {
      var UserList = [];
      UserDetail.forEach(function(value,index) {
        var User = value.User;
        var CountryDetail = value.UserCountryDetail;
        var Country = "";
        CountryDetail.forEach(function(value1,index1) {
          if(index1 == 0) {
            Country = value1.Country.Name;
          } else {
            Country += ", " + value1.Country.Name;
          }
        });
        User.Country = Country;
        UserList.push(User);
      });
      this.setState({
        loading: false,
        UserList: UserList,
        ShowUserList: true,
      });
    }
  }
  render() {
    const columns = [{
      title: 'Id',
      dataIndex: 'Id',
      key: 'Id',
    }, {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      //render: text => <a href="#">{text}</a>,
    }, {
      title: 'Username',
      dataIndex: 'Username',
      key: 'Username',
    }, {
      title: 'Countries',
      dataIndex: 'Country',
      key: 'Country',
    }, {
      title: 'Created At',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
    }, {
      title: 'Updated At',
      dataIndex: 'UpdatedAt',
      key: 'UpdatedAt',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={this.handleEdit}>Details</a>
          <span className="ant-divider" />
          <a onClick={this.handleDelete}>Delete</a>
        </span>
      ),
    }];
    return (
      <div>
        {this.state.ShowUserList ? (
          <Table
            loading={this.state.loading}
            bUsered
            rowKey='Id'
            columns={columns}
            dataSource={this.state.UserList} />
          ) : "No Data Found"}
      </div>
    )
  }
}

module.exports = UserList;
