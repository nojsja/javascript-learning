import { observable, action } from 'mobx';

class ModalActions {
  @observable modalVisible = false;
  @observable modalTitle = '';
  @observable modalType = 'success';
  @observable modalMessage = '';
  @observable modalWidth = 400;
  @observable modalCancelText = 'Cancel';
  @observable modalOkText = 'Sure';
  @observable modalSuccessFunc = ''
  @observable okBtnType = 'danger'
  @observable cancelBtnType = 'primary'
  @observable onlyCancel = false
  @action showModal = (target) => {
    this.modalTitle = target.title || '';
    this.modalType = target.type || 'success';
    this.modalMessage = target.message || '';
    this.modalWidth = target.width || 400;
    this.modalOkText = target.okText || null;
    this.modalCancelText = target.cancelText || 'Cancel';
    this.modalSuccessFunc = target.success || '';
    this.modalCancelFunc = target.cancel || '';
    this.okBtnType = target.okType || 'danger';
    this.cancelBtnType = target.cancelType || 'primary';
    this.modalVisible = true;
    this.closable = target.closable;
    this.onlyCancel = target.onlyCancel || false;
  }
  @action hideModal = () => {
    this.modalVisible = false;
  }
  @action onOk = () => {
    if (this.modalSuccessFunc !== '') {
      this.modalSuccessFunc();
    }
    this.modalVisible = false;
  }
  @action onCancel = () => {
    if (this.modalCancelFunc !== '') {
      this.modalCancelFunc();
    }
    this.modalVisible = false;
  }
}
export default ModalActions;
