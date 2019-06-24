import React from 'react';
import { Form, Input } from 'antd';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;

class WalletAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.ApiCoinford = new ApiCoinford();
    const CurrencyId = this.props.CurrencyId;
    const CObj = this.ApiCoinford.getCurrencyObject(CurrencyId);
    const CurrencyName = CObj.Name + ' ('+ CObj.Code +')';
    //this.updateUi = this.updateUi.bind(this);
    //this.submitOrder = this.submitOrder.bind(this);
    this.setState(CurrencyName);
  }
  render() {
    return (
      <Form onSubmit={this.handleAddPayeeSubmit}>
        <FormItem
          {...formItemLayout}
          label="Currency"
          required={false}
        >
        {getFieldDecorator('CurrencyName', {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: false,
            whitespace: true,
            message: 'Please provide a nickname for the address',
          }],
        })(
          this.state.CurrencyName
        )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Wallet Name"
          required={false}
        >
        {getFieldDecorator('Nickname', {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: false,
            whitespace: true,
            message: 'Please provide a nickname for the address',
          }],
        })(
        <Input placeholder='[Optional] nickname for the address' style={{ width: '60%', marginRight: 8 }} />
        )}
        </FormItem>
      </Form>
    )
  }
}
const WalletAdd = Form.create()(WalletAddForm);
module.exports = WalletAdd;
