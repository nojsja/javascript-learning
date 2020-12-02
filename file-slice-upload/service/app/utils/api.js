module.exports = {
  public: {
    // 节点列表
    login: {
      url: '/api/identify/user/login',
      method: 'post',
      port: '80'
    },
    info: {
      url: '/api/identify/user/info',
      method: 'post',
      port: '80'
    },
    logout: {
      url: '/api/identify/user/logout',
      method: 'post',
      port: '80'
    },
    editPwd: {
      url: '/api/identify/user/editpwd',
      method: 'post',
      port: '80',
      'access-token': 'X7yABwjE20sUJLefATUFqU0iUs8mJPqEJo6iRnV63mI=',
    }
  },
  smb: {
    login: {
      url: '',
      port: ''
    }
  }
}