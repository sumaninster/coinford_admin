import React from 'react';
import { Table } from 'antd';
import ApiCoinford from '../class/ApiCoinford';

class PayeeList extends React.Component {
  constructor(props) {
    super(props);
    this.updateUi = this.updateUi.bind(this);
    this.ApiCoinford = new ApiCoinford();
  }
  state = {
    PayeeCryptoList: [],
    loading: false,
  };
  componentDidMount() {
    var PayeeData = this.props.PayeeData;
    var CurrencyType = this.props.CurrencyType;
    console.log(PayeeData);
    this.payeeList(PayeeData, CurrencyType);
  }
  payeeList(PayeeData, CurrencyType) {
    var PayeeCryptoList = [];
    PayeeData.forEach(function(value,index) {
      var Payee = value.Payee;
      switch (CurrencyType) {
        case "CRYPTO":
          Payee.Address = value.Crypto.Address;
          break;
        default:
      }
      PayeeCryptoList.push(Payee);
    });
    this.setState({
      loading: false,
      PayeeCryptoList: PayeeCryptoList,
    });
  }
  handleDelete() {
    console.log('delete');
  }
  handleEdit() {
    console.log('edit');
  }
  updateUi(PayeeCryptoList) {
    this.setState({
      loading: false,
      PayeeCryptoList: this.props.PayeeCryptoList,
    });
  }
  render() {
    const columns = [{
      title: 'Nickname',
      dataIndex: 'Nickname',
      key: 'Nickname',
      //render: text => <a href="#">{text}</a>,
    }, {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
    }, {
      title: 'Address',
      dataIndex: 'Address',
      key: 'Address',
    }, {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    }, {
      title: 'Updated At',
      dataIndex: 'UpdatedAt',
      key: 'UpdatedAt',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={this.handleEdit}>Edit</a>
          <span className="ant-divider" />
          <a onClick={this.handleDelete}>Delete</a>
        </span>
      ),
    }];
    return (
      <div>
        <Table
          loading={this.state.loading}
          bordered
          rowKey='Id'
          columns={columns}
          dataSource={this.state.PayeeCryptoList} />
      </div>
    )
  }
}

module.exports = PayeeList;
