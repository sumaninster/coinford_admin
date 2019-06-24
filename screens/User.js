import React from 'react';
import { Form, Radio, Button, Select } from 'antd';
import UserList from './UserList';
import ApiCoinfordAdmin from '../class/ApiCoinfordAdmin';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class UserForm extends React.Component {
  constructor(props) {
    super(props)
    this.updateCountryList = this.updateCountryList.bind(this);
    this.updateUiList = this.updateUiList.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleEligibleChange = this.handleEligibleChange.bind(this);
    this.ApiCoinfordAdmin = new ApiCoinfordAdmin();
    this.state = {
      CountryId: 0,
      Eligible: "",
      UserSearch: {},
      CountryOptions: [],
    };
  }
  componentDidMount() {
    var UserSearch = {};
    UserSearch.CountryId = 1;
    UserSearch.Eligible = "";
    this.ApiCoinfordAdmin.listCountries(this.updateCountryList, this.props.callback);
    this.ApiCoinfordAdmin.listUsers(UserSearch, this.updateUiList, this.props.callback);
  }
  updateCountryList(CountryList) {
    var CountryOptions = [];
    CountryList.forEach(function(value,index) {
      CountryOptions.push(<Option key={value.Id}>{value.Name}</Option>);
    });
    this.setState({ CountryOptions });
  }
  updateUiList(UserList) {
    this.userList.updateUi(UserList);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var UserSearch = {};
        UserSearch.CountryId = parseInt(values.CountryId, 10);
        UserSearch.Eligible = values.Eligible;
        this.ApiCoinfordAdmin.listUsers(UserSearch, this.updateUiList, this.props.callback);
      }
    });
  }
  handleCountryChange(value) {
    const CountryId = parseInt(value, 10);
    this.setState({ CountryId });
  }
  handleCountryBlur() {
    //console.log('blur');
  }
  handleCountryFocus() {
    //console.log('focus');
  }
  handleEligibleChange(value) {
    const Eligible = value;
    this.setState({ Eligible });
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
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="Country"
          >
            {getFieldDecorator('CountryId', {
              rules: [{ required: true, message: 'Please select Country!', whitespace: false }],
            })(
              <Select
                showSearch
                style={{ width: '60%', marginRight: 8 }}
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={this.handleCountryChange}
                onFocus={this.handleCountryFocus}
                onBlur={this.handleCountryBlur}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
              {this.state.CountryOptions}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Eligible"
          >
            {getFieldDecorator('Eligible', {
              rules: [{ required: true, message: 'Please select eligiblity!', whitespace: false }],
            })(
              <RadioGroup onChange={this.handleEligibleChange}>
                <RadioButton value="YES">Yes</RadioButton>
                <RadioButton value="NO">No</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Search</Button>
          </FormItem>
        </Form>
        <UserList
        homeCallback={this.props.callback}
        callback={this.updateUiList}
        ref={(userList) => { this.userList = userList; }} />
      </div>
    )
  }
}
const User = Form.create()(UserForm);
module.exports = User;
