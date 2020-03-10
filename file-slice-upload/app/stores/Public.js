import { observable, action } from 'mobx';

class Public {

  @observable state = {
    activeItem: 'install',
    navActivate: true,
    settingPage: false,
    password: '',
    total: ['install', 'startup', 'clean', 'info'],
  }

  @action setPassword = (passwd) => {

  }
}
export default Public;
