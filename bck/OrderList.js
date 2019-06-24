import React from 'react';
import { Table } from 'antd';
import ApiCoinford from '../class/ApiCoinford';

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.updateUi = this.updateUi.bind(this);
    this.ApiCoinford = new ApiCoinford();
  }
  state = {
    OrderList: [],
    loading: false,
  };
  handleDelete() {
    console.log('delete');
  }
  handleEdit() {
    console.log('edit');
  }
  updateUi(OrderList) {
    this.setState({
      loading: false,
      OrderList: OrderList,
    });
  }
  render() {
    const columns = [{
      title: 'Currency Pair',
      dataIndex: 'CurrencyPair',
      key: 'CurrencyId',
      //render: text => <a href="#">{text}</a>,
    }, {
      title: 'Amount',
      dataIndex: 'Amount',
      key: 'Amount',
    }, {
      title: 'Rate',
      dataIndex: 'Rate',
      key: 'Rate',
    }, /*{
      title: 'Rate Currency',
      dataIndex: 'RateCurrencyCode',
      key: 'RateCurrencyId',
    },*/ {
      title: 'Order Type',
      dataIndex: 'OrderTypeShow',
      key: 'OrderType',
    }, {
      title: 'Processed',
      dataIndex: 'ProcessedTypeShow',
      key: 'ProcessedType',
    }, {
      title: 'Processed At',
      dataIndex: 'ProcessedAt',
      key: 'ProcessedAt',
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
          dataSource={this.state.OrderList} />
      </div>
    )
  }
}

module.exports = OrderList;
