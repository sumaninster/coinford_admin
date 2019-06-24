import React from 'react';
import { Tabs, Form, Button, Select, Tooltip, Icon } from 'antd';
import ProfileDetail from './ProfileDetail';
import ApiCoinfordAdmin from '../class/ApiCoinfordAdmin';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class ProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.ApiCoinfordAdmin = new ApiCoinfordAdmin();
    this.notify = this.notify.bind(this);
    this.countries = this.countries.bind(this);
    this.myCountries = this.myCountries.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    const panes = this.initialPanes();
    this.state = {
      panes,
      CountryId: 0,
      Countries: [],
    };
  }
  initialPanes() {
    const panes = [
      { title: 'Profile',
      content: <ProfileDetail subMenu='Profile'
      callback={this.props.callback} />,
      key: 'Profile', closable: false },
    ];
    return panes;
  }
  componentDidMount() {
    var RequestCountries = {
      OnlyMine: "NO",
      Eligible: "",
    };
    this.ApiCoinfordAdmin.countries(RequestCountries, this.countries, this.props.callback);
    var RequestCountries = {
      OnlyMine: "YES",
      Eligible: "",
    };
    this.ApiCoinfordAdmin.userCountries(RequestCountries, this.myCountries, this.props.callback);
  }
  countries(CountryList) {
    var Countries = [];
    CountryList.forEach(function(value,index) {
      var CountryName = value.Name + ' (' + value.Code + ')';
      Countries.push(<Option key={value.Id}>{CountryName}</Option>);
    });
    this.setState({ Countries });
  }
  myCountries(Countries) {
    const panes = this.initialPanes();
    var activeKey;
    var callback = this.props.callback;
    var mythis = this;
    Countries.forEach(function(value,index) {
      var closable = true;
      if(value.UserCountry.Eligible == 'YES') {
        closable = false;
      }
      activeKey = `${value.UserCountry.Id}`;
      panes.push({ title: value.Country.Name,
        content: <ProfileDetail subMenu='KYC'
        Eligible={value.UserCountry.Eligible}
        CountryId={value.Country.Id}
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
    this.ApiCoinfordAdmin.CountryId = parseInt(activeKey, 10)
  }
  onEdit = (targetKey, action) => {
    var RequestCountries = {
      OnlyMine: "YES",
      Eligible: "",
    };
    this.ApiCoinfordAdmin.deleteUserCountry(parseInt(targetKey, 10), RequestCountries, this.notify, this.myCountries, this.props.callback);
    //this[action](targetKey);
  }
  handleAddSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var RequestCountries = {
          OnlyMine: "YES"
        };
        this.ApiCoinfordAdmin.addUserCountry(this.state.CountryId, RequestCountries, this.notify, this.myCountries, this.props.callback);
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
                Your Country&nbsp;
                <Tooltip title="To trade in native currency, add your Country">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
            hasFeedback
          >
            {getFieldDecorator('CountryId', {
              rules: [{ required: true, message: 'Please select a Country!', whitespace: true }],
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
              {this.state.Countries}
              </Select>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Add Country</Button>
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
const Profile = Form.create()(ProfileForm);
module.exports = Profile;
