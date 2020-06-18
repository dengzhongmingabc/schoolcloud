<template>
  <a-modal
    title="新建规则"
    destroyOnClose
    :width="400"
    :visible="visible"
    :confirmLoading="loading"
    @ok="submitData"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <template>
        <a-tree
          checkable
          :tree-data="allTreeData"
          :default-checked-keys="allCheckedData"
          :replace-fields="replaceFields"
          @check="onCheck"
        />
      </template>
    </a-spin>
  </a-modal>
</template>

<script>


import pick from 'lodash.pick'

// 表单字段
const fields = ['description', 'id']

import { settingRolePermission } from '@/api/sysManage'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      allCheckedData:[],
      allTreeData:[],
      replaceFields: {
        key: 'id',
        title: 'name'
      },
    };
  },
  methods: {
    onCheck(checkedKeys, info) {
      this.allCheckedData = [...checkedKeys,...info.halfCheckedKeys]
      console.log(this.allCheckedData)
      console.log('onCheck', checkedKeys, info);
    },

    reloadTree(args){
      console.log("----xxx---xx--",args);
       this.allCheckedData = args.result.permissions
       this.allTreeData = args.result.treeData
      console.log("----xxx---xx--",this.allCheckedData);
    },
    submitData(){
      let args = {}
      args.roleId = this.model.roleId
      args.permissionsIdStr=this.allCheckedData.join(",")
      console.log(args.permissionsIdStr);
      settingRolePermission(args).then(response => {
        this.$emit('ok');
      })
    }
  }
}
</script>
