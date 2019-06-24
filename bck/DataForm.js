import React from 'react';
import { Form, Input, Icon, Button, Checkbox, Select, Tooltip } from 'antd';
import File from './File';
import DataList from './DataList';
import ApiCoinford from '../class/ApiCoinford';
const FormItem = Form.Item;
const Option = Select.Option;

class DataForm extends React.Component {
  constructor(props) {
    super(props)
    this.displayForm = this.displayForm.bind(this);
    this.displayData = this.displayData.bind(this);
    this.fieldList = this.fieldList.bind(this);
    this.ApiCoinford = new ApiCoinford();
    this.state = {
      Fields: [],
      Active: true,
      RequestField: [],
    }
  }
  componentDidMount() {
    this.fieldList();
    /*this.props.form.setFieldsValue({
          Active: true,
    });*/
  }
  fieldList() {
    var RequestField = {
      CountryId: this.props.CountryId,
      FieldType: this.props.FieldType,
    };
    this.setState({ RequestField });
    if(this.props.Eligible == 'YES') {
      this.ApiCoinford.listData(RequestField, this.displayData, this.props.callback);
    } else {
      this.ApiCoinford.listData(RequestField, this.displayData, this.props.callback);
      this.ApiCoinford.fields(RequestField, this.displayForm, this.props.callback);
    }
  }
  displayData(DataGroup) {
    this.DataList.updateUi(DataGroup);
  }
  displayForm(Fields) {
    Fields.forEach(function(value,index) {
      var CategoryOptions = [];
      if(value.Field.HasCategory) {
        var Category = value.Category;
        Category.forEach(function(value1,index1) {
          CategoryOptions.push(<Option key={value1.Id}>{value1.Name}</Option>);
        });
      }
      value.CategoryOptions = CategoryOptions
      Fields[index] = value;
    });
    this.setState({ Fields });
  }
  FormatData(values) {
    var DataTextArray = [];
    var DataCategoryArray = [];
    var DataFileArray = [];
    var dt = 0, dc = 0, df = 0;
    const { Fields } = this.state;

    Fields.forEach(function(value,index) {
      if(value.Field.HasInputText) {
        var DataText = {
          FieldId: value.Field.Id,
          InputText: values['Text'+value.Field.Id],
        }
        DataTextArray[dt++] = DataText;
      } else if(value.Field.HasCategory) {
        var FieldCategoryId = parseInt(values['Category'+value.Field.Id], 10)
        var DataCategory = {
          FieldId: value.Field.Id,
          FieldCategoryId: FieldCategoryId,
        }
        DataCategoryArray[dc++] = DataCategory;
      } else if(value.Field.HasFile){

      }
    });
    if(values.Active != true && values.Active != false)
      values.Active = false;
    if(values.Primary != true && values.Primary != false)
      values.Primary = false;

    var data = {
      Active: values.Active,
      Primary: values.Primary,
      CountryId: this.props.CountryId,
      FieldType: this.props.FieldType,
      Nickname: values.Nickname,
      //Token: this.ApiCoinford.Token,
      DataCategory: DataCategoryArray,
      DataFile: DataFileArray,
      DataText: DataTextArray,
    }
    return data;
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
        var data = [];
        data = this.FormatData(values);
        //console.log(data);
        this.ApiCoinford.uploadData(data, this.displayData, this.props.callback);
      }
    });
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
    const { Fields } = this.state;
    const formItems = Fields.map((value, index) => {
      var label = Fields[index].Field.Name;
      var message = Fields[index].Field.Description;
      var category = Fields[index].CategoryOptions;
      return (
        <div key={index}>
          {Fields[index].Field.HasCategory ? (
            <FormItem
              {...formItemLayout}
              label={label}
              required={false}
            >
            {getFieldDecorator(`Category${value.Field.Id}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: {message},
              }],
            })(
            <Select
              showSearch
              style={{ width: '60%', marginRight: 8 }}
              placeholder={message}
              optionFilterProp="children"
              onChange={this.handleCountryChange}
              onFocus={this.handleCountryFocus}
              onBlur={this.handleCountryBlur}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {category}
            </Select>
          )}
          </FormItem>
          ) : null }
          {Fields[index].Field.HasInputText ? (
            <FormItem
              {...formItemLayout}
              label={label}
              required={false}
            >
            {getFieldDecorator(`Text${value.Field.Id}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: {message},
              }],
            })(
            <Input placeholder={message} style={{ width: '60%', marginRight: 8 }} />
            )}
            </FormItem>
          ) : null }
          {Fields[index].Field.HasFile ? (
            <FormItem
              {...formItemLayout}
              label={label+' (Upload)'}
              required={false}
            >
            {getFieldDecorator(`File${value.Field.Id}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: {message},
              }],
            })(
            <File RequestField={this.state.RequestField} />
          )}
          </FormItem>
          ) : null }
        </div>
      );
    });
    var nickname_message = "Please provide a nickname";
    switch (this.props.FieldType) {
      case "ADDRESS":
          nickname_message = "Please provide a nickname for this address";
        break;
      case "BANK":
          nickname_message = "Please provide a nickname for this bank information";
        break;
      case "KYC":
          nickname_message = "Please provide a nickname for this document set";
        break;
      default:

    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          {formItems}
          {Fields.length > 0 ? (
            <FormItem
              {...formItemLayout}
              label="Nickname"
              required={false}
            >
            {getFieldDecorator('Nickname', {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: {nickname_message},
              }],
            })(
            <Input placeholder={nickname_message} style={{ width: '60%', marginRight: 8 }} />
            )}
            </FormItem>
          ) : null}
          {Fields.length > 0 ? (
            <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
              <div>
                {getFieldDecorator('Primary', {
                  valuePropName: 'checked',
                })(
                  <Checkbox>Primary</Checkbox>
                )}
                {getFieldDecorator('Active', {
                  valuePropName: 'checked',
                })(
                  <Checkbox>Active</Checkbox>
                )}
              </div>
            </FormItem>
          ) : null}
          {Fields.length > 0 ? (
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">Submit</Button>
            </FormItem>
          ) : null}
        </Form>
        <DataList ref={(instance) => { this.DataList = instance; }} />
      </div>
    );
  }
}

module.exports = DataForm;
