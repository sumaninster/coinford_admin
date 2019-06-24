import React from 'react';
import { Tabs, Form, Input, Button, Select, Tooltip, Icon, Checkbox, Radio, Modal} from 'antd';
import TransferList from './TransferList';
import WalletAdd from './WalletAdd';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class TransferForm extends React.Component {
  constructor(props) {
    super(props);
    this.ApiCoinford = new ApiCoinford();
    this.notify = this.notify.bind(this);
    this.Currencies = this.Currencies.bind(this);
    this.myCurrencies = this.myCurrencies.bind(this);
    this.handleTransferTypeChange = this.handleTransferTypeChange.bind(this);
    this.handleCurrencyTypeChange = this.handleCurrencyTypeChange.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    this.handlePayeeChange = this.handlePayeeChange.bind(this);
    this.handleFromAccountChange = this.handleFromAccountChange.bind(this);
    this.addPayee = this.addPayee.bind(this);
    this.listPayee = this.listPayee.bind(this);
    const panes = this.initialPanes();
    const TransferTypeList = this.listTransferType();
    this.initialState(panes, TransferTypeList);
  }
  initialState(panes, TransferTypeList) {
    this.state = {
      panes: panes,
      Payee: [],
      TransferTypeList: TransferTypeList,
      TransferType: '',
      CurrencyTypeShow: false,
      CurrencyTypeList: [],
      CurrencyType: '',
      CurrencyId: 0,
      CurrencyListShow: false,
      Currencies: [],
      CurrencyName: '',
      FromAccountShow: false,
      FromAccountList: [],
      FromAccountLabel: '',
      PayeeShow: false,
      PayeeList: [],
      PayeeLabel: '',
      PayeeButtonShow: false,
      PayeeButtonLabel: '',
      AmountShow: false,
      ButtonShow: false,
    };
  }
  initialPanes() {
    const panes = [];
    return panes;
  }
  componentDidMount() {
    this.ApiCoinford.listTransfer(this.myCurrencies, this.props.callback);
  }
  loadPayeeList(TransferType, CurrencyType, CurrencyId) {
    var TransferSearch = {
      CurrencyId: CurrencyId,
      CurrencyType: CurrencyType,
      TransferType: TransferType,
    };
    this.ApiCoinford.listPayeeAll(TransferSearch, this.listPayee, this.props.callback);
  }
  listPayee(Payee) {
    this.setState({ Payee });
    this.updateCurrencyChange();
  }
  Currencies(CurrencyType) {
    var Currencies = [];
    var CurrencyList = [];
    switch (CurrencyType) {
      case "FIAT":
        CurrencyList = this.ApiCoinford.FiatCurrencies;
        break;
      case "CRYPTO":
        CurrencyList = this.ApiCoinford.CryptoCurrencies;
        break;
      default:
    }
    if(CurrencyList.length > 0) {
      CurrencyList.forEach(function(value,index) {
        var CurrencyName = value.Name + ' (' + value.Code + ')';
        Currencies.push(<Option key={value.Id}>{CurrencyName}</Option>);
      });
    }
    return Currencies;
  }
  selectPayeeList(TransferType, CurrencyType, FromTo, Id) {
    if((TransferType == "BANK" || TransferType == "WALLET") && (CurrencyType == "FIAT" || CurrencyType == "CRYPTO") && (FromTo == "FROM" || FromTo == "TO")) {
      return this.WalletList(CurrencyType, FromTo, Id);
    } else if(TransferType == "PAYEE" && CurrencyType == "CRYPTO" && FromTo == "FROM") {
      return this.WalletList(CurrencyType, FromTo, Id);
    } else if(TransferType == "PAYEE" && CurrencyType == "CRYPTO" && FromTo == "TO") {
      return this.PayeeCrypto(FromTo, Id);
    }
  }
  selectPayeeLabel(TransferType, CurrencyType, FromTo) {
    if((TransferType == "BANK" || TransferType == "WALLET") && (CurrencyType == "FIAT" || CurrencyType == "CRYPTO") && FromTo == "FROM") {
      return "From Wallet";
    } else if(TransferType == "WALLET" && (CurrencyType == "FIAT" || CurrencyType == "CRYPTO") && FromTo == "TO") {
      return "To Wallet";
    } else if(TransferType == "BANK" && CurrencyType == "FIAT" && FromTo == "FROM") {
      return "From Wallet";
    } else if(TransferType == "BANK" && CurrencyType == "FIAT" && FromTo == "TO") {
      return "To Bank";
    } else if(TransferType == "PAYEE" && CurrencyType == "CRYPTO" && FromTo == "FROM") {
      return "From Wallet";
    } else if(TransferType == "PAYEE" && CurrencyType == "CRYPTO" && FromTo == "TO") {
      return "To Payee";
    }
  }
  selectPayeeButton(TransferType) {
    if(TransferType == "WALLET") {
      return "Create New Wallet";
    } else if(TransferType == "PAYEE") {
      return "Add New Payee";
    }
  }
  WalletList(CurrencyType, FromTo, Id) {
    var WalletList= [];
    switch (CurrencyType) {
      case "CRYPTO":
        WalletList = this.state.Payee.WalletCrypto;
      break;
      case "FIAT":
        WalletList = this.state.Payee.WalletFiat;
      break;
      default:
    }
    var Wallets = [];
    var CurrencyCode = this.ApiCoinford.getCurrencyCode(this.state.CurrencyId);
    if( WalletList != null) {
      if(WalletList.length > 0) {
        WalletList.forEach(function(value,index) {
          var WalletData = "";
          switch (CurrencyType) {
            case "CRYPTO":
              WalletData = value.Crypto.Address;
            break;
            case "FIAT":
              WalletData = value.DataText.Text;
            break;
            default:
          }
          var Amount = value.Wallet.Amount - value.Wallet.AmountLocked;
          var WalletName = '(' + Amount + ' ' + CurrencyCode + ') ' + value.Wallet.Nickname + ' - ' + WalletData;
          if(Id != value.Wallet.Id) {
            if(FromTo == "FROM") {
              if(Amount > 0) {
                Wallets.push(<Option key={value.Wallet.Id}>{WalletName}</Option>);
              }
            } else {
              Wallets.push(<Option key={value.Wallet.Id}>{WalletName}</Option>);
            }
          }
        });
      }
    }
    return Wallets;
  }
  PayeeCrypto(FromTo, Id) {
    var PayeeCrypto = this.state.Payee.PayeeCrypto;
    var PayeeCryptoList = [];
    if( PayeeCrypto != null) {
      if(PayeeCrypto.length > 0) {
        PayeeCrypto.forEach(function(value,index) {
          if(Id != value.Payee.Id) {
            var PayeeCryptoName = value.Payee.Nickname + ' - ' + value.Crypto.Address;
            PayeeCryptoList.push(<Option key={value.Payee.Id}>{PayeeCryptoName}</Option>);
          }
        });
      }
    }
    return PayeeCryptoList;
  }
  myCurrencies(WalletData) {
    //console.log(WalletData);
    const panes = this.initialPanes();
    var activeKey;
    var callback = this.props.callback;
    var mythis = this;
    WalletData.forEach(function(value,index) {
      var closable = true;
      if(value.Wallet.Amount > 0 || value.Wallet.AmountLocked > 0) {
        closable = false;
      }
      activeKey = `${value.Wallet.Id}`;
      var title = mythis.ApiCoinford.getCurrencyCode(value.Wallet.CurrencyId);
      panes.push({ title: title,
        content: <TransferList
        CurrencyId={value.Wallet.CurrencyId}
        WalletListList={value.Addresses}
        callback={mythis.props.callback} />,
        key: activeKey, closable: closable });
    });
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
    this.ApiCoinford.deleteFundTransfer(parseInt(targetKey, 10), this.notify, this.myCurrencies, this.props.callback);
    //this[action](targetKey);
  }
  selectPayeeId(values, TransferType) {
    if(TransferType == "BANK") {
      values.ToDataId = parseInt(values.Payee, 10)
    } else if(TransferType == "PAYEE") {
      values.ToPayeeId = parseInt(values.Payee, 10)
    } else if(TransferType == "WALLET") {
      values.ToWalletId = parseInt(values.Payee, 10)
    }
    return values;
  }
  handleAddSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values = this.selectPayeeId(values, this.state.TransferType);
        values.FromWalletId = parseInt(values.FromAccount, 10)
        values.Amount = parseFloat(values.Amount, 10)
        var TransferSearch = {
          CurrencyId: this.state.CurrencyId,
          CurrencyType: this.state.CurrencyType,
          TransferType: this.state.TransferType,
        };
        values.TransferSearch = TransferSearch;
        console.log(values);
        this.ApiCoinford.addTransfer(values, this.notify, this.myCurrencies, this.props.callback);
      }
    });
  }
  listTransferType() {
    var TransferTypeList = [];
    const CurrenciesFIAT = this.Currencies("FIAT");
    const CurrenciesCRYPTO = this.Currencies("CRYPTO");

    if(CurrenciesCRYPTO.length > 0 || CurrenciesFIAT.length > 0) {
      TransferTypeList.push(<RadioButton value="WALLET" key="WALLET">Wallet</RadioButton>);
      TransferTypeList.push(<RadioButton value="PAYEE" key="PAYEE">Payee</RadioButton>);
    }
    if(CurrenciesFIAT.length > 0) {
      TransferTypeList.push(<RadioButton value="BANK" key="BANK">Bank</RadioButton>);
    }
    console.log(TransferTypeList);
    return TransferTypeList;
  }
  listCurrencyType(TransferType) {
    var CurrencyTypeList = [];
    const CurrenciesFIAT = this.Currencies("FIAT");
    const CurrenciesCRYPTO = this.Currencies("CRYPTO");
    switch (TransferType) {
      case "WALLET":
        if(CurrenciesCRYPTO.length > 0) {
          CurrencyTypeList.push(<RadioButton value="CRYPTO" key="CRYPTO">Crypto</RadioButton>);
        }
        if(CurrenciesFIAT.length > 0) {
          CurrencyTypeList.push(<RadioButton value="FIAT" key="FIAT">Fiat</RadioButton>);
        }
        break;
      case "PAYEE":
        if(CurrenciesCRYPTO.length > 0) {
          CurrencyTypeList.push(<RadioButton value="CRYPTO" key="CRYPTO">Crypto</RadioButton>);
        }
        break;
      case "BANK":
        if(CurrenciesFIAT.length > 0) {
          CurrencyTypeList.push(<RadioButton value="FIAT" key="FIAT">Fiat</RadioButton>);
        }
        break;
      default:
    }
    return CurrencyTypeList;
  }
  handleTransferTypeChange = (e) => {
    const TransferType = e.target.value;
    var CurrencyTypeShow = false;
    var CurrencyTypeList = [];
    var CurrencyType = this.state.CurrencyType;
    var CurrencyId = this.state.CurrencyId;
    var CurrencyListShow = false;
    var Currencies = [];
    const CurrencyName = '';
    const FromAccountShow = false;
    const FromAccountList = [];
    const FromAccountLabel = '';
    const PayeeShow = false;
    const PayeeList = [];
    const PayeeLabel = '';
    const PayeeButtonShow = false;
    const PayeeButtonLabel = '';
    const AmountShow = false;
    const ButtonShow = false;

    if(TransferType != '') {
      CurrencyTypeList = this.listCurrencyType(TransferType);
      switch (TransferType) {
        case "WALLET":
          break;
        case "PAYEE":
            CurrencyType = "CRYPTO";
            CurrencyId = 0;
          break;
        case "BANK":
            CurrencyType = "FIAT";
            CurrencyId = 0;
          break;
        default:
      }
    }
    if(CurrencyTypeList.length > 0) {
      CurrencyTypeShow = true;
      if(CurrencyType != '') {
        Currencies = this.Currencies(CurrencyType);
      }
      if(Currencies.length > 0) {
        CurrencyListShow = true;
      }
    }

    this.setState({ TransferType, CurrencyTypeShow, CurrencyTypeList,
      CurrencyType, CurrencyId,
      CurrencyListShow, Currencies, CurrencyName,
      FromAccountShow, FromAccountList, FromAccountLabel,
      PayeeShow, PayeeList, PayeeLabel, PayeeButtonShow,
      PayeeButtonLabel, AmountShow, ButtonShow });

  }
  handleCurrencyTypeChange = (e) => {
    const TransferType = this.state.TransferType;
    const CurrencyTypeShow = this.state.CurrencyTypeShow;
    const CurrencyTypeList = this.state.CurrencyTypeList;
    const CurrencyType = e.target.value;
    const CurrencyId = this.state.CurrencyId;
    var CurrencyListShow = false;
    var Currencies = [];
    const CurrencyName = '';
    const FromAccountShow = false;
    const FromAccountList = [];
    const FromAccountLabel = '';
    const PayeeShow = false;
    const PayeeList = [];
    const PayeeLabel = '';
    const PayeeButtonShow = false;
    const PayeeButtonLabel = '';
    const AmountShow = false;
    const ButtonShow = false;

    if(CurrencyType != '') {
      Currencies = this.Currencies(CurrencyType);
    }

    if(Currencies.length > 0) {
      CurrencyListShow = true;
    }

    this.setState({ TransferType, CurrencyTypeShow, CurrencyTypeList,
      CurrencyType, CurrencyId,
      CurrencyListShow, Currencies, CurrencyName,
      FromAccountShow, FromAccountList, FromAccountLabel,
      PayeeShow, PayeeList, PayeeLabel, PayeeButtonShow,
      PayeeButtonLabel, AmountShow, ButtonShow });
  }
  handleCurrencyChange(value) {
    const TransferType = this.state.TransferType;
    const CurrencyType = this.state.CurrencyType;
    const CurrencyId = parseInt(value, 10);

    const CObj = this.ApiCoinford.getCurrencyObject(CurrencyId);
    const CurrencyName = CObj.Name + ' ('+ CObj.Code +')';
    this.loadPayeeList(TransferType, CurrencyType, CurrencyId);
    this.setState({ CurrencyId, CurrencyName });
  }
  updateCurrencyChange() {
    const TransferType = this.state.TransferType;
    const CurrencyTypeShow = this.state.CurrencyTypeShow;
    const CurrencyTypeList = this.state.CurrencyTypeList;
    const CurrencyType = this.state.CurrencyType;
    const CurrencyId = this.state.CurrencyId;
    const CurrencyListShow = this.state.CurrencyListShow;
    const Currencies = this.state.Currencies;
    const CurrencyName = this.state.CurrencyName;
    var FromAccountShow = false;
    var FromAccountList = [];
    var FromAccountLabel = '';
    const PayeeShow = false;
    const PayeeList = [];
    const PayeeLabel = '';
    const PayeeButtonShow = false;
    const PayeeButtonLabel = '';
    const AmountShow = false;
    const ButtonShow = false;

    FromAccountList = this.selectPayeeList(TransferType, CurrencyType, "FROM");
    FromAccountLabel = this.selectPayeeLabel(TransferType, CurrencyType, "FROM");

    if(FromAccountList.length > 0) {
      FromAccountShow = true;
    }

    this.setState({ TransferType, CurrencyTypeShow, CurrencyTypeList,
      CurrencyType, CurrencyId,
      CurrencyListShow, Currencies, CurrencyName,
      FromAccountShow, FromAccountList, FromAccountLabel,
      PayeeShow, PayeeList, PayeeLabel, PayeeButtonShow,
      PayeeButtonLabel, AmountShow, ButtonShow });
  }
  handleFromAccountChange(value) {
    const TransferType = this.state.TransferType;
    const CurrencyTypeShow = this.state.CurrencyTypeShow;
    const CurrencyTypeList = this.state.CurrencyTypeList;
    const CurrencyType = this.state.CurrencyType;
    const CurrencyId = this.state.CurrencyId;
    const CurrencyListShow = this.state.CurrencyListShow;
    const Currencies = this.state.Currencies;
    const CurrencyName = this.state.CurrencyName;
    const FromAccountShow = this.state.FromAccountShow;
    const FromAccountList = this.state.FromAccountList;
    const FromAccountLabel = this.state.FromAccountLabel;
    var PayeeShow = false;
    var PayeeList = [];
    var PayeeLabel = '';
    var PayeeButtonShow = false;
    var PayeeButtonLabel = '';
    const AmountShow = false;
    const ButtonShow = false;

    var FromAccountId = parseInt(value, 10);

    PayeeList = this.selectPayeeList(TransferType, CurrencyType, "TO", FromAccountId);
    PayeeLabel = this.selectPayeeLabel(TransferType, CurrencyType, "TO");

    if(PayeeList.length > 0) {
      PayeeShow = true;
    }
    if(TransferType == "WALLET" || TransferType == "PAYEE") {
      PayeeButtonLabel = this.selectPayeeButton(TransferType);
      PayeeButtonShow = true;
    }

    this.setState({ TransferType, CurrencyTypeShow, CurrencyTypeList,
      CurrencyType, CurrencyId,
      CurrencyListShow, Currencies, CurrencyName,
      FromAccountShow, FromAccountList, FromAccountLabel,
      PayeeShow, PayeeList, PayeeLabel, PayeeButtonShow,
      PayeeButtonLabel, AmountShow, ButtonShow });
  }
  handlePayeeChange() {
    var AmountShow = true;
    var ButtonShow = true;
    this.setState({ AmountShow, ButtonShow });
  }
  addPayee() {
    const TransferType = this.state.TransferType;
    if(TransferType == "WALLET") {
      this.ApiCoinford.setUiName('Wallet');
      this.props.callback();
    } else if(TransferType == "PAYEE") {
      this.ApiCoinford.setUiName('Payee');
      this.props.callback();
    }
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
            label="Transfer To"
            required={true}
          >
          {getFieldDecorator('TransferType', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: 'Please select transfer type',
            }],
          })(
            <RadioGroup onChange={this.handleTransferTypeChange}>
              {this.state.TransferTypeList}
            </RadioGroup>          )}
          </FormItem>
          {this.state.CurrencyTypeShow ? (
          <FormItem
            {...formItemLayout}
            label="Currency Type"
            required={true}
          >
          {getFieldDecorator('CurrencyType', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: 'Please select transfer type',
            }],
          })(
            <RadioGroup onChange={this.handleCurrencyTypeChange}>
              {this.state.CurrencyTypeList}
            </RadioGroup>          )}
          </FormItem>
          ) : null}
          {this.state.CurrencyListShow ? (
          <FormItem
            {...formItemLayout}
            label="Your Currency"
            required={false}
          >
          {getFieldDecorator('CurrencyId', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: false,
              whitespace: true,
              message: 'Please select your currency',
            }],
          })(
            <Select
              showSearch
              style={{ width: '60%', marginRight: 8 }}
              placeholder="Select Currency"
              optionFilterProp="children"
              onChange={this.handleCurrencyChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {this.state.Currencies}
            </Select>          )}
          </FormItem>
          ) : null}
          {this.state.FromAccountShow ? (
          <FormItem
            {...formItemLayout}
            label={this.state.FromAccountLabel}
            required={false}
          >
          {getFieldDecorator('FromAccount', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: false,
              whitespace: true,
              message: 'Please select from account',
            }],
          })(
            <Select
              showSearch
              style={{ width: '60%', marginRight: 8 }}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={this.handleFromAccountChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {this.state.FromAccountList}
            </Select>          )}
          </FormItem>
          ) : null}
          {this.state.PayeeShow ? (
          <FormItem
            {...formItemLayout}
            label={this.state.PayeeLabel}
            required={false}
          >
          {getFieldDecorator('Payee', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: false,
              whitespace: true,
              message: 'Please select a Payee',
            }],
          })(
            <Select
              showSearch
              style={{ width: '60%', marginRight: 8 }}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={this.handlePayeeChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {this.state.PayeeList}
            </Select>          )}
          </FormItem>
          ) : null}
          {this.state.PayeeButtonShow ? (
          <FormItem {...tailFormItemLayout}>
            <Button onClick={this.addPayee}>
              <Icon type={this.state.TransferType == "WALLET" ? ("wallet") : ("user-add")} />
              {this.state.PayeeButtonLabel}
            </Button>
          </FormItem>
          ) : null}
          {this.state.AmountShow ? (
          <FormItem
            {...formItemLayout}
            label="Amount"
            required={false}
          >
          {getFieldDecorator('Amount', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: false,
              whitespace: true,
              message: 'Please provide the amount you want to transfer',
            }],
          })(
          <Input placeholder='Amount' style={{ width: '60%', marginRight: 8 }} />
          )}
          </FormItem>
          ) : null}
          {this.state.ButtonShow ? (
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Transfer</Button>
          </FormItem>
          ) : null}
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
const Transfer = Form.create()(TransferForm);
module.exports = Transfer;
