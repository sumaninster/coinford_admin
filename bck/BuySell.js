import React from 'react';
import { Tabs } from 'antd';
import OrderList from './OrderList';
import Order from './Order';
import OrderGraph from './OrderGraph';
import ApiCoinford from '../class/ApiCoinford';
const TabPane = Tabs.TabPane;

class BuySell extends React.Component {
  constructor(props) {
    super(props)
    this.updateUi = this.updateUi.bind(this);
    this.updateUiList = this.updateUiList.bind(this);
    this.handleTabs = this.handleTabs.bind(this);
    this.ApiCoinford = new ApiCoinford();
    this.state = {
        activeKey: "BuySell",
    };
  }
  componentDidMount() {
    var RequestOrders = [];
    RequestOrders.AllUser = "YES";
    RequestOrders.ExcludeMine = "YES";
    var OrderType = "";
    if(this.ApiCoinford.getOrderType() === "BUY") {
      OrderType = "SELL";
    } else if(this.ApiCoinford.getOrderType() === "SELL") {
      OrderType = "BUY";
    }
    RequestOrders.OrderType = OrderType;
    RequestOrders.IsProcessed = "NO";
    this.ApiCoinford.RequestOrders = RequestOrders;
    this.ApiCoinford.userOrderList(this.updateUiList, this.props.callback);
  }
  handleTabs(activeKey) {
    this.setState({ activeKey });
    var RequestOrders = [];
    switch (activeKey) {
      case "BuySell":
        RequestOrders.AllUser = "YES";
        RequestOrders.ExcludeMine = "YES";
        RequestOrders.OrderType = this.ApiCoinford.getOrderType();
        RequestOrders.IsProcessed = "NO";
        this.ApiCoinford.RequestOrders = RequestOrders;
        break;
      case "Graph":
        RequestOrders.AllUser = "YES";
        RequestOrders.ExcludeMine = "YES";
        RequestOrders.OrderType = this.ApiCoinford.getOrderType();
        RequestOrders.IsProcessed = "NO";
        break;
      case "MyOrders":
        RequestOrders.AllUser = "NO";
        RequestOrders.ExcludeMine = "NO";
        RequestOrders.OrderType = "";
        RequestOrders.IsProcessed = "";
        this.ApiCoinford.RequestOrders = RequestOrders;
        break;
      case "MyBuySellOrders":
        RequestOrders.AllUser = "NO";
        RequestOrders.ExcludeMine = "NO";
        RequestOrders.OrderType = this.ApiCoinford.getOrderType();
        RequestOrders.IsProcessed = "";
        this.ApiCoinford.RequestOrders = RequestOrders;
        break;
      default:
    }
    this.ApiCoinford.userOrderList(this.updateUiList, this.props.callback);
  }
  updateUiList(OrderList) {
    console.log(this.state.activeKey);
    console.log(OrderList);
    this.orderList.updateUi(OrderList);
  }
  updateUi(OrderList, activeKey) {
    this.setState({ activeKey });
    this.orderList.updateUi(OrderList);
  }
  render() {
    const OrderType = this.ApiCoinford.getOrderType();
    const tab1 = this.ApiCoinford.capitalizeFirstLetter(OrderType);
    const tab4 = "My " + tab1 + " Orders";
    return (
      <div>
        <Order homeCallback={this.props.callback} callback={this.updateUi} ref={(orderForm) => { this.orderForm = orderForm; }} />
        <div>
          <Tabs
          activeKey={this.state.activeKey}
          onChange={this.handleTabs}
          type="card">
            <TabPane tab={tab1} key="BuySell">
              <OrderList
              homeCallback={this.props.callback}
              callback={this.updateUiList}
              ref={(orderList) => { this.orderList = orderList; }} />
            </TabPane>
            <TabPane tab="Graph" key="Graph">
              <OrderGraph />
            </TabPane>
            <TabPane tab="My Orders" key="MyOrders">
              <OrderList
              homeCallback={this.props.callback}
              callback={this.updateUiList}
              ref={(orderList) => { this.orderList = orderList; }} />
            </TabPane>
            <TabPane tab={tab4} key="MyBuySellOrders">
              <OrderList
              homeCallback={this.props.callback}
              callback={this.updateUiList}
              ref={(orderList) => { this.orderList = orderList; }} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
module.exports = BuySell;
