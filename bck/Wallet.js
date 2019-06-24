import React from 'react';
import { Tabs, Form, Input, Button, Select, Tooltip, Icon, Checkbox} from 'antd';
import WalletList from './WalletList';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class WalletForm extends React.Component {
  constructor(props) {
    super(props);
    this.ApiCoinford = new ApiCoinford();
    this.notify = this.notify.bind(this);
    this.Currencies = this.Currencies.bind(this);
    this.myCurrencies = this.myCurrencies.bind(this);
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
    this.ApiCoinford.listWallet(this.myCurrencies, this.props.callback);
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
  myCurrencies(WalletMasterData) {
    //console.log(WalletMasterData);
    var panes = this.initialPanes();
    var activeKey;
    var callback = this.props.callback;
    var mythis = this;
    WalletMasterData.forEach(function(value,index) {
      var closable = true;
      var WalletMaster = value.WalletMaster;
      /*if(value.WalletMaster.Amount > 0 || value.WalletMaster.AmountLocked > 0) {
        closable = false;
      }*/
      activeKey = `${WalletMaster.Id}`;
      var title = mythis.ApiCoinford.getCurrencyCode(WalletMaster.CurrencyId);
      panes.push({ title: title,
        content: <WalletList
        CurrencyId={WalletMaster.CurrencyId}
        CurrencyType={WalletMaster.CurrencyType}
        WalletData={value.WalletData}
        callback={mythis.props.callback} />,
        key: activeKey, closable: closable });
    });
    //console.log(panes);
    this.setState({ panes, activeKey });
  }
  notify(message) {
    console.log(message);
  }
  onChange = (activeKey) => {
    this.setState({ activeKey });
    this.ApiCoinford.CurrencyId = parseInt(activeKey, 10)
  }
  onEdit = (targetKey, action) => {
    this.ApiCoinford.deleteWallet(parseInt(targetKey, 10), this.notify, this.myCurrencies, this.props.callback);
    //this[action](targetKey);
  }
  handleAddSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.CurrencyId = parseInt(values.CurrencyId, 10)
        //console.log(values);
        if(values.Active != true && values.Active != false)
          values.Active = false;
        if(values.Primary != true && values.Primary != false)
          values.Primary = false;
        this.ApiCoinford.addWallet(values, this.notify, this.myCurrencies, this.props.callback);
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
                <Tooltip title="To trade in native currency, add your Currency">
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
          <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
            {getFieldDecorator('Primary', {
              valuePropName: 'checked',
            })(
              <Checkbox>Primary</Checkbox>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Create Wallet</Button>
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
const Wallet = Form.create()(WalletForm);
module.exports = Wallet;
