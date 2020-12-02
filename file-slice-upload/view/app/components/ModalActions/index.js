import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button } from 'antd';
import {
  CheckCircleOutlined, InfoCircleOutlined,
  ExclamationCircleOutlined, CloseCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import './modalAction.less';

@inject('modalActions')
@observer
export default class MoadlActions extends Component {
  componentDidMount() { }
  handleOk = () => {
    this.props.modalActions.onOk();
  }
  handleCancel = () => {
    this.props.modalActions.onCancel();
  }
  render() {
    const title = (
      <div style={{ fontSize: '22px', display: 'flex', alignItems: 'center' }}>
        {this.props.modalActions.modalType === 'success' && <span style={{ color: '#52c41a' }}><CheckCircleOutlined /></span>}
        {this.props.modalActions.modalType === 'info' && <span style={{ color: '#1890ff' }}><InfoCircleOutlined /></span>}
        {this.props.modalActions.modalType === 'warning' && <span style={{ color: '#faad14' }}><ExclamationCircleOutlined /></span>}
        {this.props.modalActions.modalType === 'error' && <span style={{ color: '#f5222d' }}><CloseCircleOutlined /></span>}
        {this.props.modalActions.modalType === 'confirm' && <span style={{ color: '#faad14' }}><QuestionCircleOutlined /></span>}
        <span style={{ fontSize: '16px', fontWeight: '500', marginLeft: '16px' }}>{this.props.modalActions.modalTitle}</span>
      </div>
    );
    return (
      <Modal
        title={title}
        className="dtModalGroup"
        visible={this.props.modalActions.modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        confirmLoading={this.props.modalActions.modalLoading}
        width={this.props.modalActions.modalWidth}
        destroyOnClose
        centered
        zIndex={10000}
        closable={this.props.modalActions.closable}
        footer={
          this.props.modalActions.closable !== false ?
          [
            <Button
              key="back"
              ghost
              onClick={this.handleCancel}
              type={this.props.modalActions.cancelBtnType}
            >
              {this.props.modalActions.modalCancelText}
            </Button>,
          ].concat(this.props.modalActions.onlyCancel ? [] : [
            <Button
              key="submit"
              ghost
              type={this.props.modalActions.okBtnType}
              onClick={this.handleOk}
            >
              {this.props.modalActions.modalOkText}
            </Button>,
          ]) :
          [
            <Button
              key="submit"
              ghost
              type={this.props.modalActions.okBtnType}
              onClick={this.handleOk}
            >
              {this.props.modalActions.modalOkText}
            </Button>,
          ]

        }
      >
        {this.props.modalActions.modalMessage}
      </Modal>
    );
  }
}
