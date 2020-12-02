const _node = {
  upload_index_overflow: '分片索引值超过最大分片数！',
  readDataFailed: '读取数据失败！',
  writeDataFailed: '数据写入失败！',
  syncDataFailed: '同步数据失败！',
  insufficientPermissionUpload: '上传文件权限不足！',
  app_quit_tips: '有任务正在进行，若退出程序，系统将自动终止所有任务，是否确认退出程序？',
  unc_connection_failed: 'UNC连接失败！',
  create_folder_failed: '新建文件夹失败！请确认是否有文件写入权限',
  delete_file_failed: '删除失败！请确认文件操作权限和cifs共享的worm启用状态：',
  rename_file_failed: '重命名失败！请确认文件操作权限和cifs共享的worm启用状态：',
}

module.exports = _node;
