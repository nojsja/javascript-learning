import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { postData } from 'app/utils/request.js';

import './upload.css';

// 批量引入所有图片(可以指定所有图片类型)
// const requireContext = require.context('resources/install', true, /^\.\/.*\.(jpg|png)$/);
// const requireContext = require.context('resources/startup', true, /.*/);
// requireContext.keys().map(requireContext);

@inject('pub', 'upload')
@observer
class UploadPage extends React.Component {
  static propTypes = {
    pub: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  bucket='7777'

  constructor() {
    super();
    this.state = {
    };
  }


  componentDidMount() {
    const { upload } = this.props;
    // upload.loadUploadState();
  }

  componentWillUnmount() {
    const { upload } = this.props;
    // upload.storeUploadState();
  }

  onClick = (e) => {
    this.props.upload.startTasks(this.bucket);
  }

  onChange= (event) => {
    const originFiles = event.target.files;
    const { upload } = this.props;
    const files = [];
    for (let i = 0; i < originFiles.length; i += 1) {
      files.push(originFiles[i]);
    }
    upload.registry(files, this.bucket);
  }

  startAll = () => {
    const { upload } = this.props;
    upload.startTasks(this.bucket);
  }

  pauseAll = () => {
    const { upload } = this.props;
    upload.uploadPause({ region: this.bucket, all: true });
  }

  continueAll = () => {
    const { upload } = this.props;
    upload.uploadContinue({ region: this.bucket, all: true });
  }

  termAll = () => {
    const { upload } = this.props;
    upload.uploadTerm({ region: this.bucket, all: true });
  }

  restoreAll = () => {
    const { upload } = this.props;
    upload.uploadRestore({ region: this.bucket, all: true });
  }

  continue = (event) => {
    const { upload } = this.props;
    upload.uploadContinue({
      file: {
        name: event.target.getAttribute('attr-name'),
        type: event.target.getAttribute('attr-type'),
        size: event.target.getAttribute('attr-size'),
      },
      region: this.bucket,
    });
  }

  pause = (event) => {
    const { upload } = this.props;
    upload.uploadPause({
      file: {
        name: event.target.getAttribute('attr-name'),
        type: event.target.getAttribute('attr-type'),
        size: event.target.getAttribute('attr-size'),
      },
      region: this.bucket,
    });
  }

  term = (event) => {
    const { upload } = this.props;
    upload.uploadTerm({
      file: {
        name: event.target.getAttribute('attr-name'),
        type: event.target.getAttribute('attr-type'),
        size: event.target.getAttribute('attr-size'),
      },
      region: this.bucket,
    });
  }

  restore = (event) => {
    const { upload } = this.props;
    upload.uploadRestore({
      file: {
        name: event.target.getAttribute('attr-name'),
        type: event.target.getAttribute('attr-type'),
        size: event.target.getAttribute('attr-size'),
      },
      region: this.bucket,
    });
  }


  render() {
    const { upload } = this.props;
    const colorMap = {
      uploading: 'green',
      break: '#2f8ada',
      error: 'red',
      uninitial: 'grey',
      pause: '#cab61c',
      pending: '#b4c6d0',
    };
    return (
      <div>
        <input type="file" multiple onChange={this.onChange} />
        <button type="button" onClick={this.startAll} name="start">startAll</button>
        <button type="button" onClick={this.pauseAll} name="pause">pauseAll</button>
        <button type="button" onClick={this.continueAll} name="continue">continueAll</button>
        <button type="button" onClick={this.termAll} name="term">termAll</button>
        <button type="button" onClick={this.restoreAll} name="restore">restoreAll</button>
        <div>
          {
            upload.fileStorage.get(this.bucket) && upload.fileStorage.get(this.bucket).map(info => (
              <div key={info.name}>
                {info.name}
                <span>/</span>
                {`${(info.index / info.total).toFixed(2) * 100}%`}
                <span>/</span>
                <span style={
                  {
                    color: colorMap[info.state],
                  }
                }
                >
                  { info.state }
                </span>
                <span>/</span>
                <span>
                  <button
                    type="button"
                    attr-name={info.file.name}
                    attr-type={info.file.type}
                    attr-size={info.file.size}
                    onClick={this.pause}
                  >
                    pause
                  </button>
                  <button
                    type="button"
                    attr-name={info.file.name}
                    attr-type={info.file.type}
                    attr-size={info.file.size}
                    onClick={this.continue}
                  >
                    continue
                  </button>
                  <button
                    type="button"
                    attr-name={info.file.name}
                    attr-type={info.file.type}
                    attr-size={info.file.size}
                    onClick={this.term}
                  >
                    term
                  </button>
                  <button
                    type="button"
                    attr-name={info.file.name}
                    attr-type={info.file.type}
                    attr-size={info.file.size}
                    onClick={this.restore}
                  >
                    restore
                  </button>
                </span>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
export default UploadPage;
