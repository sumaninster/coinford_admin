import React from 'react';
import ApiCoinford from '../class/ApiCoinford';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class ForgotPasswordForm extends React.Component {
  constructor(props) {
    super(props)
    this.login = this.login.bind(this);
    this.ApiCoinford = new ApiCoinford();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.ApiCoinford.login(values, this.props.callback)
      }
    });
  }
  login() {
    this.ApiCoinford.setUiName('Login');
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
          label="Email Id"
          hasFeedback
        >
          {getFieldDecorator('Username', {
            rules: [{ required: true, message: 'Please input your email Id!' }],
          })(
            <Input prefix={<Icon type="email" style={{ fontSize: 13 }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Reset Password
          </Button>
          &nbsp;&nbsp; Or <a onClick={this.login}>Login!</a>
        </FormItem>
      </Form>
    );
  }
}
const ForgotPassword = Form.create()(ForgotPasswordForm);
module.exports = ForgotPassword;
