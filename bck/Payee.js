import React from 'react';
import { Tabs, Form, Input, Button, Select, Tooltip, Icon, Checkbox, Modal} from 'antd';
import PayeeList from './PayeeList';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class PayeeForm extends React.Component {
  constructor(props) {
    super(props);
    this.ApiCoinford = new ApiCoinford();
    this.notify = this.notify.bind(this);
    this.Currencies = this.Currencies.bind(this);
    this.myPayees = this.myPayees.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    const panes = this.initialPanes();
    this.state = {
      panes,
      CurrencyId: 0,
      Currencies: [],
    };
  }
  initialPanes() {
    const panes = [];
    return panes;
  }
  componentDidMount() {
    this.Currencies();
    this.ApiCoinford.listPayee(this.myPayees, this.props.callback);
  }
  Currencies() {
    var Currencies = [];
    var CurrencyList = this.ApiCoinford.CryptoCurrencies;
    CurrencyList.forEach(function(value,index) {
      var CurrencyName = value.Name + ' (' + value.Code + ')';
      Currencies.push(<Option key={value.Id}>{CurrencyName}</Option>);
    });
    this.setState({ Currencies });
  }
  myPayees(PayeeMasterData) {
    var panes = this.initialPanes();
    var activeKey;
    var callback = this.props.callback;
    var mythis = this;
    PayeeMasterData.forEach(function(value,index) {
      var closable = true;
      var PayeeMaster = value.PayeeMaster;
      /*if(value.PayeeMaster.Amount > 0 || value.PayeeMaster.AmountLocked > 0) {
        closable = false;
      }*/
      activeKey = `${PayeeMaster.Id}`;
      var title = mythis.ApiCoinford.getCurrencyCode(PayeeMaster.CurrencyId);
      panes.push({ title: title,
        content: <PayeeList
        CurrencyId={PayeeMaster.CurrencyId}
        CurrencyType={PayeeMaster.CurrencyType}
        PayeeData={value.PayeeData}
        callback={mythis.props.callback} />,
        key: activeKey, closable: closable });
    });
    this.setState({ panes, activeKey });
  }
  notify(message) {
    Modal.info({
      title: 'Message',
      content: message,
    });
    console.log(message);
  }
  onChange = (activeKey) => {
    this.setState({ activeKey });
    this.ApiCoinford.CurrencyId = parseInt(activeKey, 10)
  }
  onEdit = (targetKey, action) => {
    this.ApiCoinford.deletePayee(parseInt(targetKey, 10), this.notify, this.myCurrencies, this.props.callback);
    //this[action](targetKey);
  }
  handleAddSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.CurrencyId = parseInt(values.CurrencyId, 10)
        this.ApiCoinford.addPayee(values, this.notify, this.myCurrencies, this.props.callback);
      }
    });
  }
  handleCurrencyChange(value) {
    const CurrencyId = parseInt(value, 10);
    this.setState({ CurrencyId });
  }
  handleCurrencyBlur() {
    //console.log('blur');
  }
  handleCurrencyFocus() {
    //console.log('focus');
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
    return (
      <div>
        <Form onSubmit={this.handleAddSubmit}>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                Your Currency&nbsp;
                <Tooltip title="Select the currency for which you want to add a payee">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
            hasFeedback
          >
            {getFieldDecorator('CurrencyId', {
              rules: [{ required: true, message: 'Please select a Currency!', whitespace: true }],
            })(
              <Select
                showSearch
                style={{ width: '60%', marginRight: 8 }}
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={this.handleCurrencyChange}
                onFocus={this.handleCurrencyFocus}
                onBlur={this.handleCurrencyBlur}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
              {this.state.Currencies}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Name"
            required={true}
          >
          {getFieldDecorator('Name', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: 'Please provide payee name',
            }],
          })(
          <Input placeholder='Please provide payee name' style={{ width: '60%', marginRight: 8 }} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Address"
            required={true}
          >
          {getFieldDecorator('Address', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: 'Please provide payee crypto address',
            }],
          })(
          <Input placeholder='Please provide payee crypto address' style={{ width: '60%', marginRight: 8 }} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Email"
            required={true}
          >
          {getFieldDecorator('Email', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: 'Please provide the payee email Id',
            }],
          })(
          <Input placeholder='Please provide the payee email Id' style={{ width: '60%', marginRight: 8 }} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Nickname"
            required={false}
          >
          {getFieldDecorator('Nickname', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: false,
              whitespace: true,
              message: 'Please provide a nickname for this payee',
            }],
          })(
          <Input placeholder='[Optional] nickname for this payee' style={{ width: '60%', marginRight: 8 }} />
          )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Add New Payee</Button>
          </FormItem>
        </Form>
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>)}
        </Tabs>
      </div>
    );
  }
}
const Payee = Form.create()(PayeeForm);
module.exports = Payee;
