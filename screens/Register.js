import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import ApiCoinfordAdmin from '../class/ApiCoinfordAdmin';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props)
    this.login = this.login.bind(this);
    this.ApiCoinfordAdmin = new ApiCoinfordAdmin();
    this.handleAdminGroupChange = this.handleAdminGroupChange.bind(this);
    this.state = {
      AdminGroups: [],
      AdminGroupId: 0,
      confirmDirty: false,
      autoCompleteResult: [],
    };
  }
  componentDidMount() {
    this.AdminGroups();
  }
  AdminGroups() {
    var AdminGroups = [];
    var AdminGroupList = this.ApiCoinfordAdmin.AdminGroups;
    AdminGroupList.forEach(function(value,index) {
      AdminGroups.push(<Option key={value.Id}>{value.Name}</Option>);
    });
    this.setState({ AdminGroups });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const AdminGroupId = parseInt(values.AdminGroupId, 10);
        values.AdminGroupId = AdminGroupId;
        console.log('Received values of form: ', values);
        this.ApiCoinfordAdmin.register(values, this.props.callback);
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('Password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['ConfirmPassword'], { force: true });
    }
    callback();
  }

  checkAdminname = (rule, value, callback) => {
    this.ApiCoinfordAdmin.isUniqueAdminname(value, callback);
  }
  login() {
    this.ApiCoinfordAdmin.setUiName('Login');
    this.props.callback();
  }
  handleAdminGroupChange(value) {
    const AdminGroupId = parseInt(value, 10);
    this.setState({ AdminGroupId });
  }
  handleAdminGroupBlur() {
    //console.log('blur');
  }
  handleAdminGroupFocus() {
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
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="Name"
          hasFeedback
        >
        {getFieldDecorator('Name', {
          rules: [{ required: true, message: 'Please input your name!', whitespace: true }],
        })(
          <Input />
        )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="E-mail"
          hasFeedback
        >
          {getFieldDecorator('Email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Password"
          hasFeedback
        >
          {getFieldDecorator('Password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Confirm Password"
          hasFeedback
        >
          {getFieldDecorator('ConfirmPassword', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Adminname"
          hasFeedback
        >
          {getFieldDecorator('Adminname', {
            rules: [{
              required: true, message: 'Please select a Adminname!',
            }, {
              validator: this.checkAdminname,
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              Admin Group&nbsp;
              <Tooltip title="Select Admin Group">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
          hasFeedback
        >
          {getFieldDecorator('AdminGroupId', {
            rules: [{ required: true, message: 'Please select admin type!', whitespace: true }],
          })(
            <Select
              showSearch
              placeholder="Select Admin Group"
              optionFilterProp="children"
              onChange={this.handleAdminGroupChange}
              onFocus={this.handleAdminGroupFocus}
              onBlur={this.handleAdminGroupBlur}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {this.state.AdminGroups}
            </Select>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Register Admin</Button>
        </FormItem>
      </Form>
    );
  }
}

const Register = Form.create()(RegistrationForm);
module.exports = Register;
