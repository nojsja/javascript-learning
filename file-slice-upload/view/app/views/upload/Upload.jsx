import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Modal, Upload, Checkbox } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { fnDebounce, formatSizeStr } from 'utils/utils';
// import SelectObjectList from './SelectObjectList';

const { Dragger } = Upload;

@inject('lang', 'router')
@observer
class SelectObject extends Component {
  state = {
    selectAll: false,
    load: true,
  }

  fnDebounce = fnDebounce()
  bucket = ''

  componentDidMount() {
    this.props.upload.clearCache();
    this.bucket = sessionStorage.getItem('resource.bucket.details.bucket');
  }

  setSelectAll = (e) => {
    this.setState({
      selectAll: e.target.checked,
    });
  }

  handleCancel = () => {
    this.props.changeModel(false);
    this.removeAllTask();
  }
  handleSubmit = () => {
    this.props.changeModel(false);
    this.props.handleOpenTask();
    this.registryFile(this.props.upload.filesCache);
    this.props.upload.clearCache();
    this.props.upload.startTasks(this.bucket);
  }

  registryFile = (fileList) => {
    const prefix = window.sessionStorage.getItem('object.currtpath') || '';
    this.props.upload.registry(fileList, this.bucket, prefix);
  }

  cacheFile = (fileList) => {
    this.setState({
      load: false,
    }, () => {
      this.setState({
        load: true,
      });
    });
    this.props.upload.cacheFile(fileList, this.bucket);
  }

  removeAllTask = () => {
    this.setState({
      load: false,
    }, () => {
      this.setState({
        load: true,
      });
    });
    const { upload } = this.props;
    // upload.uploadTerm({ region: this.bucket, all: true });
    upload.clearCache();
  }

  removeOneTask = (event) => {
    const { upload } = this.props;
    // upload.uploadTerm({
    //   file: {
    //     name: event.target.getAttribute('attr-name'),
    //     type: event.target.getAttribute('attr-type'),
    //     size: event.target.getAttribute('attr-size'),
    //   },
    //   region: this.bucket,
    // });
    upload.clearCache({
      name: event.target.getAttribute('attr-name'),
      type: event.target.getAttribute('attr-type'),
      size: event.target.getAttribute('attr-size'),
    });
  }

  selectAllClick = () => {
    if (this.state.selectAll) {
      this.removeAllTask();
    }
  }

  getTotalSize = (files) => {
    if (files.length) {
      let total = 0;
      files.forEach((file) => {
        total += file.size;
      });
      return formatSizeStr(total);
    }
    return 0;
  }

  render() {
    const { lang } = this.props.lang;
    const { upload } = this.props;
    const that = this;
    const UploadConfiguration = {
      name: 'file',
      multiple: true,
      directory: true,
      showUploadList: false,
      // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      customRequest: () => {
        // empty extends
      },
      onChange(info) {
        that.fnDebounce(that.cacheFile, 500, false, info.fileList.map(fileInfo => fileInfo.originFileObj));
      },
    };

    const UploadFileConfiguration = {
      name: 'file',
      multiple: true,
      showUploadList: false,
      // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        that.fnDebounce(that.cacheFile, 500, false, info.fileList.map(fileInfo => fileInfo.originFileObj));
      },
    };

    return (
      <Modal
        title={lang.selectObject}
        className="dtModalEdit"
        visible={this.props.visible}
        maskClosable={false}
        closable={false}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={[
          <Button key="back" type="danger" ghost onClick={this.handleCancel}>{lang.cancel}</Button>,
          <Button key="submit" type="primary" ghost onClick={this.handleSubmit}>{lang.OK}</Button>,
        ]}
      >
        <div className="select-object-dragger-wrapper">
          {this.state.load && (
            <div>
              <Dragger {...UploadConfiguration}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined/>
                </p>
                {/* Click or drag file to this area to upload */}
                <p className="ant-upload-text">{lang.clickOrDrag}</p>
                {/* Support for a single or bulk upload.  */}
                <p className="ant-upload-hint">{lang.clickOrDragTips}</p>
              </Dragger>
              <div className="object-dragger-uploader">
                <Upload {...UploadFileConfiguration}>
                  <Button size="small">
                  <UploadOutlined/> {lang.uploadFile}
                  </Button>
                </Upload>
                <Upload {...{ ...UploadFileConfiguration, ...{ directory: true } }}>
                  <Button size="small">
                  <UploadOutlined/> {lang.uploadDirectory}
                  </Button>
                </Upload>
              </div>
            </div>
          )}

          {
          (
            <div className="select-object-div">
              <div className="select-object-div-title">
                <span>{lang.Numberofobjects}{lang.colon}{upload.filesCache.length}</span>
                <span>{lang.Totalsize}{lang.colon}{this.getTotalSize(upload.filesCache)}</span>
                <span title={this.bucket}>{lang.targetBucket}{lang.colon}{this.bucket}</span>
              </div>

              <div className="select-object-div-header">
                <span><Checkbox onChange={this.setSelectAll}>{lang.selectAll}</Checkbox></span>
                <span>
                  <i
                    className="iconfont icon-cuo warningColor hoverPointer"
                    onClick={this.selectAllClick}
                  />
                </span>
              </div>
            </div>
          )
        }

          {/* <SelectObjectList
            removeOneTask={this.removeOneTask}
            bucket={this.bucket}
            upload={upload}
          /> */}

        </div>
      </Modal>
    );
  }
}
export default SelectObject;
