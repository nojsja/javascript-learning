import React, { Component } from 'react';
import { Row, Col, Drawer, Table, Input, Progress, Tooltip, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import { formatSizeStr, fileTypeFilter } from 'utils/utils';
import TabButton from 'components/TabButton';

const { Search } = Input;
const { Option } = Select;


/* *************** UTILS *************** */

const UTILS = {
  getFileType: (file) => {
    const typeMap = {
      audio: true,
      video: true,
      image: true,
      zip: true,
    };
    let type = fileTypeFilter(file);
    type = (!typeMap[type.file_display_type]) ? 'file-normal' : `file-${type.file_display_type}`;
    return type;
  },
  getTasksNumber: (num) => {
    const number = Number(num);
    if (number >= 1000) {
      return '(999+)';
    }
    if (number === 0) {
      return '';
    }
    return `(${num})`;
  },
  getTaskTypeNumber: (upload, sharename, isHistory = false) => {
    const taskTypeNumber = {
      uninitial: 0, // 未初始化的已注册文件
      pending: 0, // 准备态
      uploading: 0, // 上传态
      break: 0, // 完成
      error: 0, // 错误
      pause: 0, // 暂停
      all: 0, // 所有
    };
    (upload[isHistory ? 'fileStorageHistory' : 'fileStorage'].get(sharename) || []).forEach((item) => {
      taskTypeNumber[item.state] += 1;
      taskTypeNumber.all += 1;
    });
    return taskTypeNumber;
  },
  // modal text
  modalText: (lang, action) => ({
    title: lang[`upload_${action}`],
    message: lang[`upload_${action}Tip`],
  }),
  // 获取任务指示状态
  getUploadStatus: (state) => {
    if (state === 'uploading') {
      return 'active';
    }
    if (state === 'pause') {
      return undefined;
    }
    if (state === 'error') {
      return 'exception';
    }
    return undefined;
  },
  // 任务筛选
  tasksFilter: (tasks, filter, keywords) => {
    let stateArray = ['uninitial', 'pending', 'uploading', 'break', 'pause', 'error'];
    switch (filter) {
      case 'all':
        break;
      case 'uploading':
        stateArray = ['uploading', 'pause'];
        break;
      case 'break':
        stateArray = ['break'];
        break;
      case 'error':
        stateArray = ['error'];
        break;
      case 'history':
        stateArray = ['uninitial', 'pending', 'uploading', 'break', 'pause', 'error', 'init'];
        break;
      default:
        break;
    }
    return tasks.filter((task) => {
      const hasKeywords = task.name.includes(keywords) || task.type.includes(keywords);
      return stateArray.includes(task.state) && hasKeywords;
    });
  },
  // 上传历史数据构造
  formatHistoryData: (files, lang, that) => {
    const State = UTILS.getTaskTypeNumber(that.props.upload, that.props.region, 'history');
    const header = [
      {
        title: 'ID',
        dataIndex: 'ID',
        key: 'ID',
        render: text => (<span style={{ minWidth: '2rem', display: 'inline-block' }}>{text}</span>),
      },
      // {
      //   title: lang.type,
      //   dataIndex: 'type',
      //   key: 'upload_task_type',
      // },
      {
        title: lang.name,
        dataIndex: 'name',
        key: 'upload_task_name',
        render: (text, record) => (
          <div className="upload-item-wrapper">
            <i className={`iconfont icon-${UTILS.getFileType(record)}`} />&nbsp;
            <span className="upload-item-name" title={text}>{text}</span>
          </div>
        ),
      },
      {
        title: lang.size,
        key: 'upload_task_size',
        dataIndex: 'size_format',
        render: (text, record) => (
          <div className="upload-item-progress">
            <span>
              <Progress
                percent={Number(text) * 100}
                status={UTILS.getUploadStatus(record.state)}
                showInfo={false}
              />
              <div className="item-progress-label">{formatSizeStr(record.size)}</div>
            </span>
          </div>
        ),
      },
      // {
      //   title: lang.SPEED,
      //   key: 'upload_task_speed',
      //   dataIndex: 'speed',
      //   render: text => (
      //     <div className="upload-item-speed">{text}</div>
      //   ),
      // },
      {
        // title: lang.status,
        title: (
          <Select size="small" className="dt_select_no_border" value={that.state.historyTaskFilter} style={{ width: 100 }} onChange={that.historyTaskTypeChange}>
            <Option value="all">{lang.all}{UTILS.getTasksNumber(State.all)}</Option>
            <Option value="break">{lang.alreadyDone}{UTILS.getTasksNumber(State.break)}</Option>
            <Option value="error">{lang.Failed}{UTILS.getTasksNumber(State.error)}</Option>
          </Select>
        ),
        key: 'upload_task_status',
        dataIndex: 'state',
        render: text => (<div className="upload-item-state">{lang[text]}</div>),
      },
      {
        title: lang.creationTime,
        key: 'upload_task_creationTime',
        dataIndex: 'creationTime',
      },
      {
        title: lang.completionTime,
        key: 'upload_task_completionTime',
        dataIndex: 'completionTime',
      },
      {
        title: (
          <span>
            {/* <div className="drawer-action-title">{lang.operation}</div> */}
            {
              files.length ?
                <div className="drawer-action-title">
                  <Tooltip placement="bottom" title={lang.ReUploadSelectedTasks}>
                    <i
                      // title={lang.reupload}
                      data-action="restartAllTasksHistory"
                      className="iconfont icon-shuaxin hoverPointer"
                      onClick={that.taskOperation}
                    />
                  </Tooltip>
                  <Tooltip placement="bottom" title={lang.DeleteSelectedTasks}>
                    <i
                      title={lang.delete}
                      data-action="removeAllTasksHistory"
                      className="iconfont icon-cuo hoverPointer"
                      onClick={that.taskOperation}
                    />
                  </Tooltip>
                </div> : null
            }
          </span>
        ),
        key: 'upload_task_operation',
        dataIndex: 'operation',
        render: (text, record) => (
          <div
            className="upload_task_operation drawer-action-title"
          >
            {record.state === 'error' && (
            <Tooltip placement="bottom" title={lang.reupload}>
              <i
                // title={lang.reupload}
                data-action="restartOneTaskHistory"
                className="iconfont icon-shuaxin hoverPointer"
                onClick={that.taskOperation}
                attr-name={record.name}
                attr-type={record.type}
                attr-size={record.size}
                attr-id={record.id}
              />
            </Tooltip>
            )}
            {true && (
            <Tooltip placement="bottom" title={lang.delete}>
              <i
                // title={lang.delete}
                data-action="removeOneTaskHistory"
                className="iconfont icon-cuo warningColor hoverPointer"
                onClick={that.taskOperation}
                attr-name={record.name}
                attr-type={record.type}
                attr-size={record.size}
                attr-id={record.id}
              />
            </Tooltip>
            )}
          </div>
        ),
      },
    ];

    const data =
      (UTILS.tasksFilter(files, that.state.historyTaskFilter, that.state.keywords)).map((file, i) => {
        file.ID = i + 1;
        file.key = file.id;
        file.size_format = file.total === 0 ? 1 : (file.index / file.total).toFixed(2);
        return file;
      });

    return { data, header };
  },
  // 上传记录表格数据构造
  formatData: (files, lang, that) => {
    const State = UTILS.getTaskTypeNumber(that.props.upload, that.props.region);
    const header = [
      {
        title: 'ID',
        dataIndex: 'ID',
        key: 'ID',
        render: text => (<span style={{ minWidth: '2rem', display: 'inline-block' }}>{text}</span>),
      },
      // {
      //   title: lang.type,
      //   dataIndex: 'type',
      //   key: 'upload_task_type',
      // },
      {
        title: lang.name,
        dataIndex: 'name',
        key: 'upload_task_name',
        render: (text, record) => (
          <div className="upload-item-wrapper">
            <i className={`iconfont icon-${UTILS.getFileType(record)}`} />&nbsp;
            <span className="upload-item-name" title={text}>{text}</span>
          </div>
        ),
      },
      {
        title: lang.size,
        key: 'upload_task_size',
        dataIndex: 'size_format',
        render: (text, record) => (
          <div className="upload-item-progress">
            <span>
              <Progress
                percent={Number(text) * 100}
                status={UTILS.getUploadStatus(record.state)}
                showInfo={false}
              />
              <div className="item-progress-label">{formatSizeStr(record.size)}</div>
            </span>
          </div>
        ),
      },
      {
        title: lang.SPEED,
        key: 'upload_task_speed',
        dataIndex: 'speed',
        render: text => (
          <div className="upload-item-speed">{text}</div>
        ),
      },
      {
        // title: lang.status,
        title: (
          <Select size="small" className="dt_select_no_border" value={that.state.taskFilter} style={{ width: 100 }} onChange={that.taskTypeChange}>
            <Option value="all">{lang.all}{UTILS.getTasksNumber(State.all)}</Option>
            <Option value="break">{lang.alreadyDone}{UTILS.getTasksNumber(State.break)}</Option>
            <Option value="uploading">{lang.uploading}{UTILS.getTasksNumber(State.uploading)}</Option>
            <Option value="error">{lang.Failed}{UTILS.getTasksNumber(State.error)}</Option>
          </Select>
        ),
        key: 'upload_task_status',
        dataIndex: 'state',
        render: text => (<div className="upload-item-state">{lang[text]}</div>),
      },
      {
        title: lang.creationTime,
        key: 'upload_task_creationTime',
        dataIndex: 'creationTime',
      },
      {
        title: lang.completionTime,
        key: 'upload_task_completionTime',
        dataIndex: 'completionTime',
      },
      {
        title: (
          <span>
            {/* <div className="drawer-action-title">{lang.operation}</div> */}
            {
              files.length ?
                <div className="drawer-action-title">
                  <Tooltip placement="bottom" title={lang.StartSelectedTasks}>
                    <i
                      // title={lang.Start}
                      data-action="startAllTasks"
                      className="iconfont icon-qidong hoverPointer"
                      onClick={that.taskOperation}
                    />
                  </Tooltip>
                  <Tooltip placement="bottom" title={lang.PauseSelectedTasks}>
                    <i
                      // title={lang.Pause}
                      data-action="pauseAllTasks"
                      className="iconfont icon-icon- hoverPointer"
                      onClick={that.taskOperation}
                    />
                  </Tooltip>
                  {/* <i
                    title={lang.continueTransport}
                    data-action="retryAllTasks"
                    className="iconfont icon-zhongqi1 hoverPointer"
                    onClick={that.taskOperation}
                  /> */}
                  <Tooltip placement="bottom" title={lang.ReUploadSelectedTasks}>
                    <i
                      // title={lang.reupload}
                      data-action="restartAllTasks"
                      className="iconfont icon-shuaxin hoverPointer"
                      onClick={that.taskOperation}
                    />
                  </Tooltip>
                  <Tooltip placement="bottom" title={lang.DeleteSelectedTasks}>
                    <i
                      // title={lang.delete}
                      data-action="removeAllTasks"
                      className="iconfont icon-cuo hoverPointer"
                      onClick={that.taskOperation}
                    />
                  </Tooltip>
                </div> : null
            }
          </span>
        ),
        key: 'upload_task_operation',
        dataIndex: 'operation',
        render: (text, record) => (
          <div
            className="upload_task_operation drawer-action-title"
          >
            {record.state === 'pause' && (
            <Tooltip placement="bottom" title={lang.Start}>
              <i
                // title={lang.Start}
                data-action="startOneTask"
                className="iconfont icon-qidong hoverPointer"
                onClick={that.taskOperation}
                attr-name={record.name}
                attr-type={record.type}
                attr-size={record.size}
                attr-id={record.id}
              />
            </Tooltip>)}
            {record.state === 'uploading' && (
            <Tooltip placement="bottom" title={lang.Pause}>
              <i
                // title={lang.Pause}
                data-action="pauseOneTask"
                className="iconfont icon-icon- hoverPointer"
                onClick={that.taskOperation}
                attr-name={record.name}
                attr-type={record.type}
                attr-size={record.size}
                attr-id={record.id}
              />
            </Tooltip>
            )}
            {/* {record.state === 'error' && (<i
              title={lang.continueTransport}
              data-action="retryOneTask"
              className="iconfont icon-zhongqi1 hoverPointer"
              onClick={that.taskOperation}
              attr-name={record.name}
              attr-type={record.type}
              attr-size={record.size}
              attr-id={record.id}
            />)} */}
            {record.state === 'error' && (
            <Tooltip placement="bottom" title={lang.reupload}>
              <i
                // title={lang.reupload}
                data-action="restartOneTask"
                className="iconfont icon-shuaxin hoverPointer"
                onClick={that.taskOperation}
                attr-name={record.name}
                attr-type={record.type}
                attr-size={record.size}
                attr-id={record.id}
              />
            </Tooltip>
            )}
            {true && (
            <Tooltip placement="bottom" title={lang.delete}>
              <i
                // title={lang.delete}
                data-action="removeOneTask"
                className="iconfont icon-cuo warningColor hoverPointer"
                onClick={that.taskOperation}
                attr-name={record.name}
                attr-type={record.type}
                attr-size={record.size}
                attr-id={record.id}
              />
            </Tooltip>
            )}
          </div>
        ),
      },
    ];

    const data =
      (UTILS.tasksFilter(files, that.state.taskFilter, that.state.keywords)).map((file, i) => {
        file.ID = i + 1;
        file.key = file.id;
        file.size_format = file.total === 0 ? 1 : (file.index / file.total).toFixed(2);
        return file;
      });

    return { data, header };
  },
};

/* *************** COMPONENT CLASS *************** */

@inject('lang', 'modalActions')
@observer
class CifsDirUploadTasksDrawer extends Component {
  state = {
    historyTaskFilter: 'all',
    taskFilter: 'all',
    mainFilter: 'current',
    pageCount: 20,
    nowPage: 1,
    keywords: '',
  };

  componentDidMount() {
    console.log('mount - getUploadRecordsRequest ------------------ ');
    this.props.upload.getUploadRecordsRequest({
      host: this.props.host,
      username: this.props.user,
      sharename: this.props.sharename,
      region: this.props.region,
      prefix: this.props.prepath,
    });
    this.props.upload.isUploadListEmpty(this.props.region, false);
  }

  setAttr = (attrObj) => {
    this.setState(attrObj);
  }

  taskOperation = (e) => {
    const actionStr = e.target.getAttribute('data-action');
    const taskID = e.target.getAttribute('attr-id');
    const action = this[actionStr];
    const controled = [
      'startAllTasks', 'pauseAllTasks', 'removeOneTask', 'removeOneTaskHistory',
      'removeAllTasks', 'removeAllTasksHistory', 'retryAllTasks', 'restartAllTasks',
      'restartAllTasksHistory',
    ];
    const { lang } = this.props.lang;
    const file = {
      name: e.target.getAttribute('attr-name'),
      type: e.target.getAttribute('attr-type'),
      size: e.target.getAttribute('attr-size'),
    };
    if (controled.includes(actionStr)) {
      this.props.modalActions.showModal({
        title: UTILS.modalText(lang, actionStr).title,
        message: UTILS.modalText(lang, actionStr).message,
        type: 'info',
        okText: lang.OK,
        cancelText: lang.cancel,
        success: () => {
          this.props.modalActions.hideModal();
          action(file, taskID);
        },
      });
    } else {
      action(file, taskID);
    }
  }

  mainTabsChange = (v) => {
    this.setState({
      mainFilter: v,
      nowPage: 1,
    });
  }

  historyTaskTypeChange = (v) => {
    this.setState({
      historyTaskFilter: v,
      nowPage: 1,
    });
  }

  taskTypeChange = (v) => {
    this.setState({
      taskFilter: v,
      nowPage: 1,
    });
  }

  pageFilter =
    tasks => tasks.filter((task, i) => this.state.pageCount * this.state.nowPage > (i + 1)
      && this.state.pageCount * (this.state.nowPage - 1) <= i + 1)

  /* -------------- ui actions -------------- */
  toggleTaskBar = () => {
    const { upload } = this.props;
  }

  /* -------------- actions -------------- */

  startOneTask = (file, id) => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');
    const { sharename } = this.props;

    upload.uploadContinue({
      file,
      region: `${host}_${user}_${sharename}`,
      id,
    });
  }

  startAllTasks = () => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');
    const { sharename } = this.props;
    upload.uploadContinue({
      select: true,
      all: false,
      region: `${host}_${user}_${sharename}`,
    });
  }

  pauseOneTask = (file, id) => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');
    const { sharename } = this.props;

    upload.uploadPause({
      file,
      region: `${host}_${user}_${sharename}`,
      id,
    });
  }

  pauseAllTasks = () => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');
    const { sharename } = this.props;

    upload.uploadPause({
      select: true,
      all: false,
      region: `${host}_${user}_${sharename}`,
    });
  }

  removeOneTask = (file, id) => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');
    const { sharename } = this.props;

    upload.uploadTerm({
      file,
      region: `${host}_${user}_${sharename}`,
      id,
    });
  }

  removeOneTaskHistory = (file, id) => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');
    const { sharename } = this.props;

    upload.uploadTermHistory({
      file,
      region: `${host}_${user}_${sharename}`,
      id,
    });
  }

  removeAllTasks = () => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');
    const { sharename } = this.props;

    upload.uploadTerm({
      select: true,
      all: false,
      region: `${host}_${user}_${sharename}`,
    });
  }

  removeAllTasksHistory = () => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');
    const { sharename } = this.props;

    upload.uploadTermHistory({
      select: true,
      all: false,
      region: `${host}_${user}_${sharename}`,
    });
  }

  retryOneTask = (file, id) => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');
    const { sharename } = this.props;

    upload.uploadRestore({
      file,
      region: `${host}_${user}_${sharename}`,
      id,
    });
  }


  retryAllTasks = () => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');
    const { sharename } = this.props;

    upload.uploadRestore({
      select: true,
      all: false,
      region: `${host}_${user}_${sharename}`,
    });
  }

  restartOneTask = (file, id) => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');

    const { sharename } = this.props;

    upload.uploadRestore({
      file,
      reset: true,
      region: `${host}_${user}_${sharename}`,
      id,
    });
  }

  restartOneTaskHistory = (file, id) => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');

    const { sharename } = this.props;

    upload.uploadRestoreHistory({
      file,
      reset: true,
      region: `${host}_${user}_${sharename}`,
      id,
    });
  }

  restartAllTasks = (file) => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');
    const { sharename } = this.props;
    upload.uploadRestore({
      file,
      select: true,
      all: false,
      reset: true,
      region: `${host}_${user}_${sharename}`,
    });
  }

  restartAllTasksHistory = (file, id) => {
    const { upload } = this.props;
    const host = window.sessionStorage.getItem('rhinodisk_current_host');
    const user = window.sessionStorage.getItem('login_user');

    const { sharename } = this.props;

    upload.uploadRestoreHistory({
      file,
      select: true,
      all: false,
      reset: true,
      region: `${host}_${user}_${sharename}`,
      id,
    });
  }

  // rowSelection object indicates the need for row selection
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.props.upload.selectItem(selectedRows);
    },
    selectedRowKeys: [],
  };

  onSearch = (key) => {
    this.setState({
      keywords: key,
    });
  }

  render() {
    const {
      upload, visible, drawerClose, sharename, region,
    } = this.props;
    const { lang } = this.props.lang;
    const { mainFilter } = this.state;
    // const State = UTILS.getTaskTypeNumber(upload, region);
    const { header, data } = (mainFilter === 'history') ?
      UTILS.formatHistoryData(
        upload.fileStorageHistory.get(region) ? upload.fileStorageHistory.get(region) : [],
        lang || {}, this
      ) :
      UTILS.formatData(
        upload.fileStorage.get(region) ? upload.fileStorage.get(region) : [],
        lang || {}, this
      );
    const total = (upload.fileStorage.get(region) ? upload.fileStorage.get(region) : []).length;
    this.rowSelection.selectedRowKeys = this.props.upload.selectedKeys;
    return (
      <Drawer
        className="dt-drawer-wrapper"
        // title={lang.taskManagement}
        title={
          <div className="dt-drawer-title">
            <span>{lang.taskManagement}</span>
            <div>
              <TabButton
                onChange={this.mainTabsChange}
                defaultActiveKey={mainFilter}
                tabs={[
                {
                  text: `${lang.allTasks}${UTILS.getTasksNumber(total)}`,
                  key: 'current',
                },
                {
                  text: `${lang.History}`,
                  key: 'history',
                },
              ]}
              />
              <div className="upload-drawer-tabs">
                <div className="upload-drawer-search">
                  <Row>
                    <Col span={24}>
                      <Tooltip placement="bottom" title={lang.EnterKeyWordSearch}>
                        <Search
                          size="small"
                          // placeholder={lang.EnterKeyWordSearch}
                          onSearch={this.onSearch}
                          style={{ width: 150 }}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>}
        closable={false}
        width="80%"
        onClose={drawerClose}
        visible={visible}
      >
        <div className="upload-drawer-wrapper">
          <div
            className="upload-drawer-list selfScrollbar"
            style={{
              height: document.body.clientHeight - 80,
            }}
          >
            <Table
              className="dt-table-no-border"
              id="uploaderDrawerTable"
              columns={header}
              dataSource={data}
              rowSelection={this.rowSelection}
              pagination={
                {
                  defaultCurrent: 1,
                  size: 'small',
                  defaultPageSize: this.state.pageCount,
                }
              }
            />
          </div>
        </div>
      </Drawer>
    );
  }
}
export default CifsDirUploadTasksDrawer;
