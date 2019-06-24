import React from 'react';
import { Table } from 'antd';
import ApiCoinford from '../class/ApiCoinford';

class DataList extends React.Component {
  constructor(props) {
    super(props);
    this.updateUi = this.updateUi.bind(this);
    this.ApiCoinford = new ApiCoinford();
  }
  state = {
    DataGroup: [],
    loading: false,
    columns: [],
    DataList: [],
  };
  handleDelete() {
    console.log('delete');
  }
  handleEdit() {
    console.log('edit');
  }
  updateUi(DataGroup) {
    this.setState({
      loading: false,
      DataGroup: DataGroup,
    });
    var columns = [{
      title: 'Nickname',
      dataIndex: 'Nickname',
      key: 'Nickname',
    }];
    var DataDetail = DataGroup[0].DataDetail;
    DataDetail.forEach(function(value,index) {
      //var key = `data${value.Field.Id}`
      //console.log(value);
      var column = {
        title: value.Field.Name,
        dataIndex: value.Field.Id,
        key: value.Field.Id,
      };
      columns.push(column);
    });
    var primaryColumn = {
      title: 'Primary',
      dataIndex: 'Primary',
      key: 'Primary',
    };
    columns.push(primaryColumn);
    var activeColumn = {
      title: 'Active',
      dataIndex: 'Active',
      key: 'Active',
    }
    columns.push(activeColumn);
    var actionColumn = {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={this.handleEdit}>Edit</a>
          <span className="ant-divider" />
          <a onClick={this.handleDelete}>Delete</a>
        </span>
      ),
    };
    columns.push(actionColumn);
    this.setState({ columns });
    var DataList = [];
    DataGroup.forEach(function(value,index) {
      var dataRow = {};
      dataRow['Id'] = value.Data.Id;
      dataRow['Nickname'] = value.Data.Nickname;
      if(value.Data.Primary) {
        dataRow['Primary'] = 'Yes';
      } else {
        dataRow['Primary'] = 'No';
      }
      if(value.Data.Active) {
        dataRow['Active'] = 'Yes';
      } else {
        dataRow['Active'] = 'No';
      }
      var DataDetail = value.DataDetail
      DataDetail.forEach(function(value1,index1) {
        var data = "";
        if(value1.Field.HasInputText) {
          if( value1.DataText != null ) {
            data = value1.DataText.Text;
          }
        } else if(value1.Field.HasCategory){
          if( value1.FieldCategory != null ) {
            if(data != "") {
              data += " " + value1.FieldCategory.Name;
            } else {
              data = value1.FieldCategory.Name;
            }
          }
        } else if(value1.Field.HasFile) {
          if( value1.DataFile != null ) {
            if(data != "") {
              data += " " + value1.DataFile.Name;
            } else {
              data = value1.DataFile.Name;
            }
          }
        }
        dataRow[value1.Field.Id] = data;
      });
      DataList.push(dataRow);
    });
    this.setState({ DataList });
  }
  render() {
    const { DataGroup } = this.state;
    return (
      <div>
      {DataGroup.length > 0 ? (
        <Table
          loading={this.state.loading}
          bordered
          rowKey='Id'
          columns={this.state.columns}
          dataSource={this.state.DataList} />
      ) : null }
      </div>
    )
  }
}
module.exports = DataList;
