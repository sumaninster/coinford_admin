import React from 'react';
import { Table } from 'antd';
import ApiCoinford from '../class/ApiCoinford';

class TransferList extends React.Component {
  constructor(props) {
    super(props);
    this.updateUi = this.updateUi.bind(this);
    this.ApiCoinford = new ApiCoinford();
  }
  state = {
    WalletCryptoList: [],
    loading: false,
  };
  componentDidMount() {
    var WalletData = this.props.WalletData;
    var CurrencyType = this.props.CurrencyType;
    console.log(WalletData);
    this.walletList(WalletData, CurrencyType);
  }
  walletList(WalletData, CurrencyType) {
    var WalletCryptoList = [];
    WalletData.forEach(function(value,index) {
      var Wallet = value.Wallet;
      Wallet.CryptoId = value.Crypto.Id;
      var Primary = '';
      if (Wallet.Primary) {
        Primary = 'Yes';
      } else {
        Primary = 'No';
      }
      Wallet.PrimaryShow = Primary;
      var data = [];
      switch (CurrencyType) {
        case "CRYPTO":
          Wallet.Name = value.Crypto.Address;
          break;
        case "FIAT":
          Wallet.Name = value.Fiat.Text;
          break;
        default:
      }
      WalletCryptoList.push(Wallet);
    });
    this.setState({
      loading: false,
      WalletCryptoList: WalletCryptoList,
    });
  }
  handleDelete() {
    console.log('delete');
  }
  handleEdit() {
    console.log('edit');
  }
  updateUi(WalletCryptoList) {
    this.setState({
      loading: false,
      WalletCryptoList: this.props.WalletCryptoList,
    });
  }
  render() {
    const columns = [{
      title: 'Wallet Name',
      dataIndex: 'Nickname',
      key: 'Nickname',
      //render: text => <a href="#">{text}</a>,
    }, {
      title: 'Address',
      dataIndex: 'Name',
      key: 'Name',
    }, {
      title: 'Amount',
      dataIndex: 'Amount',
      key: 'Amount',
    }, {
      title: 'Amount Locked',
      dataIndex: 'AmountLocked',
      key: 'AmountLocked',
    }, {
      title: 'Primary',
      dataIndex: 'PrimaryShow',
      key: 'PrimaryShow',
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
          rowKey='CryptoId'
          columns={columns}
          dataSource={this.state.WalletCryptoList} />
      </div>
    )
  }
}

module.exports = TransferList;
