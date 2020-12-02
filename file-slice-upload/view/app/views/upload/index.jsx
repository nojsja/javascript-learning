import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

const path = require('path');

import { Tooltip, Badge } from 'antd';

import TaskDrawer from './TaskDrawer';
import Upload from './Upload';


@inject('lang', 'modalActions', 'upload')
class UploadPage extends Component {

  state={
    taskDrawerState: false,
    uploadModalState: false,
  }

  uploadDirRef = React.createRef();
  uploadFileRef = React.createRef();

  componentDidMount() {
    this.props.upload.setLang(this.props.lang);
  }

  // 上传文件
  handleUploadFiles = (e) => {
    // const files = dialog.showOpenDialogSync(remote.getCurrentWindow(), {
    //   properties: ['openFile', 'multiSelections'],
    // });
    const state = true;
    const files = e.target.files;
    const { sharename, prepath } = this.props.upload.getSharenameAndPrepath();
    const dirSymbol = path.join('/');
    const host = 'localhost';
    const user = 'default';
    const filesIterator = [];

    if (files && files.length) {
      for (let i=0; i<files.length; i++) {
        if (files[i]) filesIterator.push(files[i]);
      }
      
      this.props.upload.cacheFile(
        filesIterator.map(file => ({
          name: file.name,
          type: file.type || (file.name).split('.').pop(),
          abspath: file.path,
          sharename,
          size: file.size,
          fileOrigin: file
        })),
        `${host}_${user}_${sharename}`
      );
      this.props.upload.registry(this.props.upload.filesCache, `${host}_${user}_${sharename}`, prepath);
      this.props.upload.clearCache();
      this.uploadFileRef.current.value = '';

      this.props.upload.startTasks(`${host}_${user}_${sharename}`);
      this.setState({
        taskDrawerState: state,
      });

    }
  }

  // 上传文件夹
  handleUploadDirs = (e) => {
    const state = true;
    const dirs = e.target.files;
    const host = 'default';
    const user = 'default';
    const filesIterator = [];

    
    if (dirs && dirs.length) {
      for (let i = 0; i < dirs.length; i++) {
        if (dirs[i]) filesIterator.push(dirs[i]);
      }
      const { sharename, prepath } = this.props.upload.getSharenameAndPrepath();

      this.props.upload.cacheFile(
        filesIterator.map(info => ({
          name: info.webkitRelativePath || info.name,
          type: info.webkitRelativePath || info.name.split('.').pop(),
          sharename,
          abspath: info.path,
          size: info.size,
        })),
        `${host}_${user}_${sharename}`
      );
      this.props.upload.registry(this.props.upload.filesCache, `${host}_${user}_${sharename}`, prepath);
      this.props.upload.clearCache();
      this.uploadDirRef.current.value = '';

      this.props.upload.startTasks(`${host}_${user}_${sharename}`);

      this.setState({
        taskDrawerState: state,
      });
    }
  }

  handleOpenTask = () => {
    this.setState({
      taskDrawerState: true,
    });
  }
  drawerClose = () => {
    this.setState({
      taskDrawerState: false,
    });
  }
  handleCreateDir = () => {
    this.setState({
      createCifsDirModal: true,
    });
  }

  changeState = (name, text) => {
    this.setState({
      [name]: text,
    });
  }

  getRegionTaskTypeLength = (storage, region) => {
    const state = {
      uploading: 0,
      error: 0,
    };
    (storage.get(region) || []).forEach((item) => {
      state[item.state] += 1;
    });
    return state;
  }

  handleDrawerClose = () => {
    this.setState({
      taskDrawerState: false,
    });
  }

  handleRefresh = (e) => {
    this.props.CifsDir.getCifsDirList();
  }

  handleSetup = (e) => {
    this.props.changeParentState('attrSettingModal', true);
  }

  handleDelete = (e) => {
    e.stopPropagation();
    const { lang } = this.props.lang;
    const { curSelected } = this.props.CifsDir;
    const { prepath, sharename } = this.props.upload.getSharenameAndPrepath();
    this.props.modalActions.showModal({
      title: lang.delete,
      type: 'error',
      message: lang.deleteDirOrFileTip,
      okText: lang.confirm,
      cancelText: lang.cancel,
      success: () => {
        const pathArr = [];
        for (let i = 0; i < curSelected.length; i += 1) {
          pathArr.push(`${prepath}/${curSelected[i].name}`);
        }
        const para = {
          host: sessionStorage.getItem('rhinodisk_current_host') || '',
          path: pathArr,
          sharename,
          operator: sessionStorage.getItem('login_user') || '',
        };
        this.props.CifsDir.delDirsOrFiles(para);
      },
    });
  }

  render() {
    const { lang } = this.props.lang;
    const { sharename, prepath, host, user, region } = this.props.upload.getSharenameAndPrepath();
    console.log(region, this.props.upload);
    const { uploading, error } = this.getRegionTaskTypeLength(this.props.upload.fileStorage, 'default');
    return (
      <div>
        <Tooltip placement="bottom" title={lang.uploadFiles}>
          <input type="file" multiple style={{display: 'none'}} onChange={this.handleUploadFiles} ref={this.uploadFileRef}/>
          <i
            className="iconfont icon-upload-file iconitem"
            onClick={e => this.uploadFileRef.current.click()}
          />
        </Tooltip>
        <Tooltip placement="bottom" title={lang.uploadDirs}>
          <input type="file" webkitdirectory="" directory="" multiple style={{display: 'none'}} onChange={this.handleUploadDirs} ref={this.uploadDirRef}/>
          <i
            className="iconfont icon-upload-folder iconitem"
            onClick={e => this.uploadDirRef.current.click()}
          />
        </Tooltip>
        <Tooltip placement="bottom" title={lang.taskManagement}>
          <Badge
            size="small"
            count={uploading}
            overflowCount={999}
            style={{
              backgroundColor: '#f43d3d',
            }}
          >
            <i
              className="iconfont icon-task iconitem"
              onClick={e => this.handleOpenTask(e)}
              style={{ margin: '0 0 0 20px' }}
            />
          </Badge>
        </Tooltip>
        {
          this.state.uploadModalState &&
          <Upload
            visible={this.state.uploadModalState}
            upload={this.props.upload}
            changeModel={this.handleUpload}
            handleOpenTask={this.handleOpenTask}
          />
        }
        <TaskDrawer
          visible={this.state.taskDrawerState}
          upload={this.props.upload}
          drawerClose={this.drawerClose}
          prepath={prepath}
          host={host}
          user={user}
          sharename={sharename}
          region={region}
        />
      </div>
    );
  }
}

export default UploadPage;