import React from 'react';
import { Upload, Icon, Modal } from 'antd';
import ApiCoinford from '../class/ApiCoinford';

class File extends React.Component {
  constructor(props) {
    super(props)
    this.handleSuccess = this.handleSuccess.bind(this);
    this.ApiCoinford = new ApiCoinford();
    var uploadUrl = this.ApiCoinford.Baseurl + "file/upload";
    var formData = new FormData();
    formData.append('Token', this.ApiCoinford.getToken());
    formData.append('DataId', 10);
    formData.append('FieldId', 1)
    /*var uploadData = {
      Token: this.ApiCoinford.getToken()
    }*/
    this.state = {
        uploadUrl: uploadUrl,
        formData: formData,
        previewVisible: false,
        previewImage: '',
        fileList: [],
      };
  }
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (!isJPG && !isPNG) {
      //message.error('You can only upload JPG or PNG file!');
      console.log('You can only upload JPG or PNG file!');
    }
    console.log(file.size);
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isLt2M) {
      console.log('Image must smaller than 2MB!');
    }
    return (isJPG || isPNG) && isLt2M;
  }
  uploadFile() {
    this.ApiCoinford.uploadFile(this.props.RequestField, this.props.callback, this.props.callback);
  }
  handleSuccess() {
    console.log("handleSuccess");
  }
  handleChange = ({ fileList }) => {
    console.log(fileList);
    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          name={'File'}
          action={this.state.uploadUrl}
          formData={this.state.formData}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
          multiple={true}
          //headers={{method: 'POST', enctype: 'multipart/form-data'}}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

module.exports = File;
