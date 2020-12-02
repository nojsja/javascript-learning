import { observable, action } from 'mobx';
class Public {

  @observable lang = {
    template_tree_max_level_tips: '已经限制模板树的最大深度为：',
    pleaseCompleteTheNodeBeingEdited: '请完善当前正在编辑的节点数据！',
    extendedMetadata_same_level_name_cannot_be_added: '同层级已经有同名节点被添加！',
    pleaseInputKeyOrValue: '请至少输入键名或键值！',
    json_format_invalid: '导入的数据不合法！',
    KeyAndValueIsNotAllEmpty: '键名和键值不能都为空！',
    confirm: '确认',
    cancel: '取消',
    addSisterNode: '添加同级节点',
    addSubNode: '添加子级节点',
    addYamlNode: 'yaml输入',
    deleteLevel: '删除层级',
  }
}
export default Public;
