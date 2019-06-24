import React from 'react';
import ApiCoinfordAdmin from '../class/ApiCoinfordAdmin';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.register = this.register.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.ApiCoinfordAdmin = new ApiCoinfordAdmin();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.ApiCoinfordAdmin.login(values, this.props.callback)
      }
    });
  }
  register() {
    this.ApiCoinfordAdmin.setUiName('Register');
    this.props.callback();
  }
  forgotPassword() {
    this.ApiCoinfordAdmin.setUiName('ForgotPassword');
    this.props.callback();
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
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem
          {...formItemLayout}
          label="Admin Name"
          hasFeedback
        >
          {getFieldDecorator('Adminname', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Adminname" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Password"
          hasFeedback
        >
          {getFieldDecorator('Password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
          {getFieldDecorator('Remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" onClick={this.forgotPassword}>Forgot password</a>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          &nbsp;&nbsp; Or <a onClick={this.register}>Register now!</a>
        </FormItem>
      </Form>
    );
  }
}
const Login = Form.create()(LoginForm);
module.exports = Login;
