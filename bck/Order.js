import React from 'react';
import { InputNumber, Radio, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Modal } from 'antd';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class BuySellForm extends React.Component {
  constructor(props) {
    super(props);
    this.updateUi = this.updateUi.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.ApiCoinford = new ApiCoinford();
  }
  state = {
    CurrencyId: 0,
    RateCurrencyId: 0,
    Amount: 0,
    Rate: 0,
    OrderType: "",
    ordertypename: "",
    currencyname: "Amount",
    ratecurrencyname: "Rate",
    visibleConfirm: false,
    rateText: "",
    amountText: "",
    totalAmountText: "",
  };
  componentDidMount() {
    this.initialState = this.state;
  }
  updateUi(OrderList) {
    this.props.callback(OrderList, "MyBuySellOrders")
    this.initializeFields();
    this.successOrder();
  }
  successOrder() {
    Modal.success({
      title: this.state.ordertypename,
      content: 'The order is successfully placed!',
      okText: "Okay",
    });
    this.setState(this.initialState);
  }
  initializeFields() {
    this.props.form.setFields({
      CurrencyId: {
        value: '',
      },
      RateCurrencyId: {
        value: '',
      },
      Amount: {
        value: '',
      },
      Rate: {
        value: '',
      },
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var cname = this.ApiCoinford.getCurrencyObject(values.CurrencyId);
        var rcname = this.ApiCoinford.getCurrencyObject(values.RateCurrencyId);
        var rateText = "Rate: 1 " + cname.Code + " = " + values.Rate + " " + rcname.Code;
        var amountText = "Amount: " + values.Amount + " " + cname.Code;
        var totalAmountText = "Total: " + (values.Amount*values.Rate) + " " + rcname.Code;
        this.setState({
          Amount: values.Amount,
          Rate: values.Rate,
          OrderType: this.ApiCoinford.getOrderType(),
          ordertypename: this.orderTypeName(),
          rateText: rateText,
          amountText: amountText,
          totalAmountText: totalAmountText,
        });
        this.showConfirm();
      }
    });
  }
  submitOrder() {
    this.ApiCoinford.order(this.state, this.updateUi, this.props.homeCallback);
  }
  showConfirm = () => {
    this.setState({
      visibleConfirm: true,
    });
  }
  handleOkConfirm = (e) => {
    this.setState({
      visibleConfirm: false,
    });
    this.submitOrder();
  }
  handleCancelConfirm = (e) => {
    this.setState({
      visibleConfirm: false,
    });
  }
  handleCryptoChange = (e) => {
    const CurrencyId = parseInt(e.target.value, 10);
    if(CurrencyId != 0) {
      var cname = this.ApiCoinford.getCurrencyObject(CurrencyId);
      var currencyname = "Amount (" + cname.Name + "/" + cname.Code + ")";
      this.setState({ currencyname });
    }
    this.setState({ CurrencyId });
  }
  handleRateCurrencyChange = (e) => {
    const RateCurrencyId = parseInt(e.target.value, 10);
    if(RateCurrencyId != 0) {
      var rcname = this.ApiCoinford.getCurrencyObject(RateCurrencyId);
      var ratecurrencyname = "Rate (" + rcname.Name + "/" + rcname.Code + ")";
      this.setState({ ratecurrencyname });
    }
    this.setState({ RateCurrencyId });
  }
  getAmountMessage() {
    var message = "Please provide the amount!";
    if(this.state.CurrencyId != 0) {
      message = "Please provide the amount of " + this.ApiCoinford.getCurrencyName(this.state.CurrencyId) +" that you want to "+this.ApiCoinford.getOrderType().toLowerCase()+"!";
    }
    return message;
  }
  getRateMessage() {
    var message = "Please provide the rate!";
    if(this.state.RateCurrencyId != 0) {
      message = "Please provide the rate in " + this.ApiCoinford.getCurrencyName(this.state.RateCurrencyId) +"!";
    }
    return message;
  }
  orderTypeName() {
    var cname = this.ApiCoinford.getCurrencyObject(this.state.CurrencyId);
    var ordertypename;
    if (this.state.CurrencyId != 0) {
      ordertypename = this.ApiCoinford.capitalizeFirstLetter(this.ApiCoinford.getOrderType()) + " " + cname.Name + " (" + cname.Code + ")";
    } else {
      ordertypename = this.ApiCoinford.capitalizeFirstLetter(this.ApiCoinford.getOrderType());
    }
    return ordertypename;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    const { CurrencyId } = this.state;
    const { RateCurrencyId } = this.state;
    const { Amount } = this.state;
    const { Rate } = this.state;
    const { currencyname } = this.state;
    const { ratecurrencyname } = this.state;
    const { rateText } = this.state;
    const { amountText } = this.state;
    const { totalAmountText } = this.state;
    const CurrencyOptions = this.ApiCoinford.currencyOptions(RateCurrencyId);
    const RateCurrencyOptions = this.ApiCoinford.rateCurrencyOptions(CurrencyId);

    var ordertypename = this.orderTypeName();
    var ordername = this.ApiCoinford.capitalizeFirstLetter(this.ApiCoinford.getOrderType()) + " Currency";

    return (
      <Form onSubmit={this.handleSubmit}>
        <Modal
          title={ordertypename}
          visible={this.state.visibleConfirm}
          onOk={this.handleOkConfirm}
          onCancel={this.handleCancelConfirm}
          okText="Place Order"
          cancelText="Cancel"
        >
          <p>{rateText}</p>
          <p>{amountText}</p>
          <p>{totalAmountText}</p>
        </Modal>
        <FormItem
          {...formItemLayout}
          label={ordername}
        >
          {getFieldDecorator('CurrencyId', {
            rules: [{ required: true, message: 'Please select a currency!', whitespace: false }],
          })(
            <RadioGroup onChange={this.handleCryptoChange} options={CurrencyOptions} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Rate Currency"
        >
          {getFieldDecorator('RateCurrencyId', {
            rules: [{ required: true, message: 'Please select a currency!', whitespace: false }],
          })(
            <RadioGroup onChange={this.handleRateCurrencyChange} options={RateCurrencyOptions} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={currencyname}
          hasFeedback
        >
        {getFieldDecorator('Amount', {
          rules: [{ required: true, message: this.getAmountMessage(),}],
        })(
          <InputNumber
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={ratecurrencyname}
          hasFeedback
        >
          {getFieldDecorator('Rate', {
            rules: [{ required: true, message: this.getRateMessage(),}],
          })(
            <InputNumber
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">{ordertypename}</Button>
        </FormItem>
      </Form>
  )
  }
}
const Order = Form.create()(BuySellForm);
module.exports = Order;
