/**
* @name: shell code
* @description: shell错误返回码信息
*/

function codeMessage(type, value) {
  const code = {
    shell: {
      0: 'Exec Success', // 执行成功
      1: 'Exec Fail', // 执行失败
      2: 'Fatal Error', // 严重错误
      126: 'Permission Dismissed', // 权限禁止
    },
    js: {
      0: 'Exec Success', // 执行成功
      1: 'Exec Fail', // 执行失败
      2: 'Fatal Error', // 严重错误
      126: 'Permission Dismissed', // 权限禁止
    },
  };
  const message = (code[type] && code[type][value]) ? code[type][value] : 'Unknown Status';

  return message;
}

export default codeMessage;
